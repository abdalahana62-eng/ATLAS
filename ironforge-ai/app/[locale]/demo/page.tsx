import { Dumbbell, Users, Zap, MessageSquare, BarChart3, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-[#05070b] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(151,210,59,0.18),_transparent_35%)]" />
      <div className="relative mx-auto max-w-6xl px-4 py-6 md:px-8">
        <header className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ironforge-primary text-black">
              <Dumbbell className="h-5 w-5" />
            </div>
            <span className="font-black tracking-widest">YOUR BRAND</span>
            <span className="hidden sm:inline text-xs text-white/50 border-l border-white/10 pl-3 ml-1">White-Label Demo</span>
          </div>
          <span className="text-xs bg-white text-black rounded-full px-3 py-1 font-bold">DEMO</span>
        </header>
        <section className="grid md:grid-cols-2 gap-8 py-10 md:py-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-ironforge-primary/30 bg-ironforge-primary/10 px-3 py-1 text-xs text-ironforge-primary">
              <Zap className="h-3 w-3" /> نفس تطبيق ATLAS - باسمك وألوانك
            </div>
            <h1 className="mt-4 text-4xl md:text-5xl font-black leading-tight">حوّل متابعينك <span className="text-ironforge-primary">لتطبيق باسمك</span></h1>
            <p className="mt-4 text-slate-300 leading-7">نفس السيستم اللي شغال عند ATLAS: انظمة 2-5 ايام + فيديوهات + AI Coach - بس بلوجو والوان الكوتش.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="https://wa.me/201000000000?text=عاوز%20الديمو%20باسمى" target="_blank"><Button size="lg" className="rounded-2xl">اطلب نسختك ب79$/شهر</Button></a>
              <Link href="/ar/workout"><Button variant="outline" size="lg" className="rounded-2xl border-white/10 bg-white/5 text-white">شوف التطبيق الحقيقي</Button></Link>
            </div>
            <div className="mt-6 flex items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1"><Check className="h-4 w-4 text-ironforge-primary" /> جاهز في 24 ساعة</span>
              <span className="flex items-center gap-1"><Check className="h-4 w-4 text-ironforge-primary" /> بدون كود</span>
              <span className="flex items-center gap-1"><Check className="h-4 w-4 text-ironforge-primary" /> بلغتين</span>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[360px] rounded-[36px] border border-white/10 bg-gradient-to-b from-[#101820] to-[#0a0d12] p-3 shadow-2xl">
            <div className="rounded-[28px] bg-[#090d12] border border-white/10 p-4">
              <div className="flex items-center justify-between mb-4">
                <div><p className="text-xs text-slate-400">Today - Push Day</p><p className="font-bold">YOUR BRAND</p></div>
                <div className="h-8 w-8 rounded-full bg-ironforge-primary/20 flex items-center justify-center"><Dumbbell className="h-4 w-4 text-ironforge-primary" /></div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center rounded-2xl bg-white/5 border border-white/10 px-3 py-3 text-sm"><span>Bench Press - 4x8</span><span className="text-ironforge-primary">▶</span></div>
                <div className="flex justify-between items-center rounded-2xl bg-white/5 border border-white/10 px-3 py-3 text-sm"><span>Incline Dumbbell - 3x10</span><span className="text-ironforge-primary">▶</span></div>
                <div className="flex justify-between items-center rounded-2xl bg-white/5 border border-white/10 px-3 py-3 text-sm"><span>Overhead Press - 4x6</span><span className="text-ironforge-primary">▶</span></div>
              </div>
              <div className="mt-4 rounded-2xl bg-ironforge-primary text-black p-3 text-center font-bold">Start Workout</div>
              <p className="text-center text-[10px] text-white/30 mt-2">هذا مجرد ديمو - نسختك ستكون بنفس الشكل باسمك</p>
            </div>
          </div>
        </section>
        <section className="grid md:grid-cols-3 gap-4 pb-10">
          <Card className="bg-white/5 border-white/10 p-6"><Users className="h-6 w-6 text-ironforge-primary mb-3" /><h3 className="font-bold">عملاءك في مكان واحد</h3><p className="text-sm text-slate-400 mt-2">تابع تقدم كل عميل بدل شيتات وواتساب.</p></Card>
          <Card className="bg-white/5 border-white/10 p-6"><MessageSquare className="h-6 w-6 text-ironforge-primary mb-3" /><h3 className="font-bold">AI Coach باسمك</h3><p className="text-sm text-slate-400 mt-2">يجاوب على اسئلة التغذية والتمارين 24/7.</p></Card>
          <Card className="bg-white/5 border-white/10 p-6"><BarChart3 className="h-6 w-6 text-ironforge-primary mb-3" /><h3 className="font-bold">دفع واشتراكات</h3><p className="text-sm text-slate-400 mt-2">العميل يدفع داخل التطبيق.</p></Card>
        </section>
        <footer className="border-t border-white/10 py-6 text-center text-sm text-slate-500">لينك واحد ثابت للكل: <span className="text-white font-mono">/ar/demo</span> - تبعته لكل المدربين</footer>
      </div>
    </main>
  );
}
