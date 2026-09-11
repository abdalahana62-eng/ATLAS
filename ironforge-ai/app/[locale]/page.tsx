import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import {
  ArrowRight,
  BarChart3,
  Dumbbell,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import TodayPlanCard from '@/components/TodayPlanCard';
import AuthCodeCatcher from '@/components/AuthCodeCatcher';

export default async function HomePage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'Home' });
  const isAr = locale === 'ar';

  const metrics = [
    { label: '12K+', value: t('metrics.workouts') },
    { label: '4.9/5', value: t('metrics.rating') },
    { label: '87%', value: t('metrics.consistency') },
  ];

  const features = [
    {
      icon: Target,
      title: t('features.aiCoach.title'),
      description: t('features.aiCoach.desc'),
    },
    {
      icon: TrendingUp,
      title: t('features.smartPlans.title'),
      description: t('features.smartPlans.desc'),
    },
    {
      icon: BarChart3,
      title: t('features.tracking.title'),
      description: t('features.tracking.desc'),
    },
  ];

  const faqs = isAr
    ? [
        {
          q: 'يعني ايه مدرب ذكاء اصطناعي؟',
          a: 'ATLAS مدرب AI بيكلمك بالعربي المصري البسيط: تسأله عن التمرين أو الأكل فيرد عليك بخطوات واضحة وأرقام دقيقة، كأنه مدرب بشري قاعد جنبك.',
        },
        {
          q: 'هل التطبيق مناسب للمبتدئين؟',
          a: 'أيوه، مصمم للمبتدئين بالذات: كل تمرينة ليها فيديو يشرح الأداء الصح، والمصطلحات الصعبة بتتشرح بكلام بسيط.',
        },
        {
          q: 'لازم جيم ولا فيه تمارين منزلية؟',
          a: 'الاتنين موجودين: أنظمة 2 و3 و4 و5 أيام للجيم، ونظام كامل للتمرين في المنزل بدون أجهزة.',
        },
        {
          q: 'نظام الأكل مصري ولا أكل أجانب؟',
          a: 'نظام غذائي مصري وسعودي بالجرامات: كشري وفول وطعمية وشكشوكة وفراخ ورز — مع 7 اختيارات لكل وجبة وحاسبة سعرات وماكروز.',
        },
        {
          q: 'بكام الاشتراك وازاي أدفع؟',
          a: 'أول 3 أيام تجربة مجانية، وبعدها 299 جنيه شهريًا أو 599 لثلاث شهور أو 2000 للسنة. الدفع انستاباي أو فودافون كاش.',
        },
        {
          q: 'ازاي بتابع تقدمي؟',
          a: 'منحنى وزن، سلسلة التزام يومية، ومستويات من ناشئ لأسطورة — كل ما تسجل تمرينك ووزنك وأكلك، لوحة التحكم بترسملك تقدمك.',
        },
      ]
    : [
        {
          q: 'What is an AI fitness coach?',
          a: 'ATLAS is an AI coach that answers in simple Arabic or English with clear steps and exact numbers — like a human trainer next to you.',
        },
        {
          q: 'Is it good for beginners?',
          a: 'Yes, built for beginners: every exercise has a form video, and hard terms are explained simply.',
        },
        {
          q: 'Gym only or home workouts too?',
          a: 'Both: 2, 3, 4 and 5-day gym systems plus a complete no-equipment home program.',
        },
        {
          q: 'Is the meal plan Egyptian food?',
          a: 'Yes — Egyptian and Saudi meal plans in exact grams (koshari, ful, taameya, shakshuka) with 7 choices per meal plus a calorie calculator.',
        },
        {
          q: 'How much and how do I pay?',
          a: '3-day free trial, then 299 EGP/month, 599 for 3 months, or 2000/year. Pay via Instapay or Vodafone Cash.',
        },
        {
          q: 'How do I track progress?',
          a: 'Weight curve, daily streaks, and levels from Rookie to Legend — log workouts, weight and meals and watch your dashboard.',
        },
      ];

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'ATLAS AI Coach',
      applicationCategory: 'HealthApplication',
      operatingSystem: ['Web', 'Android'],
      inLanguage: ['ar', 'en'],
      url: 'https://atlasfit.pro/',
      description: t('description'),
      offers: [
        { '@type': 'Offer', price: '299', priceCurrency: 'EGP', description: 'Monthly' },
        { '@type': 'Offer', price: '599', priceCurrency: 'EGP', description: 'Quarterly' },
        { '@type': 'Offer', price: '2000', priceCurrency: 'EGP', description: 'Yearly' },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ];

  return (
    <main className="relative overflow-hidden min-h-screen bg-[#05070b] text-white">
      <AuthCodeCatcher />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(151,210,59,0.22),_transparent_30%),radial-gradient(circle_at_right,_rgba(94,234,212,0.14),_transparent_25%)]" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 md:gap-10 md:px-10 md:py-8 lg:py-12">
        <header className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-sm sm:px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ironforge-primary/20 text-ironforge-primary">
              <Dumbbell className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-ironforge-primary uppercase">
                ATLAS
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-7 text-sm text-slate-300 md:flex">
            <span>{t('nav.programs')}</span>
            <span>{t('nav.nutrition')}</span>
            <span>{t('nav.coaching')}</span>
            <span>{t('nav.insights')}</span>
          </nav>

          <Link href="/auth/signup">
            <Button variant="secondary" size="sm" className="rounded-full border-white/10 bg-white/5 text-white">
              {t('joinNow')}
            </Button>
          </Link>
        </header>

        <section className="grid items-center gap-8 py-8 md:grid-cols-[1.2fr_0.8fr] md:py-14">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-ironforge-primary/30 bg-ironforge-primary/10 px-3 py-1.5 text-xs font-medium text-ironforge-primary">
              <Sparkles className="h-3.5 w-3.5" />
              {t('badge')}
            </div>

            <h1 className={isAr ? "max-w-xl text-4xl font-extrabold tracking-normal leading-[1.25] text-white md:text-[3.4rem] font-cairo" : "max-w-xl text-4xl font-black tracking-tight text-white md:text-6xl"}>
              {t('heroTitle1')}
              <span className="block text-ironforge-primary">{t('heroTitle2')}</span>
            </h1>

            <p className={isAr ? "mt-6 max-w-xl text-[17px] font-medium leading-8 text-slate-300 font-cairo tracking-normal" : "mt-6 max-w-xl text-lg leading-8 text-slate-300"}>
              {t('description')}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/onboarding">
                <Button size="lg" className="w-full rounded-2xl px-7 text-base shadow-lg shadow-ironforge-primary/20 sm:w-auto">
                  {t('common.next')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Link href="/auth/signup">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full rounded-2xl border-white/10 bg-white/5 px-7 text-base text-white sm:w-auto"
                >
                  {t('common.continue')}
                </Button>
              </Link>
            </div>

            <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
              {metrics.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <div className="text-xl font-bold text-white">{item.label}</div>
                  <div className="mt-1 text-xs text-slate-300">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <TodayPlanCard />
        </section>

        <section className="pb-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">{t('builtForResults')}</p>
              <h2 className="mt-2 text-3xl font-bold text-white">{t('everythingNeeds')}</h2>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <Card
                key={title}
                className="group border-white/10 bg-white/5 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-ironforge-primary/40 hover:bg-white/10"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-ironforge-primary/15 text-ironforge-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="pb-8">
          <div className="mb-6">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">
              {isAr ? 'أسئلة شائعة' : 'FAQ'}
            </p>
            <h2 className="mt-2 text-3xl font-bold text-white">
              {isAr ? 'كل اللي محتاج تعرفه' : 'Everything you need to know'}
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-base font-bold text-ironforge-primary">{f.q}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-300">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="border-t border-white/10 py-8 text-center">
          <p className="text-sm text-slate-400">
            Owner: <span className="font-semibold text-white">ABDALLAH SHENOO</span> — <a href="mailto:abdalahana555@gmail.com" className="text-ironforge-primary hover:underline">abdalahana555@gmail.com</a>
          </p>
          <p className="text-xs text-slate-500 mt-2">© 2026 ATLAS AI Coach. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
