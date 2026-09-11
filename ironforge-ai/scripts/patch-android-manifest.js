// Patches the generated Capacitor AndroidManifest.xml so the OAuth deep link
// (com.atlas.ai://auth/callback) returns from the system browser back into
// the app. Runs in CI after `npx cap sync android` (android/ is gitignored).
// Idempotent: skips if the intent-filter already exists.
const fs = require('fs');
const path = require('path');

const MANIFEST = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
const MARKER = 'com.atlas.ai';

const INTENT_FILTER = `            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="${MARKER}" android:host="auth" android:pathPrefix="/callback" />
            </intent-filter>
`;

function main() {
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
