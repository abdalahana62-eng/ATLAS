'use client';

import { useEffect, useState } from 'react';

const CURRENT_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.24';
const REPO = 'abdalahana62-eng/ATLAS';

export default function UpdateChecker() {
  const [updateUrl, setUpdateUrl] = useState<string | null>(null);
  const [latestVersion, setLatestVersion] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);
  // تذكر اللي المستخدم قفله عشان مايظهرش تاني لنفس النسخة
  const dismissedKey = `atlas_update_dismissed_${CURRENT_VERSION}`;

  useEffect(() => {
    // لو المستخدم قفل البانر لنفس النسخة الحالية لا تظهر تاني
    try {
      if (localStorage.getItem(dismissedKey)) {
        setDismissed(true);
        return;
      }
    } catch {}
    // لا تفحص لو مفيش نت
    if (!navigator.onLine) return;

    const check = async () => {
      try {
        // أولاً جرّب Vercel proxy (يشتغل حتى لو الريبو private)
        let tag: string | null = null;
        let url: string | null = null;

        // 1) Vercel API
        try {
          const vercelBase = typeof window !== 'undefined' && (window as any).Capacitor
            ? 'https://atlas2-ochre.vercel.app'
            : '';
          const apiUrl = vercelBase ? `${vercelBase}/api/latest` : '/api/latest';
          const r1 = await fetch(apiUrl, { cache: 'no-store' });
          if (r1.ok) {
            const d1 = await r1.json();
            if (d1.tag || d1.version) {
              tag = (d1.tag || d1.version).replace(/^v/, '');
              url = d1.url || d1.html_url;
            }
          }
        } catch {}

        // 2) fallback مباشر لـ GitHub (لو الريبو public)
        if (!tag) {
          const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
            headers: { Accept: 'application/vnd.github.v3+json' },
            cache: 'no-store' as any,
          });
          if (res.ok) {
            const data = await res.json();
            tag = (data.tag_name || '').replace(/^v/, '');
            const apkAsset = data.assets?.find((a: any) => a.name.endsWith('.apk'));
            url = apkAsset?.browser_download_url || data.html_url;
          } else {
            console.log('[UpdateChecker] GitHub API', res.status);
          }
        }
        
        if (tag && tag !== CURRENT_VERSION && url) {
          setLatestVersion(tag);
          setUpdateUrl(url);
        } else {
          console.log('[UpdateChecker] no update', { tag, current: CURRENT_VERSION, url });
        }
      } catch (e) {
        console.log('[UpdateChecker] error', e);
      }
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
            onClick={() => {
              try { localStorage.setItem(dismissedKey, '1'); } catch {}
              setDismissed(true);
            }}
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
            onClick={() => {
              try { localStorage.setItem(dismissedKey, '1'); } catch {}
              setDismissed(true);
            }}
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
