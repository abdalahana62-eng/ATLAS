// Patches the generated Capacitor AndroidManifest.xml so the OAuth deep link
// (com.atlas.ai://auth/callback) returns from the system browser back into
// the app. Runs in CI after `npx cap sync android` (android/ is gitignored).
// Idempotent: skips if the intent-filter already exists.
// Also ensures a persistent debug keystore so APK updates don't require uninstall.
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

const MANIFEST = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
const BUILD_GRADLE = path.join(__dirname, '..', 'android', 'app', 'build.gradle');
const MARKER = 'com.atlas.ai';

function ensureDebugKeystore() {
  const repoKeystore = path.join(__dirname, '..', 'resources', 'debug.keystore');
  const homeKeystore = path.join(os.homedir(), '.android', 'debug.keystore');
  try {
    if (fs.existsSync(repoKeystore)) {
      // Use the committed persistent keystore for all builds
      fs.mkdirSync(path.dirname(homeKeystore), { recursive: true });
      fs.copyFileSync(repoKeystore, homeKeystore);
      console.log('[keystore] restored persistent debug.keystore from resources/');
      return;
    }
    // First run on CI: generate a new debug keystore and commit it back
    if (process.env.CI && !fs.existsSync(repoKeystore)) {
      console.log('[keystore] generating new persistent debug.keystore...');
      fs.mkdirSync(path.dirname(homeKeystore), { recursive: true });
      fs.mkdirSync(path.dirname(repoKeystore), { recursive: true });
      // keytool is available on the GitHub Actions runner (Java 21)
      execSync(
        'keytool -genkey -v -keystore "' + homeKeystore + '" -alias androiddebugkey -storepass android -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"',
        { stdio: 'inherit' }
      );
      fs.copyFileSync(homeKeystore, repoKeystore);
      console.log('[keystore] generated and copied to resources/debug.keystore');
      // Commit it back so next builds reuse the same signature (requires GITHUB_TOKEN with workflow scope — will be done via Actions if needed)
      try {
        execSync('git config user.name "github-actions[bot]"', { stdio: 'ignore' });
        execSync('git config user.email "github-actions[bot]@users.noreply.github.com"', { stdio: 'ignore' });
        execSync('git add "' + repoKeystore + '"', { stdio: 'ignore' });
        execSync('git commit -m "chore: persist debug keystore for consistent APK updates" || true', { stdio: 'ignore' });
        execSync('git push || true', { stdio: 'ignore' });
        console.log('[keystore] committed persistent keystore to repo');
      } catch {}
    }
  } catch (e) {
    console.log('[keystore] ensure failed:', e.message);
  }
}

const INTENT_FILTER = `            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="${MARKER}" android:host="auth" android:pathPrefix="/callback" />
            </intent-filter>
`;

