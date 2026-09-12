'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

// Heartbeat: upserts last_seen every 30s so admin sees exactly who is online.
// Considered online if last_seen within the last 90 seconds.
// platform = 'app' for the installed Capacitor app, 'web' otherwise.
function detectPlatform(): string {
  try {
    const w = window as any;
    const cap = w.Capacitor;
    if (
      window.location.protocol === 'capacitor:' ||
      cap?.isNativePlatform?.() ||
      cap?.isNative ||
      document.URL.includes('capacitor') ||
      navigator.userAgent.includes('Capacitor')
    ) {
      return 'app';
    }
  } catch {}
  return 'web';
}

export default function PresenceTracker() {
  useEffect(() => {
    let timer: any = null;
    let stopped = false;
    const platform = detectPlatform();
    const beat = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getSession();
        const email = data.session?.user?.email?.toLowerCase().trim();
        if (!email || stopped) return;
        // Server-verified heartbeat: the API matches the email against the
        // logged-in session, so nobody can fake someone else's presence.
        const { apiFetch } = await import('@/lib/apiBase');
        await apiFetch('/api/presence', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, platform }),
        });
      } catch {}
    };
    beat();
    timer = setInterval(beat, 30000);
    return () => { stopped = true; try { clearInterval(timer); } catch {} };
  }, []);
  return null;
}
