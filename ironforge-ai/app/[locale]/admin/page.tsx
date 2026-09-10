'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { ShieldCheck, Check, X, Loader2, RefreshCw, Users, Crown, Clock, Eye, Wifi, Mail, Send, Lightbulb, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { createClient } from '@/lib/supabase/client';

interface Req { id: string; email: string; phone: string; plan: string; amount: number; method: string; status: string; created_at: string; }
interface Stats { users: number; activeSubs: number; pending: number; totalRequests: number; }
interface Sub { email: string; plan: string; expires_at: string; status: string; created_at: string; daysLeft: number; }
interface Sug { id: string; email: string; message: string; status: string; created_at: string; }

export default function AdminPage() {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [reqs, setReqs] = useState<Req[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [online, setOnline] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('pending');
  const [shot, setShot] = useState<string | null>(null);
  const [shotLoading, setShotLoading] = useState(false);
  const [tab, setTab] = useState<'requests' | 'subs' | 'ideas'>('requests');
  const [subs, setSubs] = useState<Sub[]>([]);
  const [sugs, setSugs] = useState<Sug[]>([]);
  const [mailTo, setMailTo] = useState<string | null>(null);
  const [mailSubject, setMailSubject] = useState('');
  const [mailBody, setMailBody] = useState('');
  const [mailSending, setMailSending] = useState(false);

  const headers = () => ({
    'Content-Type': 'application/json',
    'x-admin-email': (sessionStorage.getItem('atlas-admin-email') || email).toLowerCase().trim(),
    'x-admin-password': sessionStorage.getItem('atlas-admin-pass') || password,
  });

  // Auto-fill owner email from Google session
  useEffect(() => {
    const run = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getSession();
        const em = data.session?.user?.email?.toLowerCase().trim() || '';
        if (em) setEmail(em);
      } catch {}
    };
    run();
  }, []);

  // Live online count via Realtime presence
  useEffect(() => {
    if (!authed) return;
    let channel: any = null;
    const run = async () => {
      try {
        const supabase = createClient();
        channel = supabase.channel('online-users');
        channel.on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          setOnline(Object.keys(state).length);
        }).subscribe();
      } catch {}
    };
    run();
    return () => { try { channel?.unsubscribe(); } catch {} };
  }, [authed]);

  const load = async (em?: string, pw?: string) => {
    setLoading(true);
    try {
      const e = (em ?? email).toLowerCase().trim();
      const p = pw ?? password;
      const h = { 'x-admin-email': e, 'x-admin-password': p };
      const [r1, r2] = await Promise.all([
        fetch(`/api/admin/requests?status=${filter}`, { headers: h, cache: 'no-store' }),
        fetch('/api/admin/stats', { headers: h, cache: 'no-store' }),
      ]);
      if (!r1.ok) throw new Error(isAr ? 'بيانات الدخول غلط' : 'Invalid credentials');
      const d1 = await r1.json();
      setReqs(d1.requests || []);
      if (r2.ok) setStats(await r2.json());
      sessionStorage.setItem('atlas-admin-email', e);
      sessionStorage.setItem('atlas-admin-pass', p);
      setAuthed(true);
    } catch (e: any) { alert(e.message); }
    setLoading(false);
  };

  const loadSubs = async () => {
    try {
      const r = await fetch('/api/admin/subscribers', { headers: headers(), cache: 'no-store' });
      const d = await r.json();
      if (r.ok) setSubs(d.subscribers || []);
    } catch {}
  };

  const loadSugs = async () => {
    try {
      const r = await fetch('/api/admin/suggestions', { headers: headers(), cache: 'no-store' });
      const d = await r.json();
      if (r.ok) setSugs(d.suggestions || []);
    } catch {}
  };

  const sugAct = async (id: string, action: 'read' | 'delete') => {
    try {
      await fetch('/api/admin/suggestions', { method: 'PATCH', headers: headers(), body: JSON.stringify({ id, action }) });
      if (action === 'delete') setSugs(prev => prev.filter(x => x.id !== id));
      else setSugs(prev => prev.map(x => x.id === id ? { ...x, status: 'read' } : x));
    } catch {}
  };

  const sendMail = async () => {
    if (!mailTo || !mailSubject.trim() || !mailBody.trim()) { alert(isAr ? 'اكتب الموضوع والرسالة' : 'Write subject and message'); return; }
    setMailSending(true);
    try {
      const r = await fetch('/api/admin/send-email', { method: 'POST', headers: headers(), body: JSON.stringify({ to: mailTo, subject: mailSubject, message: mailBody }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      alert(isAr ? 'اتبعتت ✅' : 'Sent ✅');
      setMailTo(null); setMailSubject(''); setMailBody('');
    } catch (e: any) { alert(e.message); }
    setMailSending(false);
  };

  const viewShot = async (id: string) => {
    setShotLoading(true);
    setShot(null);
    try {
      const r = await fetch(`/api/admin/requests?id=${id}`, { headers: headers(), cache: 'no-store' });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setShot(d.request?.screenshot || '');
    } catch (e: any) { alert(e.message); }
    setShotLoading(false);
  };

  const act = async (id: string, action: 'approve' | 'reject') => {
    if (!confirm(isAr ? `تأكيد ${action === 'approve' ? 'قبول' : 'رفض'}؟` : `Confirm ${action}?`)) return;
    try {
      const r = await fetch('/api/admin/requests', { method: 'PATCH', headers: headers(), body: JSON.stringify({ id, action }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setReqs(prev => prev.filter(x => x.id !== id));
      setStats(s => s ? { ...s, pending: Math.max(0, s.pending - 1), activeSubs: action === 'approve' ? s.activeSubs + 1 : s.activeSubs } : s);
      alert(isAr ? `تم ${action === 'approve' ? 'التفعيل حتى ' + d.expiresAt?.slice(0, 10) : 'الرفض'}` : `Done: ${action}`);
    } catch (e: any) { alert(e.message); }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-ironforge-background flex items-center justify-center p-6">
        <Card className="p-8 max-w-sm w-full text-center">
          <ShieldCheck className="w-12 h-12 text-ironforge-primary mx-auto mb-4" />
          <h1 className="text-xl font-bold text-ironforge-text mb-4">{isAr ? 'لوحة الإدارة 🔒' : 'Admin 🔒'}</h1>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="admin email" dir="ltr"
            className="w-full bg-ironforge-background border border-ironforge-border rounded-lg px-3 py-2.5 text-ironforge-text mb-3" />
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" inputMode="numeric" placeholder={isAr ? 'كلمة السر' : 'Password'} dir="ltr"
            className="w-full bg-ironforge-background border border-ironforge-border rounded-lg px-3 py-2.5 text-ironforge-text mb-3" />
          <Button onClick={() => load()} disabled={loading} className="w-full bg-ironforge-primary text-black">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isAr ? 'دخول' : 'Enter')}
          </Button>
        </Card>
      </div>
    );
  }

  const cards = [
    { icon: Wifi, label: isAr ? 'متصل الآن 🟢' : 'Online now', value: online, live: true },
    { icon: Users, label: isAr ? 'مسجلين' : 'Registered', value: stats?.users ?? '—' },
    { icon: Crown, label: isAr ? 'مشتركين فعّالين' : 'Active subs', value: stats?.activeSubs ?? '—' },
    { icon: Clock, label: isAr ? 'طلبات معلقة' : 'Pending', value: stats?.pending ?? '—' },
  ];

  return (
    <div className="min-h-screen bg-ironforge-background p-6">
      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {cards.map(c => (
            <Card key={c.label} className="p-4 border-ironforge-border text-center">
              <c.icon className="w-5 h-5 text-ironforge-primary mx-auto mb-1" />
              <p className="text-2xl font-black text-ironforge-text">{c.value}</p>
              <p className="text-xs text-ironforge-text-muted">{c.label}</p>
            </Card>
          ))}
        </div>

        <div className="flex gap-2 mb-4">
          <Button onClick={() => setTab('requests')} variant={tab === 'requests' ? 'primary' : 'outline'} className={tab === 'requests' ? 'bg-ironforge-primary text-black' : 'border-ironforge-border'}>{isAr ? 'الطلبات' : 'Requests'}</Button>
          <Button onClick={() => { setTab('subs'); loadSubs(); }} variant={tab === 'subs' ? 'primary' : 'outline'} className={tab === 'subs' ? 'bg-ironforge-primary text-black' : 'border-ironforge-border'}>{isAr ? 'المشتركين' : 'Subscribers'}</Button>
          <Button onClick={() => { setTab('ideas'); loadSugs(); }} variant={tab === 'ideas' ? 'primary' : 'outline'} className={tab === 'ideas' ? 'bg-ironforge-primary text-black' : 'border-ironforge-border'}>
            <Lightbulb className="w-4 h-4" /> {isAr ? 'الاقتراحات' : 'Ideas'}
            {sugs.filter(s => s.status === 'new').length > 0 && <span className="ml-1 rounded-full bg-red-500 text-white text-[10px] px-1.5">{sugs.filter(s => s.status === 'new').length}</span>}
          </Button>
        </div>

        {tab === 'ideas' && (
          <div className="space-y-3">
            {sugs.map(s => (
              <Card key={s.id} className={`p-4 border-ironforge-border ${s.status === 'new' ? 'border-ironforge-primary/50' : ''}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="text-sm flex-1">
                    <p className="font-bold text-ironforge-text" dir="ltr">{s.email}</p>
                    <p className="text-ironforge-text mt-1 leading-6">{s.message}</p>
                    <p className="text-xs text-ironforge-text-muted mt-1">{new Date(s.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {s.status === 'new' && (
                      <Button onClick={() => sugAct(s.id, 'read')} size="sm" variant="outline" className="border-ironforge-primary text-ironforge-primary"><Check className="w-4 h-4" /></Button>
                    )}
                    <Button onClick={() => sugAct(s.id, 'delete')} size="sm" variant="outline" className="border-red-500/50 text-red-400"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              </Card>
            ))}
            {sugs.length === 0 && <p className="text-center text-ironforge-text-muted">{isAr ? 'لا توجد اقتراحات' : 'No suggestions'}</p>}
          </div>
        )}

        {tab === 'subs' && (
          <div className="space-y-3">
            {subs.map(s => (
              <Card key={s.email} className="p-4 border-ironforge-border">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="text-sm">
                    <p className="font-bold text-ironforge-text" dir="ltr">{s.email}</p>
                    <p className="text-ironforge-text-muted mt-1">
                      <Badge className="bg-ironforge-primary/15 text-ironforge-primary border-ironforge-primary/30">{s.plan}</Badge>
                      {' '}<span className={s.daysLeft <= 3 ? 'text-red-400 font-bold' : ''}>{isAr ? `متبقي ${s.daysLeft} يوم` : `${s.daysLeft}d left`}</span>
                      {' • '}{isAr ? 'ينتهي' : 'expires'} {s.expires_at?.slice(0, 10)}
                    </p>
                  </div>
                  <Button onClick={() => { setMailTo(s.email); setMailSubject(''); setMailBody(''); }} size="sm" variant="outline" className="border-ironforge-primary text-ironforge-primary">
                    <Mail className="w-4 h-4" /> {isAr ? 'مراسلة' : 'Email'}
                  </Button>
                </div>
              </Card>
            ))}
            {subs.length === 0 && <p className="text-center text-ironforge-text-muted">{isAr ? 'لا يوجد مشتركين' : 'No subscribers'}</p>}
          </div>
        )}

        {tab === 'requests' && (
        <>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-ironforge-text">{isAr ? 'طلبات الاشتراك' : 'Requests'}</h1>
          <div className="flex gap-2">
            {['pending', 'approved', 'rejected'].map(s => (
              <Badge key={s} onClick={() => { setFilter(s); }} className={`cursor-pointer ${filter === s ? 'bg-ironforge-primary text-black' : 'border-ironforge-border text-ironforge-text-muted'}`}>{s}</Badge>
            ))}
            <Button onClick={() => load(sessionStorage.getItem('atlas-admin-email') || '', sessionStorage.getItem('atlas-admin-pass') || '')} variant="outline" size="sm" className="border-ironforge-border"><RefreshCw className="w-4 h-4" /></Button>
          </div>
        </div>

        <div className="space-y-3">
          {reqs.map(r => (
            <Card key={r.id} className="p-4 border-ironforge-border">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="text-sm">
                  <p className="font-bold text-ironforge-text" dir="ltr">{r.email}</p>
                  <p className="text-ironforge-text-muted" dir="ltr">{r.phone} • {r.plan} • {r.amount} ج.م • {r.method}</p>
                  <p className="text-xs text-ironforge-text-muted">{new Date(r.created_at).toLocaleString()}</p>
                  <button onClick={() => viewShot(r.id)} className="mt-2 inline-flex items-center gap-1 text-xs text-ironforge-primary underline">
                    <Eye className="w-3 h-3" /> {shotLoading ? '...' : (isAr ? 'عرض سكرين التحويل' : 'View screenshot')}
                  </button>
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
        </>
        )}
      </div>

      {mailTo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4" onClick={() => setMailTo(null)}>
          <div className="max-w-md w-full rounded-2xl bg-ironforge-card border border-ironforge-border p-5" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-ironforge-text mb-1">{isAr ? 'مراسلة مشترك' : 'Email subscriber'}</h3>
            <p className="text-xs text-ironforge-text-muted mb-3" dir="ltr">{mailTo}</p>
            <input value={mailSubject} onChange={e => setMailSubject(e.target.value)} placeholder={isAr ? 'الموضوع' : 'Subject'}
              className="w-full bg-ironforge-background border border-ironforge-border rounded-lg px-3 py-2 text-sm text-ironforge-text mb-2" />
            <textarea value={mailBody} onChange={e => setMailBody(e.target.value)} rows={5} placeholder={isAr ? 'نص الرسالة...' : 'Message...'}
              className="w-full bg-ironforge-background border border-ironforge-border rounded-lg px-3 py-2 text-sm text-ironforge-text mb-3" />
            <div className="flex gap-2">
              <Button onClick={sendMail} disabled={mailSending} className="flex-1 bg-ironforge-primary text-black">
                {mailSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> {isAr ? 'إرسال' : 'Send'}</>}
              </Button>
              <Button onClick={() => setMailTo(null)} variant="outline" className="border-ironforge-border">{isAr ? 'إلغاء' : 'Cancel'}</Button>
            </div>
          </div>
        </div>
      )}

      {shot !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4" onClick={() => setShot(null)}>
          <div className="max-w-md w-full rounded-2xl bg-ironforge-card p-4" onClick={e => e.stopPropagation()}>
            {shot ? <img src={shot} alt="transfer" className="w-full rounded-xl" /> : <p className="text-center text-ironforge-text-muted text-sm">{isAr ? 'لا توجد صورة' : 'No screenshot'}</p>}
            <Button onClick={() => setShot(null)} variant="outline" className="w-full mt-3 border-ironforge-border">{isAr ? 'إغلاق' : 'Close'}</Button>
          </div>
        </div>
      )}
    </div>
  );
}
