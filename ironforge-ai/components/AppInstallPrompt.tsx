'use client';

import { useEffect, useState } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

// Shows a one-time install prompt banner at the bottom on first visit.
// Listens to the browser's beforeinstallprompt event (PWA) and falls back to APK download.
export default function AppInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [shown, setShown] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
    if (dismissed || shown) return;
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShown(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, [dismissed, shown]);

  const install = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDismissed(true);
        setShown(false);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback: open APK download modal via download button flow
      const a = document.createElement('a');
      a.href = 'https://github.com/abdalahana62-eng/ATLAS/releases/latest';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.click();
      setDismissed(true);
      setShown(false);
    }
  };

  if (!shown || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex items-end gap-2 sm:flex-row sm:justify-between sm:items-center p-2 sm:p-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto bg-ironforge-card border border-ironforge-border rounded-2xl p-3 sm:p-4 shadow-2xl backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ironforge-primary/10 text-ironforge-primary shrink-0">
          <Smartphone className="w-5 h-5" />
        </div>
        <div className="flex-1 text-sm leading-relaxed">
          <p className="font-bold text-ironforge-text">ثبت ATLAS على موبايلك</p>
          <p className="text-xs text-ironforge-text-muted mt-1">تطبيق تمارين وكامل الأجسام — швид Быстры ومجاني للتجربة</p>
        </div>
        <div className="flex gap-2 mt-2 sm:mt-0 w-full sm:w-auto justify-end sm:justify-start">
          <Button onClick={install} size="sm" className="bg-ironforge-primary text-black font-bold">
            <Download className="w-4 h-4" /> ثبت
          </Button>
          <button onClick={() => setDismissed(true)} className="text-ironforge-text-muted hover:text-ironforge-text">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
