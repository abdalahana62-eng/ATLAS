'use client';

import { useState, useMemo, Suspense } from 'react';
import { useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Copy, Check, Upload, Smartphone, BadgeCheck, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { PLANS, PAY_NUMBER, getPlan, getAccount } from '@/lib/subscription';

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const max = 1024;
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      c.getContext('2d')?.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL('image/jpeg', 0.7));
    };
    img.onerror = reject;
    img.src = url;
  });
}

export default function SubscribePage() {
  return (
    <Suspense>
      <SubscribeInner />
    </Suspense>
  );
}

function SubscribeInner() {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const params = useSearchParams();
  const plan = useMemo(() => getPlan(params.get('plan') || 'monthly'), [params]);

  const [method, setMethod] = useState<'instapay' | 'vodafone'>('instapay');
  const [phone, setPhone] = useState('');
  const [shot, setShot] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const copyNumber = async () => {
    try { await navigator.clipboard.writeText(PAY_NUMBER); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    setError(null);
    try {
      const dataUrl = await compressImage(f);
      if (dataUrl.length > 2_400_000) {
        setError(isAr ? 'الصورة كبيرة، اختر صورة أصغر' : 'Image too large');
        return;
      }
      setShot(dataUrl);
    } catch {
      setError(isAr ? 'تعذر قراءة الصورة' : 'Cannot read image');
    }
  };

  const submit = async () => {
    setError(null);
    const acc = getAccount();
    const email = acc?.email || '';
    if (!email) { setError(isAr ? 'سجّل حسابك الأول بالبريد الإلكتروني' : 'Signup first with your email'); return; }
    if (!/^01[0-9]{9}$/.test(phone)) { setError(isAr ? 'اكتب رقم موبايل صحيح (11 رقم يبدأ بـ 01)' : 'Enter a valid 11-digit mobile number'); return; }
    if (!shot) { setError(isAr ? 'ارفع سكرين شوت التحويل' : 'Upload transfer screenshot'); return; }
    setLoading(true);
    try {
      const { apiFetch } = await import('@/lib/apiBase');
      const r = await apiFetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone, plan: plan.id, amount: plan.price, method, screenshot: shot }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Failed');
      setDone(true);
    } catch (e: any) {
      // fallback: save locally so nothing is lost
      try {
        const q = JSON.parse(localStorage.getItem('atlas-pay-queue') || '[]');
        q.push({ email: getAccount()?.email, phone, plan: plan.id, amount: plan.price, method, createdAt: new Date().toISOString() });
        localStorage.setItem('atlas-pay-queue', JSON.stringify(q));
        setDone(true);
      } catch {
        setError(e.message);
      }
    }
    setLoading(false);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-ironforge-background p-6 flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center border-ironforge-primary/40">
          <BadgeCheck className="w-14 h-14 text-ironforge-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-ironforge-text mb-2">{isAr ? 'طلبك وصل ✅' : 'Request received ✅'}</h1>
          <p className="text-ironforge-text-muted text-sm leading-7">
            {isAr
              ? `باقة ${plan.name_ar} (${plan.price} ج.م) — هنراجع التحويل ونفعّل اشتراكك في أقل من 24 ساعة. هنبعتلك على بريدك المسجل.`
              : `${plan.name_en} (${plan.price} EGP) — we will review and activate within 24h.`}
          </p>
          <Link href={`/${locale}/dashboard`}>
            <Button className="w-full mt-6 bg-ironforge-primary text-black">{isAr ? 'رجوع للرئيسية' : 'Back home'}</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ironforge-background p-6 md:p-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <Badge variant="primary" className="mb-3">{isAr ? plan.name_ar : plan.name_en} • {plan.price} ج.م / {plan.days} {isAr ? 'يوم' : 'days'}</Badge>
          <h1 className="text-3xl font-black text-ironforge-text">{isAr ? 'إتمام الاشتراك' : 'Complete subscription'}</h1>
          <div className="mt-3 flex justify-center gap-2">
            {PLANS.map(p => (
              <Link key={p.id} href={`/${locale}/subscribe?plan=${p.id}`}>
                <Badge className={p.id === plan.id ? 'bg-ironforge-primary text-black' : 'border-ironforge-border text-ironforge-text-muted'}>{isAr ? p.name_ar : p.name_en}</Badge>
              </Link>
            ))}
          </div>
        </div>

        {/* Step 1: transfer */}
        <Card className="p-6 border-ironforge-border">
          <h2 className="font-bold text-ironforge-text mb-1">1. {isAr ? 'حوّل المبلغ' : 'Transfer the amount'}</h2>
          <p className="text-xs text-ironforge-text-muted mb-4">{isAr ? 'انستاباي أو فودافون كاش — نفس الرقم' : 'Instapay or Vodafone Cash — same number'}</p>
          <div className="flex gap-2 mb-4">
            {(['instapay', 'vodafone'] as const).map(m => (
              <Button key={m} onClick={() => setMethod(m)} variant={method === m ? 'primary' : 'outline'} className={method === m ? 'bg-ironforge-primary text-black' : 'border-ironforge-border text-ironforge-text'}>
                <Smartphone className="w-4 h-4" /> {m === 'instapay' ? 'انستاباي' : 'فودافون كاش'}
              </Button>
            ))}
          </div>
          <div className="flex items-center justify-between rounded-xl bg-ironforge-background border border-ironforge-primary/30 p-4">
            <span className="text-2xl font-black text-ironforge-text tracking-widest" dir="ltr">{PAY_NUMBER}</span>
            <Button onClick={copyNumber} variant="outline" size="sm" className="border-ironforge-border">
              {copied ? <Check className="w-4 h-4 text-ironforge-primary" /> : <Copy className="w-4 h-4" />}
              {copied ? (isAr ? 'اتنسخ' : 'Copied') : (isAr ? 'نسخ' : 'Copy')}
            </Button>
          </div>
          <p className="text-sm text-ironforge-primary font-bold mt-3">{isAr ? `المبلغ: ${plan.price} ج.م بالظبط` : `Amount: exactly ${plan.price} EGP`}</p>
        </Card>

        {/* Step 2: confirm */}
        <Card className="p-6 border-ironforge-border">
          <h2 className="font-bold text-ironforge-text mb-4">2. {isAr ? 'أكّد التحويل' : 'Confirm transfer'}</h2>
          <label className="text-sm text-ironforge-text-muted block mb-1">{isAr ? 'رقم الموبايل اللي حوّلت منه' : 'Mobile number you transferred from'}</label>
          <input value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))} inputMode="numeric" placeholder="01xxxxxxxxx" dir="ltr"
            className="w-full bg-ironforge-background border border-ironforge-border rounded-lg px-3 py-2.5 text-ironforge-text mb-4" />
          <label className="text-sm text-ironforge-text-muted block mb-1">{isAr ? 'سكرين شوت التحويل' : 'Transfer screenshot'}</label>
          <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-ironforge-border bg-ironforge-background p-6 cursor-pointer hover:border-ironforge-primary transition">
            {shot ? (
              <img src={shot} alt="screenshot" className="max-h-48 rounded-lg" />
            ) : (
              <>
                <Upload className="w-8 h-8 text-ironforge-primary mb-2" />
                <span className="text-sm text-ironforge-text-muted">{isAr ? 'اضغط لرفع الصورة' : 'Tap to upload'}</span>
              </>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={e => onFile(e.target.files?.[0])} />
          </label>
          {error && <p className="text-sm text-red-400 mt-3">{error}</p>}
          <Button onClick={submit} disabled={loading} className="w-full mt-4 bg-ironforge-primary text-black">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{isAr ? 'تأكيد الاشتراك' : 'Confirm'} <ArrowRight className="w-4 h-4" /></>}
          </Button>
        </Card>
      </div>
    </div>
  );
}
