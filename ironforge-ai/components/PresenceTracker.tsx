'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

// Heartbeat: upserts last_seen every 30s so admin sees exactly who is online.
// Considered online if last_seen within the last 90 seconds.
export default function PresenceTracker() {
  useEffect(() => {
    let timer: any = null;
    let stopped = false;
    const beat = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getSession();
        const email = data.session?.user?.email?.toLowerCase().trim();
        if (!email || stopped) return;
        await supabase.from('user_presence').upsert({ email, last_seen: new Date().toISOString() });
      } catch {}
    };
    beat();
    timer = setInterval(beat, 30000);
    return () => { stopped = true; try { clearInterval(timer); } catch {} };
  }, []);
  return null;
}
