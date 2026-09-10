'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { ShieldCheck, Check, X, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { OWNER_EMAIL } from '@/lib/subscription';

interface Req { id: string; email: string; phone: string; plan: string; amount: number; method: string; status: string; created_at: string; }

export default function AdminPage() {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const [email, setEmail] = useState('');
  const [authed, setAuthed] = useState(false);
  const [reqs, setReqs] = useState<Req[]>([]);
  const [shots, setShots] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('pending');

  const headers = () => ({ 'Content-Type': 'application/json', 'x-admin-email': email.toLowerCase().trim() });

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch(`/api/admin/requests?status=${filter}`, { headers: { 'x-admin-email': email.toLowerCase().trim() }, cache: 'no-store' });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setReqs(d.requests || []);
      setAuthed(true);
    } catch (e: any) { alert(e.message); }
    setLoading(false);
  };

  const viewShot = async (id: string) => {
    // screenshot is stored but list API omits it for size; fetch via subscriptions table is not exposed —
    // MVP: screenshots viewable in Supabase dashboard. Show note.
    setShots(s => ({ ...s, [id]: 'supabase' }));
  };

  const act = async (id: string, action: 'approve' | 'reject') => {
    if (!confirm(isAr ? `تأكيد ${action === 'approve' ? 'قبول' : 'رفض'}؟` : `Confirm ${action}?`)) return;
    try {
      const r = await fetch('/api/admin/requests', { method: 'PATCH', headers: headers(), body: JSON.stringify({ id, action }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setReqs(prev => prev.filter(x => x.id !== id));
      alert(isAr ? `تم ${action === 'approve' ? 'التفعيل حتى ' + d.expiresAt?.slice(0, 10) : 'الرفض'}` : `Done: ${action}`);
    } catch (e: any) { alert(e.message); }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-ironforge-background flex items-center justify-center p-6">
        <Card className="p-8 max-w-sm w-full text-center">
          <ShieldCheck className="w-12 h-12 text-ironforge-primary mx-auto mb-4" />
          <h1 className="text-xl font-bold text-ironforge-text mb-4">{isAr ? 'لوحة الإدارة' : 'Admin'}</h1>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="admin email" dir="ltr"
            className="w-full bg-ironforge-background border border-ironforge-border rounded-lg px-3 py-2.5 text-ironforge-text mb-3" />
          <Button onClick={load} disabled={loading} className="w-full bg-ironforge-primary text-black">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isAr ? 'دخول' : 'Enter')}
          </Button>
          <p className="text-xs text-ironforge-text-muted mt-3">Owner: {OWNER_EMAIL}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ironforge-background p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-ironforge-text">{isAr ? 'طلبات الاشتراك' : 'Subscription requests'}</h1>
          <div className="flex gap-2">
            {['pending', 'approved', 'rejected'].map(s => (
              <Badge key={s} onClick={() => setFilter(s)} className={`cursor-pointer ${filter === s ? 'bg-ironforge-primary text-black' : 'border-ironforge-border text-ironforge-text-muted'}`}>{s}</Badge>
            ))}
            <Button onClick={load} variant="outline" size="sm" className="border-ironforge-border"><RefreshCw className="w-4 h-4" /></Button>
          </div>
        </div>
        {loading && <p className="text-ironforge-text-muted">...</p>}
        <div className="space-y-3">
          {reqs.map(r => (
            <Card key={r.id} className="p-4 border-ironforge-border">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="text-sm">
                  <p className="font-bold text-ironforge-text" dir="ltr">{r.email}</p>
                  <p className="text-ironforge-text-muted" dir="ltr">{r.phone} • {r.plan} • {r.amount} ج.م • {r.method}</p>
                  <p className="text-xs text-ironforge-text-muted">{new Date(r.created_at).toLocaleString()}</p>
                  <a className="text-xs text-ironforge-primary underline" target="_blank"
                    href={`https://supabase.com/dashboard/project/_/editor?table=payment_requests`}>
                    {isAr ? 'عرض السكرين شوت من Supabase' : 'View screenshot in Supabase'}
                  </a>
                </div>
                {filter === 'pending' && (
                  <div className="flex gap-2">
                    <Button onClick={() => act(r.id, 'approve')} size="sm" className="bg-emerald-500 text-white"><Check className="w-4 h-4" /> {isAr ? 'قبول وتفعيل' : 'Approve'}</Button>
                    <Button onClick={() => act(r.id, 'reject')} size="sm" variant="outline" className="border-red-500 text-red-400"><X className="w-4 h-4" /> {isAr ? 'رفض' : 'Reject'}</Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
          {!loading && reqs.length === 0 && <p className="text-center text-ironforge-text-muted">{isAr ? 'لا يوجد طلبات' : 'No requests'}</p>}
        </div>
      </div>
    </div>
  );
}
