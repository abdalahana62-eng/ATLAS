'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { ShieldCheck, Check, X, Loader2, RefreshCw, Users, Crown, Clock, Eye, Wifi, Mail, Send, Lightbulb, Trash2, Bot, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { createClient } from '@/lib/supabase/client';

interface Req { id: string; email: string; phone: string; plan: string; amount: number; method: string; status: string; created_at: string; }
interface Stats { users: number; activeSubs: number; pending: number; totalRequests: number; aiToday?: number; aiYesterday?: number; aiWeek?: number; appInstalls?: number; appOnline?: number; }
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
  const [onlineUsers, setOnlineUsers] = useState<{ email: string; platform: string; last_seen: string }[]>([]);
  const [showOnline, setShowOnline] = useState(false);
  const [onlineLoading, setOnlineLoading] = useState(false);
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
  const fetchOpts = (extra: RequestInit = {}): RequestInit => ({ credentials: 'include', cache: 'no-store', ...extra });

  const isSafeShot = (s: string) =>
    /^data:image\/(jpeg|jpg|png|webp);base64,[A-Za-z0-9+/=\s]+$/.test(s);

  const loginWithGoogle = async () => {
    try {
      const supabase = createClient();
      const origin = window.location.origin;
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${origin}/${locale}/auth/callback?next=/${locale}/admin` },
      });
    } catch {}
  };

  const logout = async () => {
    try {
      sessionStorage.removeItem('atlas-admin-email');
      sessionStorage.removeItem('atlas-admin-pass');
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {}
    setAuthed(false);
    setPassword('');
  };

  const planName = (id: string) =>
    isAr
      ? ({ monthly: 'شهري', quarterly: 'ربع سنوي (3 شهور)', yearly: 'سنوي' } as any)[id] || id
      : ({ monthly: 'Monthly', quarterly: 'Quarterly', yearly: 'Yearly' } as any)[id] || id;

  const methodName = (m: string) =>
    isAr
      ? (m === 'instapay' ? 'انستاباي' : m === 'vodafone' ? 'فودافون كاش' : m)
      : m;

  const ago = (iso: string) => {
    const s = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
    if (s < 10) return isAr ? 'الآن 🟢' : 'now 🟢';
    if (s < 60) return isAr ? `منذ ${s} ث` : `${s}s ago`;
    const m = Math.floor(s / 60);
    return isAr ? `منذ ${m} د` : `${m}m ago`;
  };

  // Auto-fill owner email from Google session
  useEffect(() => {
    const run = async () => {
      try {
        // Auto-expire admin tab session after 30min.
        const at = Number(sessionStorage.getItem('atlas-admin-at') || 0);
        if (at && Date.now() - at > 30 * 60 * 1000) {
          sessionStorage.removeItem('atlas-admin-email');
          sessionStorage.removeItem('atlas-admin-pass');
          sessionStorage.removeItem('atlas-admin-at');
          setAuthed(false);
        }
        const supabase = createClient();
        const { data } = await supabase.auth.getSession();
        const em = data.session?.user?.email?.toLowerCase().trim() || '';
        if (em) setEmail(em);
      } catch {}
    };
    run();
  }, []);

  // Live online users via heartbeat table (online = seen in last 90s), refresh every 15s.
  // Shows WHO is online right now + from where (app/website) + exact last-seen time.
  const loadOnline = async () => {
    setOnlineLoading(true);
    try {
      const r = await fetch('/api/admin/presence', fetchOpts({ headers: headers() }));
      if (r.ok) {
        const d = await r.json();
        const rows = ((d.online as any[]) || []).map(x => ({
          email: String(x.email),
          platform: String(x.platform || 'web'),
          last_seen: String(x.last_seen),
        }));
        setOnline(rows.length);
        setOnlineUsers(rows);
      }
    } catch {}
    setOnlineLoading(false);
  };

  useEffect(() => {
    if (!authed) return;
    let timer: any = null;
    loadOnline();
    timer = setInterval(loadOnline, 15000);
    return () => { try { clearInterval(timer); } catch {} };
  }, [authed]);

  const load = async (em?: string, pw?: string) => {
    setLoading(true);
    try {
      const e = (em ?? email).toLowerCase().trim();
      const p = pw ?? password;
      if (!e || !p) throw new Error(isAr ? 'اكتب الإيميل وكلمة السر' : 'Enter email and password');
      const h = { 'x-admin-email': e, 'x-admin-password': p };
      const [r1, r2] = await Promise.all([
        fetch(`/api/admin/requests?status=${filter}`, fetchOpts({ headers: h })),
        fetch('/api/admin/stats', fetchOpts({ headers: h })),
      ]);
      if (r1.status === 429) throw new Error(isAr ? 'محاولات كتير — استنى دقيقة' : 'Too many attempts — wait a minute');
      if (r1.status === 500) throw new Error(isAr ? 'عطل في السيرفر (غالباً SUPABASE_SERVICE_ROLE_KEY ناقص في Vercel)' : 'Server error (likely missing SUPABASE_SERVICE_ROLE_KEY)');
      if (!r1.ok) throw new Error(isAr ? 'بيانات الدخول غلط أو جلسة جوجل المالك ناقصة — سجّل بجوجل الأول بنفس إيميل المالك' : 'Invalid credentials or missing owner Google session — sign in with Google first');
      const d1 = await r1.json();
      setReqs(d1.requests || []);
      if (r2.ok) setStats(await r2.json());
      // SECURITY: tab-only storage + 30min auto-expiry (limits XSS window).
      // Never use localStorage here. Password never touches logs.
      sessionStorage.setItem('atlas-admin-email', e);
      sessionStorage.setItem('atlas-admin-pass', p);
      sessionStorage.setItem('atlas-admin-at', String(Date.now()));
      setAuthed(true);
    } catch (e: any) { alert(e.message); }
    setLoading(false);
  };

  const loadSubs = async () => {
    try {
      const r = await fetch('/api/admin/subscribers', fetchOpts({ headers: headers() }));
      const d = await r.json();
      if (r.ok) setSubs(d.subscribers || []);
    } catch {}
  };

  const loadSugs = async () => {
    try {
      const r = await fetch('/api/admin/suggestions', fetchOpts({ headers: headers() }));
      const d = await r.json();
      if (r.ok) setSugs(d.suggestions || []);
    } catch {}
  };

  const sugAct = async (id: string, action: 'read' | 'delete') => {
    try {
      await fetch('/api/admin/suggestions', fetchOpts({ method: 'PATCH', headers: headers(), body: JSON.stringify({ id, action }) }));
      if (action === 'delete') setSugs(prev => prev.filter(x => x.id !== id));
      else setSugs(prev => prev.map(x => x.id === id ? { ...x, status: 'read' } : x));
    } catch {}
  };

  const sendMail = async () => {
    if (!mailTo || !mailSubject.trim() || !mailBody.trim()) { alert(isAr ? 'اكتب الموضوع والرسالة' : 'Write subject and message'); return; }
    setMailSending(true);
    try {
      const r = await fetch('/api/admin/send-email', fetchOpts({ method: 'POST', headers: headers(), body: JSON.stringify({ to: mailTo, subject: mailSubject, message: mailBody }) }));
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
      const r = await fetch(`/api/admin/requests?id=${id}`, fetchOpts({ headers: headers() }));
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setShot(d.request?.screenshot || '');
    } catch (e: any) { alert(e.message); }
    setShotLoading(false);
  };

  const act = async (id: string, action: 'approve' | 'reject') => {
    if (!confirm(isAr ? `تأكيد ${action === 'approve' ? 'قبول' : 'رفض'}؟` : `Confirm ${action}?`)) return;
    try {
      const r = await fetch('/api/admin/requests', fetchOpts({ method: 'PATCH', headers: headers(), body: JSON.stringify({ id, action }) }));
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
          <h1 className="text-xl font-bold text-ironforge-text mb-2">{isAr ? 'لوحة الإدارة 🔒' : 'Admin 🔒'}</h1>
          <p className="text-xs text-ironforge-text-muted mb-4">
            {isAr ? 'خطوتين: ١) الدخول بجوجل المالك ٢) كلمة سر الإدارة' : 'Two steps: 1) Owner Google sign-in 2) Admin password'}
          </p>
          <Button onClick={loginWithGoogle} variant="outline" className="w-full border-ironforge-border mb-3">
            {isAr ? 'الدخول بحساب جوجل المالك أولاً' : 'Sign in with owner Google first'}
          </Button>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="admin email" dir="ltr" autoComplete="username"
            className="w-full bg-ironforge-background border border-ironforge-border rounded-lg px-3 py-2.5 text-ironforge-text mb-3" />
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" autoComplete="current-password" placeholder={isAr ? 'كلمة السر' : 'Password'} dir="ltr"
            className="w-full bg-ironforge-background border border-ironforge-border rounded-lg px-3 py-2.5 text-ironforge-text mb-3" />
          <Button onClick={() => load()} disabled={loading} className="w-full bg-ironforge-primary text-black">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isAr ? 'دخول' : 'Enter')}
          </Button>
        </Card>
      </div>
    );
  }

  const cards = [
    { icon: Wifi, label: isAr ? 'متصل الآن 🟢' : 'Online now', value: online, live: true, key: 'online', sub: '' },
    { icon: Users, label: isAr ? 'مسجلين' : 'Registered', value: stats?.users ?? '—', key: '', sub: '' },
    { icon: Crown, label: isAr ? 'مشتركين فعّالين' : 'Active subs', value: stats?.activeSubs ?? '—', key: '', sub: '' },
    { icon: Clock, label: isAr ? 'طلبات معلقة' : 'Pending', value: stats?.pending ?? '—', key: '', sub: '' },
    {
      icon: Bot,
      label: isAr ? 'رسائل AI النهاردة' : 'AI msgs today',
      value: stats ? (stats.aiToday ?? 0) : '—',
      key: '',
      sub: stats
        ? isAr
          ? `امبارح ${stats.aiYesterday ?? 0} • الأسبوع ${stats.aiWeek ?? 0}`
          : `yday ${stats.aiYesterday ?? 0} • wk ${stats.aiWeek ?? 0}`
        : '',
    },
    {
      icon: Smartphone,
      label: isAr ? 'نزّلوا التطبيق' : 'App installs',
      value: stats ? (stats.appInstalls ?? 0) : '—',
      key: '',
      sub: stats
        ? isAr
          ? `فاتحينه دلوقتي ${stats.appOnline ?? 0}`
          : `${stats.appOnline ?? 0} online now`
        : '',
    },
  ];

  return (
    <div className="min-h-screen bg-ironforge-background p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-end mb-3">
          <Button onClick={logout} variant="outline" size="sm" className="border-ironforge-border text-ironforge-text-muted">
            {isAr ? 'خروج آمن' : 'Sign out'}
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-3">
          {cards.map(c => (
            <Card
              key={c.label}
              onClick={() => { if (c.key === 'online') setShowOnline(v => !v); }}
              className={`p-4 border-ironforge-border text-center ${c.key === 'online' ? 'cursor-pointer hover:border-ironforge-primary' : ''}`}
            >
              <c.icon className="w-5 h-5 text-ironforge-primary mx-auto mb-1" />
              <p className="text-2xl font-black tabular-nums text-ironforge-text">{c.value}</p>
              <p className="text-xs text-ironforge-text-muted">{c.label}</p>
              {c.sub ? <p className="text-[10px] tabular-nums text-ironforge-text-muted mt-1">{c.sub}</p> : null}
              {c.key === 'online' && <p className="text-[10px] text-ironforge-primary mt-1">{isAr ? 'دوس لعرض المتصلين' : 'Tap to view'}</p>}
            </Card>
          ))}
        </div>

        {showOnline && (
          <Card className="p-4 border-ironforge-primary/40 mb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="font-bold text-ironforge-text">🟢 {isAr ? 'المتصلون الآن' : 'Currently online'} ({onlineUsers.length})</p>
              <Button onClick={loadOnline} variant="outline" size="sm" className="border-ironforge-border">
                <RefreshCw className={`w-4 h-4 ${onlineLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            {onlineUsers.length === 0 && <p className="text-xs text-ironforge-text-muted">{isAr ? 'مفيش حد فاتح التطبيق دلوقتي غيرك — جرّب من موبايل تاني' : 'Nobody online right now — try from another device'}</p>}
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {onlineUsers.map(u => (
                <div key={u.email} className="flex items-center justify-between gap-2 text-sm text-ironforge-text bg-ironforge-background rounded-lg px-3 py-1.5">
                  <span dir="ltr" className="truncate">{u.email}</span>
                  <span className="flex items-center gap-2 shrink-0 text-xs text-ironforge-text-muted">
                    <span>{ago(u.last_seen)}</span>
                    <span className="rounded-full bg-ironforge-primary/15 text-ironforge-primary px-2 py-0.5">
                      {u.platform === 'app' ? (isAr ? '📱 تطبيق' : '📱 app') : (isAr ? '🌐 موقع' : '🌐 web')}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

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
                      <Badge className="bg-ironforge-primary/15 text-ironforge-primary border-ironforge-primary/30">{planName(s.plan)}</Badge>
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
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    <Badge className="bg-ironforge-primary/15 text-ironforge-primary border-ironforge-primary/30">{planName(r.plan)}</Badge>
                    <Badge className="border-ironforge-border text-ironforge-text-muted">{r.amount} {isAr ? 'ج.م' : 'EGP'}</Badge>
                    <Badge className="border-ironforge-border text-ironforge-text-muted">{methodName(r.method)}</Badge>
                  </div>
                  <p className="text-ironforge-text-muted mt-1" dir="ltr">{r.phone}</p>
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
            {shot && isSafeShot(shot) ? <img src={shot} alt="transfer" className="w-full rounded-xl" /> : <p className="text-center text-ironforge-text-muted text-sm">{isAr ? 'لا توجد صورة' : 'No screenshot'}</p>}
            <Button onClick={() => setShot(null)} variant="outline" className="w-full mt-3 border-ironforge-border">{isAr ? 'إغلاق' : 'Close'}</Button>
          </div>
        </div>
      )}
    </div>
  );
}
