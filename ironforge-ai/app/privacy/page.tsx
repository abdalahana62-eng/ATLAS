import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'سياسة الخصوصية | ATLAS',
  description: 'سياسة الخصوصية لتطبيق ATLAS AI Coach - اطلس مدرب كمال الأجسام الذكي.',
  alternates: { canonical: '/privacy' },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#05070b] text-white" dir="rtl">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-black text-[#a3e635]">سياسة الخصوصية — ATLAS</h1>
        <p className="mt-2 text-sm text-slate-400">آخر تحديث: سبتمبر 2026 • atlasfit.pro/privacy</p>

        <section className="mt-8 space-y-6 text-[15px] leading-8 text-slate-300">
          <div>
            <h2 className="text-lg font-bold text-white">1. البيانات اللي بنجمعها</h2>
            <p>الحساب: البريد الإلكتروني والاسم (عبر Supabase Auth). بيانات التدريب: الأوزان والعدات والتمارين اللي بتسجلها، وقياسات الجسم اللي بتدخلها بنفسك. بيانات الاشتراك: حالة التجربة المجانية والاشتراك فقط — الدفع يتم عبر انستاباي / فودافون كاش خارج التطبيق ولا نخزن بيانات بطاقات بنكية.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">2. استخدام البيانات</h2>
            <p>بنستخدم بياناتك لتشغيل خطتك التدريبية، وحفظ تقدمك، وتحسين المدرب الذكي. مش بنبيع بياناتك لأي طرف ثالث.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">3. المشاركة مع أطراف ثالثة</h2>
            <p>Supabase (قاعدة البيانات والمصادقة)، Google (تسجيل الدخول)، Vercel (الاستضافة). كلهم ملتزمون بمعايير حماية البيانات.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">3/1. الإعلانات (Google AdMob)</h2>
            <p>نسخة الأندرويد من التطبيق تعرض إعلانات عبر Google AdMob. قد تجمع Google معرف الإعلانات الخاص بجهازك وبيانات استخدام تقريبية لعرض الإعلانات وقياسها ومنع الاحتيال، وفق سياسة خصوصية Google. يمكنك إعادة ضبط معرف الإعلانات أو حذفه من إعدادات جهازك (الإعدادات ← الخصوصية ← الإعلانات)، وإدارة موافقة الإعلانات من رسالة الموافقة التي تظهر عند أول تشغيل.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">4. حقوقك</h2>
            <p>تقدر تطلب تصدير بياناتك أو حذف حسابك نهائياً في أي وقت — وسيتم الحذف خلال 7 أيام.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">5. الأطفال</h2>
            <p>التطبيق غير موجه لمن هم أقل من 16 سنة.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">6. التواصل</h2>
            <p>ATLAS AI Coach — المالك: ABDALLAH SHENOO</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm">
            <p className="font-bold text-white">Privacy Policy (EN summary)</p>
            <p className="mt-1">ATLAS collects account (email/name), workout logs you enter, and subscription status. No bank card data stored. Data processed via Supabase/Google/Vercel. You can request export or deletion anytime (within 7 days). Not for children under 16.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
