#!/usr/bin/env node
// Wrapper for `next build` that hides app/api during Capacitor static export.
// With `output: export` (BUILD_TARGET=capacitor), Next tries to prerender /api routes
// and fails on `request.headers` (dynamic). The APK never uses local /api (it calls
// atlasfit.pro via apiBase.ts), so we hide the routes for the export build only.
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const isCapacitor = process.env.BUILD_TARGET === 'capacitor';
const apiDir = path.join(__dirname, '..', 'app', 'api');
const bakDir = path.join(__dirname, '..', 'api.bak');

let hid = false;
if (isCapacitor && fs.existsSync(apiDir)) {
  try {
    fs.renameSync(apiDir, bakDir);
    hid = true;
    console.log('[build] Capacitor export: hid app/api to avoid prerender errors');
  } catch (e) {
    console.error('[build] failed to hide app/api', e);
  }
}

const result = spawnSync('npx', ['next', 'build'], { stdio: 'inherit', shell: true });

if (hid) {
  try {
    if (fs.existsSync(bakDir)) fs.renameSync(bakDir, apiDir);
    console.log('[build] restored app/api');
  } catch (e) {
    console.error('[build] failed to restore app/api', e);
  }
}

process.exit(result.status ?? 1);
