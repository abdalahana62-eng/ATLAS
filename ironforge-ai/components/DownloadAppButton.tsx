'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Download, X, CheckCircle, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Website-only: hidden inside the APK app (Capacitor)
export default function DownloadAppButton() {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const [isApp, setIsApp] = useState(true); // hide until proven website
  const [apkUrl, setApkUrl] = useState('https://github.com/abdalahana62-eng/ATLAS/releases/latest');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if ((window as any).Capacitor) { setIsApp(true); return; }
    } catch {}
    setIsApp(false);
    fetch('/api/latest', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { if (d?.url) setApkUrl(d.url); })
      .catch(() => {});
  }, []);

  if (isApp) return null;

  const steps = isAr ? [
    'دوس زرار "تحميل الـ APK" تحت وحمّل الملف',
    'افتح الملف من إشعارات التحميل',
    'لو الموبايل قال "تثبيت من مصادر غير معروفة" دوس "سماح" للمتصفح',
    'دوس "تثبيت" واستنى ثواني',
    'افتح ATLAS وسجّل بحساب جوجل وابدأ تجربتك المجانية 🎉',
  ] : [
    'Tap "Download APK" below',
    'Open the file from notifications',
    'If asked, allow "Install unknown apps" for your browser',
    'Tap Install and wait',
    'Open ATLAS, sign in with Google and start your free trial 🎉',
  ];

  return (
    <>
      <Button onClick={() => setOpen(true)} className="bg-ironforge-primary hover:bg-ironforge-primary-dark text-black">
        <Download className="h-4 w-4" />
        {isAr ? 'تحميل التطبيق' : 'Download App'}
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md rounded-2xl bg-ironforge-card border border-ironforge-border p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-ironforge-text flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-ironforge-primary" />
                {isAr ? 'تثبيت التطبيق على موبايلك' : 'Install on your phone'}
              </h3>
              <button onClick={() => setOpen(false)} className="text-ironforge-text-muted hover:text-ironforge-text"><X className="w-5 h-5" /></button>
            </div>
            <ol className="space-y-3 mb-6">
              {steps.map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-ironforge-text">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ironforge-primary/20 text-ironforge-primary text-xs font-bold">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
            <a href={apkUrl} target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center gap-2 rounded-xl bg-ironforge-primary py-3 font-bold text-black hover:bg-ironforge-primary-dark transition">
              <Download className="w-5 h-5" />
              {isAr ? 'تحميل الـ APK' : 'Download APK'}
            </a>
            <p className="mt-3 flex items-center justify-center gap-1 text-xs text-ironforge-text-muted">
              <CheckCircle className="w-3 h-3 text-emerald-400" />
              {isAr ? 'آمن 100% — من صفحة إصدارات ATLAS الرسمية' : '100% safe — from official ATLAS releases'}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
