#!/usr/bin/env node
// يحقن AdMob App ID في android/app/src/main/... بعد `npx cap add android`
// الاستخدام:
//   node scripts/setup-admob.js --app-id=ca-app-pub-3940256099942544~3347511713
// لو ما بعت app-id هيستخدم الـ Test App ID بتاع أندرويد تلقائياً (آمن قبل النشر).
// السكربت idempotent: لو القيمة موجودة بيحدّثها بدل ما يكررها.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const args = process.argv.slice(2);
const appIdArg = args.find((a) => a.startsWith('--app-id='));
const APP_ID = (appIdArg ? appIdArg.split('=')[1] : '').trim()
  || 'ca-app-pub-3940256099942544~3347511713';

const manifestPath = path.join(root, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
const stringsPath = path.join(root, 'android', 'app', 'src', 'main', 'res', 'values', 'strings.xml');
const plistPath = path.join(root, 'ios', 'App', 'App', 'Info.plist');

let changed = [];

if (fs.existsSync(manifestPath)) {
  let xml = fs.readFileSync(manifestPath, 'utf8');
  if (!xml.includes('com.google.android.gms.ads.APPLICATION_ID')) {
    xml = xml.replace(
      /<application([\s\S]*?)>/,
      `<application$1>\n        <meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" android:value="@string/admob_app_id" />`
    );
    changed.push('AndroidManifest: added APPLICATION_ID meta-data');
  }
  fs.writeFileSync(manifestPath, xml);
  console.log('[admob] AndroidManifest OK');
} else {
  console.log('[admob] skip android manifest (no android/ folder yet — run `npx cap add android` first)');
}

if (fs.existsSync(path.dirname(stringsPath))) {
  let strings = fs.existsSync(stringsPath)
    ? fs.readFileSync(stringsPath, 'utf8')
    : '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n</resources>\n';
  if (strings.includes('admob_app_id')) {
    strings = strings.replace(
      /<string name="admob_app_id">.*?<\/string>/,
      `<string name="admob_app_id">${APP_ID}</string>`
    );
    changed.push('strings.xml: updated admob_app_id');
  } else {
    strings = strings.replace(
      /<\/resources>/,
      `    <string name="admob_app_id">${APP_ID}</string>\n</resources>`
    );
    changed.push('strings.xml: added admob_app_id');
  }
  fs.writeFileSync(stringsPath, strings);
  console.log(`[admob] strings.xml OK -> ${APP_ID}`);
}

if (fs.existsSync(plistPath)) {
  let plist = fs.readFileSync(plistPath, 'utf8');
  if (!plist.includes('GADApplicationIdentifier')) {
    plist = plist.replace(
      /<\/dict>/,
      `\t<key>GADApplicationIdentifier</key>\n\t<string>${APP_ID}</string>\n\t<key>GADIsAdManagerApp</key>\n\t<true/>\n\t<key>SKAdNetworkItems</key>\n\t<array>\n\t\t<dict>\n\t\t\t<key>SKAdNetworkIdentifier</key>\n\t\t\t<string>cstr6suwn9.skadnetwork</string>\n\t\t</dict>\n\t</array>\n\t<key>NSUserTrackingUsageDescription</key>\n\t<string>This identifier will be used to deliver personalized ads to you.</string>\n</dict>`
    );
    fs.writeFileSync(plistPath, plist);
    changed.push('Info.plist: added GADApplicationIdentifier');
    console.log('[admob] Info.plist OK');
  } else {
    console.log('[admob] Info.plist already has GADApplicationIdentifier — update manually if needed');
  }
} else {
  console.log('[admob] skip ios plist (no ios/ folder yet)');
}

if (APP_ID.includes('3940256099942544')) {
  console.log('[admob] NOTE: using Google TEST App ID — safe for dev. Replace with real ID before Play release.');
}
if (changed.length) console.log('[admob] changed:', changed.join(' | '));
else console.log('[admob] nothing to change');
