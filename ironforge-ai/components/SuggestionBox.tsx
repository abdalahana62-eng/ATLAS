'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { Lightbulb, Send, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { getAccount } from '@/lib/subscription';

// Suggestion box — sends the idea straight to the admin dashboard
export default function SuggestionBox() {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = async () => {
    setError(null);
    const msg = text.trim();
    if (!msg) return;
    const email = getAccount()?.email || '';
    if (!email) { setError(isAr ? 'سجّل دخولك الأول' : 'Sign in first'); return; }
    setSending(true);
    try {
      const { apiFetch } = await import('@/lib/apiBase');
      const r = await apiFetch('/api/admin/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message: msg }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Failed');
      setText(''); setSent(true);
      setTimeout(() => setSent(false), 4000);
    } catch (e: any) { setError(e.message); }
    setSending(false);
  };

  return (
    <Card className="border-ironforge-border bg-ironforge-card p-6">
      <h3 className="text-xl font-semibold text-ironforge-text flex items-center gap-2 mb-1">
        <Lightbulb className="w-5 h-5 text-ironforge-primary" />
        {isAr ? 'عندك اقتراح؟' : 'Have a suggestion?'}
      </h3>
      <p className="text-xs text-ironforge-text-muted mb-3">
        {isAr ? 'اكتب فكرة نضيفها للتطبيق وهتوصل للإدارة مباشرة' : 'Write an idea for the app — it goes straight to admin'}
      </p>
      <textarea value={text} onChange={e => setText(e.target.value.slice(0, 1000))} rows={3}
        placeholder={isAr ? 'مثال: ضيفوا تمارين كارديو...' : 'e.g. add cardio workouts...'}
        className="w-full bg-ironforge-background border border-ironforge-border rounded-lg px-3 py-2 text-sm text-ironforge-text mb-3" />
      {error && <p className="text-sm text-red-400 mb-2">{error}</p>}
      {sent && <p className="text-sm text-emerald-400 mb-2 flex items-center gap-1"><CheckCircle className="w-4 h-4" />{isAr ? 'وصل الاقتراح ✅ شكراً' : 'Suggestion sent ✅ thanks'}</p>}
      <Button onClick={send} disabled={sending || !text.trim()} className="bg-ironforge-primary text-black w-full sm:w-auto">
        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> {isAr ? 'ابعت الاقتراح' : 'Send'}</>}
      </Button>
    </Card>
  );
}
