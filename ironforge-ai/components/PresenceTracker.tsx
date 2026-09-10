'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

// Tracks this device as online (Supabase Realtime presence) so admin sees live count
export default function PresenceTracker() {
  useEffect(() => {
    let channel: any = null;
    const run = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getSession();
        const email = data.session?.user?.email?.toLowerCase().trim();
        if (!email) return;
        channel = supabase.channel('online-users', { config: { presence: { key: email } } });
        channel.subscribe(async (status: string) => {
          if (status === 'SUBSCRIBED') {
            await channel.track({ email, online_at: new Date().toISOString() });
          }
        });
      } catch {}
    };
    run();
    return () => { try { channel?.unsubscribe(); } catch {} };
  }, []);
  return null;
}
