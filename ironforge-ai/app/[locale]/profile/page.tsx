'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from '@/i18n/routing';
import {
  User,
  Camera,
  Mail,
  Calendar,
  Ruler,
  Weight,
  Activity,
  Save,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

export default function ProfilePage() {
  const t = useTranslations('profile');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [name, setName] = useState('Ahmad Ali');
  const [email, setEmail] = useState('ahmad@example.com');
  const [age, setAge] = useState('28');
  const [height, setHeight] = useState('178');
  const [weight, setWeight] = useState('76');
  const [goal, setGoal] = useState('Muscle Gain');
  const [activityLevel, setActivityLevel] = useState('Moderate');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('ironforge-profile');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.name) setName(data.name);
        if (data.email) setEmail(data.email);
        if (data.age) setAge(data.age);
        if (data.height) setHeight(data.height);
        if (data.weight) setWeight(data.weight);
        if (data.goal) setGoal(data.goal);
        if (data.activityLevel) setActivityLevel(data.activityLevel);
        if (data.avatar) setAvatar(data.avatar);
      } catch {}
    }
  }, []);

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      streamRef.current = stream;
      setShowCamera(true);
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      }, 100);
    } catch {
      fileInputRef.current?.click();
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setAvatar(dataUrl);
      closeCamera();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAvatar(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const data = { name, email, age, height, weight, goal, activityLevel, avatar };
    localStorage.setItem('ironforge-profile', JSON.stringify(data));
    // also try to save to Supabase if available
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('api');
    } catch {}
    setSaveMessage(locale === 'ar' ? 'تم حفظ البيانات بنجاح ✅' : 'Profile saved successfully ✅');
    setTimeout(() => setSaveMessage(null), 3000);
    setIsSaving(false);
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const infoCards = [
    { label: locale === 'ar' ? 'الوزن المستهدف' : 'Target weight', value: '78 kg' },
    { label: locale === 'ar' ? 'مستوى النشاط' : 'Activity level', value: 'Moderate' },
    { label: locale === 'ar' ? 'التقدم' : 'Progress', value: '82%' },
  ];

  return (
    <div className="min-h-screen bg-ironforge-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ironforge-text">{t('title')}</h1>
            <p className="text-ironforge-text-muted">{t('subtitle')}</p>
          </div>

          <Button onClick={handleSave} disabled={isSaving} className="bg-ironforge-primary hover:bg-ironforge-primary-dark text-ironforge-background disabled:opacity-50">
            <Save className="h-4 w-4" />
            {isSaving ? (locale === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (locale === 'ar' ? 'حفظ التغييرات' : 'Save Changes')}
          </Button>
          {saveMessage && (
            <p className="mt-2 text-sm font-medium text-emerald-400">{saveMessage}</p>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_2fr]">
          <Card className="border-ironforge-border bg-ironforge-card p-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-ironforge-primary/20 text-ironforge-primary ring-4 ring-ironforge-primary/10">
                  {avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatar} alt="avatar" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-12 w-12" />
                  )}
                </div>
                <button onClick={openCamera} className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border border-ironforge-border bg-ironforge-card text-ironforge-text shadow-md hover:bg-ironforge-primary hover:text-black transition">
                  <Camera className="h-4 w-4" />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" capture="user" className="hidden" onChange={handleFileChange} />
              </div>

              <div className="text-center">
                <h2 className="text-2xl font-bold text-ironforge-text">{name}</h2>
                <p className="text-ironforge-text-muted">{goal}</p>
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="primary">{locale === 'ar' ? 'مستوى' : 'Level'}: {activityLevel}</Badge>
                <Badge variant="secondary">{locale === 'ar' ? 'حالة صحية' : 'Healthy'} </Badge>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {infoCards.map((card) => (
                <div key={card.label} className="rounded-xl border border-ironforge-border bg-ironforge-background p-3">
                  <p className="text-xs text-ironforge-text-muted">{card.label}</p>
                  <p className="mt-1 text-lg font-semibold text-ironforge-text">{card.value}</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="border-ironforge-border bg-ironforge-card p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ironforge-primary/15 text-ironforge-primary">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-ironforge-text">{locale === 'ar' ? 'المعلومات الشخصية' : 'Personal Information'}</h3>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm text-ironforge-text-muted">{locale === 'ar' ? 'الاسم الكامل' : 'Full Name'}</span>
                  <Input value={name} onChange={(e) => setName(e.target.value)} className={isRTL ? 'text-right' : 'text-left'} />
                </label>

                <label className="space-y-2">
                  <span className="text-sm text-ironforge-text-muted">{locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}</span>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ironforge-text-muted" />
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} className={`${isRTL ? 'text-right pr-10' : 'pl-10 text-left'}`} />
                  </div>
                </label>

                <label className="space-y-2">
                  <span className="text-sm text-ironforge-text-muted">{locale === 'ar' ? 'العمر' : 'Age'}</span>
                  <div className="relative">
                    <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ironforge-text-muted" />
                    <Input value={age} onChange={(e) => setAge(e.target.value)} className={`${isRTL ? 'text-right pr-10' : 'pl-10 text-left'}`} />
                  </div>
                </label>

                <label className="space-y-2">
                  <span className="text-sm text-ironforge-text-muted">{locale === 'ar' ? 'الهدف الرئيسي' : 'Primary Goal'}</span>
                  <Input value={goal} onChange={(e) => setGoal(e.target.value)} className={isRTL ? 'text-right' : 'text-left'} />
                </label>
              </div>
            </Card>

            <Card className="border-ironforge-border bg-ironforge-card p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ironforge-primary/15 text-ironforge-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-ironforge-text">{locale === 'ar' ? 'إحصائيات الجسم' : 'Body Stats'}</h3>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm text-ironforge-text-muted">{locale === 'ar' ? 'الطول (سم)' : 'Height (cm)'}</span>
                  <div className="relative">
                    <Ruler className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ironforge-text-muted" />
                    <Input value={height} onChange={(e) => setHeight(e.target.value)} className={`${isRTL ? 'text-right pr-10' : 'pl-10 text-left'}`} />
                  </div>
                </label>

                <label className="space-y-2">
                  <span className="text-sm text-ironforge-text-muted">{locale === 'ar' ? 'الوزن (كجم)' : 'Weight (kg)'}</span>
                  <div className="relative">
                    <Weight className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ironforge-text-muted" />
                    <Input value={weight} onChange={(e) => setWeight(e.target.value)} className={`${isRTL ? 'text-right pr-10' : 'pl-10 text-left'}`} />
                  </div>
                </label>

                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm text-ironforge-text-muted">{locale === 'ar' ? 'مستوى النشاط' : 'Activity Level'}</span>
                  <div className="relative">
                    <Activity className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ironforge-text-muted" />
                    <Input value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)} className={`${isRTL ? 'text-right pr-10' : 'pl-10 text-left'}`} />
                  </div>
                </label>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {showCamera && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={closeCamera}>
          <div className="w-full max-w-md rounded-2xl bg-ironforge-card p-4" onClick={(e) => e.stopPropagation()}>
            <div className="relative overflow-hidden rounded-xl bg-black">
              <video ref={videoRef} autoPlay playsInline muted className="h-80 w-full object-cover" />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={capturePhoto} className="flex-1 bg-ironforge-primary text-black">
                {locale === 'ar' ? 'التقاط' : 'Capture'}
              </Button>
              <Button variant="outline" onClick={closeCamera} className="flex-1 border-ironforge-border text-ironforge-text">
                {locale === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="flex-1 border-ironforge-border text-ironforge-text">
                {locale === 'ar' ? 'المعرض' : 'Gallery'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
