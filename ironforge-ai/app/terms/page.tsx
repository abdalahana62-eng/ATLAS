import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'الشروط والأحكام | ATLAS',
  description: 'الشروط والأحكام لاستخدام تطبيق ATLAS AI Coach.',
  alternates: { canonical: '/terms' },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#05070b] text-white" dir="rtl">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-black text-[#a3e635]">الشروط والأحكام — ATLAS</h1>
        <p className="mt-2 text-sm text-slate-400">آخر تحديث: سبتمبر 2026 • atlasfit.pro/terms</p>

        <section className="mt-8 space-y-6 text-[15px] leading-8 text-slate-300">
          <div>
            <h2 className="text-lg font-bold text-white">1. الخدمة</h2>
            <p>ATLAS مدرب كمال أجسام بالذكاء الاصطناعي: أنظمة تمرين وتغذية وحاسبة سعرات. أول 3 أيام تجربة مجانية، ثم 299 جنيه شهرياً / 599 لثلاثة شهور / 2000 سنوياً.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">2. الاستخدام الصحي</h2>
            <p>المحتوى استرشادي وليس بديلاً عن استشارة طبية. استشر طبيبك قبل بدء أي برنامج تدريبي، وتوقف فوراً عند الشعور بألم.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">3. الاشتراك والإلغاء</h2>
            <p>تقدر تلغي في أي وقت من صفحة الاشتراك. المبالغ المدفوعة عن فترة مستخدمة غير قابلة للاسترداد إلا بخلل مثبت في الخدمة.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">4. الحساب</h2>
            <p>أنت مسؤول عن الحفاظ على سرية حسابك. يمنع مشاركة الحساب الواحد بين عدة أشخاص.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
