'use client';

import { useEffect, useState } from 'react';

const CURRENT_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.24';
const REPO = 'abdalahana62-eng/ATLAS';

export default function UpdateChecker() {
  const [updateUrl, setUpdateUrl] = useState<string | null>(null);
  const [latestVersion, setLatestVersion] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // لا تفحص لو مفيش نت
    if (!navigator.onLine) return;

    const check = async () => {
      try {
        const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
          headers: { Accept: 'application/vnd.github.v3+json' },
        });
        if (!res.ok) return;
        const data = await res.json();
        const tag = (data.tag_name || '').replace(/^v/, '');
        const apkAsset = data.assets?.find((a: any) => a.name.endsWith('.apk'));
        const url = apkAsset?.browser_download_url || data.html_url;
        
        if (tag && tag !== CURRENT_VERSION) {
          // قارن بسيط: لو التاج مختلف اعتبره تحديث
          setLatestVersion(tag);
          setUpdateUrl(url);
        }
      } catch {}
    };

    // افحص بعد 3 ثواني من فتح التطبيق
    const t = setTimeout(check, 3000);
    return () => clearTimeout(t);
  }, []);

  if (dismissed || !updateUrl) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 animate-in slide-in-from-bottom-2">
      <div className="rounded-2xl border border-ironforge-primary/30 bg-ironforge-card p-4 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-bold text-ironforge-text">تحديث جديد متاح 🎉</p>
            <p className="text-sm text-ironforge-text-muted mt-1">
              {latestVersion ? `الإصدار ${latestVersion} متوفر` : 'يوجد نسخة أحدث من ATLAS'}
              <span className="block text-xs mt-1">حالياً: v{CURRENT_VERSION}</span>
            </p>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-ironforge-text-muted hover:text-ironforge-text text-xl leading-none"
          >
            ×
          </button>
        </div>
        <div className="flex gap-2 mt-4">
          <a
            href={updateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center rounded-xl bg-ironforge-primary text-black font-bold py-2.5 hover:bg-ironforge-primary-dark transition"
          >
            حمّل التحديث
          </a>
          <button
            onClick={() => setDismissed(true)}
            className="px-4 py-2.5 rounded-xl border border-ironforge-border text-ironforge-text hover:bg-ironforge-background transition"
          >
            لاحقاً
          </button>
        </div>
        <p className="text-[11px] text-ironforge-text-muted mt-2 text-center">يحتاج إعادة تثبيت (دقيقة)</p>
      </div>
    </div>
  );
}