function ensureReleaseSigning() {
  if (!fs.existsSync(BUILD_GRADLE)) {
    console.log('[signing] build.gradle not found, skipping:', BUILD_GRADLE);
    return;
  }
  let gradle = fs.readFileSync(BUILD_GRADLE, 'utf8');
  // نحتاج توقيع release بنفس debug keystore عشان التحديث يتثبت فوق القديم بدون حذف
  // نستخدم المسار النسبي من android/app/ إلى resources/debug.keystore
  const keystoreRelative = '../../resources/debug.keystore';
  const repoKeystore = path.join(__dirname, '..', 'resources', 'debug.keystore');
  if (!fs.existsSync(repoKeystore)) {
    console.log('[signing] repo keystore not found, skipping signing patch');
    return;
  }
  if (gradle.includes('ATLAS_RELEASE_STORE_FILE')) {
    console.log('[signing] already patched, skipping');
    return;
  }
  // حقن signingConfigs.release داخل android { ... }
  // نبحث عن `signingConfigs {` أو ننشئه
  if (gradle.includes('signingConfigs')) {
    gradle = gradle.replace(/signingConfigs\s*\{/, `signingConfigs {\n        release {\n            storeFile file('${keystoreRelative}')\n            storePassword 'android'\n            keyAlias 'androiddebugkey'\n            keyPassword 'android'\n        }`);
  } else {
    gradle = gradle.replace(/android\s*\{/, `android {\n    signingConfigs {\n        release {\n            storeFile file('${keystoreRelative}')\n            storePassword 'android'\n            keyAlias 'androiddebugkey'\n            keyPassword 'android'\n        }\n    }`);
  }
  // اربط buildTypes.release بـ signingConfig
  if (gradle.includes('buildTypes')) {
    // أضف signingConfig لكل release block
    gradle = gradle.replace(/(release\s*\{[^}]*)(debuggable\s+false)/, `$1signingConfig signingConfigs.release\n            $2`);
    if (!gradle.includes('signingConfig signingConfigs.release')) {
      gradle = gradle.replace(/release\s*\{/, `release {\n            signingConfig signingConfigs.release`);
    }
  }
  fs.writeFileSync(BUILD_GRADLE, gradle);
  console.log('[signing] patched build.gradle to use persistent debug.keystore for release');
}

function ensurePlayVersion() {
  if (!fs.existsSync(BUILD_GRADLE)) return;
  let gradle = fs.readFileSync(BUILD_GRADLE, 'utf8');
  // Play يتطلب versionCode رقمي يزيد مع كل رفع + versionName نصي (1.1.1)
  const runNumber = parseInt(process.env.GITHUB_RUN_NUMBER || '0', 10) || 0;
  // base مرتفع (1100) عشان أول رفع على بلاي يكون أعلى من أي نسخة APK جانبية قديمة
  const versionCode = 1100 + runNumber;
  const rawTag = process.env.APP_VERSION || process.env.NEXT_PUBLIC_APP_VERSION || '';
  const versionName = rawTag.replace(/^v/, '') || '1.1.1';
  let changed = false;
  if (/versionCode\s+\d+/.test(gradle)) {
    gradle = gradle.replace(/versionCode\s+\d+/, `versionCode ${versionCode}`);
    changed = true;
  }
  if (/versionName\s+["'][^"']*["']/.test(gradle)) {
    gradle = gradle.replace(/versionName\s+["'][^"']*["']/, `versionName "${versionName}"`);
    changed = true;
  }
  // ثبّت applicationId عشان بلاي يعتبر كل رفع تحديث لنفس التطبيق
  if (/applicationId\s+["']/.test(gradle) && !gradle.includes(`applicationId "${MARKER}"`)) {
    gradle = gradle.replace(/applicationId\s+["'][^"']*["']/, `applicationId "${MARKER}"`);
    changed = true;
  }
  if (changed) {
    fs.writeFileSync(BUILD_GRADLE, gradle);
    console.log(`[play-version] versionCode=${versionCode} versionName=${versionName} appId=${MARKER}`);
  } else {
    console.log('[play-version] no version fields found, skipping');
  }
}

function main() {
  ensureDebugKeystore();
  ensureReleaseSigning();
  ensurePlayVersion();
  if (!fs.existsSync(MANIFEST)) {
    console.log('[deep-link] AndroidManifest not found, skipping:', MANIFEST);
    return;
  }
  let xml = fs.readFileSync(MANIFEST, 'utf8');
  if (xml.includes(`android:scheme="${MARKER}"`)) {
    console.log('[deep-link] intent-filter already present, skipping.');
    return;
  }
  // Insert before the closing </activity> of MainActivity (first occurrence
  // of an intent-filter close followed by </activity> anchor: use the first
  // </activity> to stay inside the main activity block).
  const anchor = '</activity>';
  const idx = xml.indexOf(anchor);
  if (idx === -1) {
    console.error('[deep-link] no </activity> anchor found, aborting.');
    process.exit(1);
  }
  xml = xml.slice(0, idx) + INTENT_FILTER + xml.slice(idx);
  fs.writeFileSync(MANIFEST, xml);
  console.log('[deep-link] intent-filter injected for scheme', MARKER);
}

main();
