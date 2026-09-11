// ATLAS Knowledge Base — verified fitness/nutrition/injury info (AR primary).
// The AI coach MUST ground answers in these entries, never invent numbers.
export interface KBEntry {
  id: string;
  category: 'fat_loss' | 'cutting' | 'injury' | 'rehab' | 'general';
  medical: boolean; // true → must attach doctor disclaimer
  keywords: string[]; // ar + en triggers
  title_ar: string;
  content_ar: string;
  content_en: string;
}

export const KNOWLEDGE: KBEntry[] = [
  // ================= FAT LOSS =================
  {
    id: 'fl-deficit', category: 'fat_loss', medical: false,
    keywords: ['تخسيس', 'اخس', 'انقص وزن', 'عجز', 'دايت', 'رجيم', 'lose weight', 'fat loss', 'deficit', 'diet', 'خسارة الدهون', 'انقاص'],
    title_ar: 'عجز السعرات للتخسيس',
    content_ar: 'التخسيس = عجز سعرات 500-750 سعرة تحت احتياجك اليومي (TDEE). المعدل الصحي: 0.5-1% من وزن جسمك أسبوعياً (لشخص 80كجم = 0.4-0.8كجم/أسبوع). كيلو الدهون ≈ 7700 سعرة. عجز أكبر من 1000 سعرة يسبب فقدان عضلات وإرهاق.',
    content_en: 'Fat loss = 500-750 kcal deficit below TDEE. Healthy rate: 0.5-1% bodyweight/week. 1kg fat ≈ 7700 kcal.',
  },
  {
    id: 'fl-protein', category: 'fat_loss', medical: false,
    keywords: ['بروتين', 'protein', 'التخسيس', 'يحافظ عضل', 'كم بروتين'],
    title_ar: 'البروتين أثناء التخسيس',
    content_ar: 'أثناء التخسيس ارفع البروتين إلى 2-2.4جم لكل كجم من وزنك يومياً (شخص 80كجم = 160-190جم). البروتين يحافظ على العضلات ويشبع أكثر (التأثير الحراري للبروتين 20-30% من سعراته). وزعه على 3-5 وجبات (25-50جم بروتين للوجبة).',
    content_en: 'During fat loss: 2-2.4g protein/kg/day. Thermic effect 20-30%. Spread over 3-5 meals.',
  },
  {
    id: 'fl-cardio', category: 'fat_loss', medical: false,
    keywords: ['كارديو', 'cardio', 'مشي', 'جري', 'walking', 'running', 'حرق'],
    title_ar: 'الكارديو للتخسيس',
    content_ar: 'المشي 8000-10000 خطوة يومياً هو أساس الحرق. كارديو إضافي: 150-300 دقيقة أسبوعياً متوسط الشدة (مشي سريع/عجلة) أو 75 دقيقة عالية الشدة. تمارين المقاومة 3-5 مرات أسبوعياً إجبارية للحفاظ على العضل — الكارديو وحده يحرق عضلات.',
    content_en: '8-10k steps daily base. 150-300 min/week moderate cardio. Resistance 3-5x/week mandatory.',
  },
  {
    id: 'fl-plateau', category: 'fat_loss', medical: false,
    keywords: ['ثبات', 'plateau', 'ميزان واقف', 'مبنزلش', 'stuck', 'ثبات الوزن'],
    title_ar: 'كسر ثبات الوزن',
    content_ar: 'الثبات أكثر من أسبوعين يعني: 1) احسب سعراتك من جديد (وزنك نزل فاحتياجك قل) 2) راجع الالتزام الحقيقي (90% من حالات الثبات = أكل غير محسوب) 3) زود النشاط 2000 خطوة 4) يوم ريفيد واحد عالي الكارب كل 10-14 يوم 5) نام 7-9 ساعات (قلة النوم ترفع الجوع 15%).',
    content_en: 'Break plateaus: recalc TDEE, audit compliance, +2000 steps, refeed day, sleep 7-9h.',
  },
  {
    id: 'fl-belly', category: 'fat_loss', medical: false,
    keywords: ['كرش', 'بطن', 'belly', 'دهون البطن', 'belly fat', 'تخسيس البطن'],
    title_ar: 'دهون البطن (الكرش)',
    content_ar: 'مفيش تخسيس موضعي — تمارين البطن لا تحرق دهون البطن. الكرش ينزل بعجز السعرات العام + البروتين العالي + النوم + تقليل السكر والكحول. دهون البطن الحشوية خطرة (ترتبط بالسكري والقلب) وتنزل أولاً عادة مع الالتزام.',
    content_en: 'No spot reduction. Belly fat drops via overall deficit + protein + sleep. Visceral fat usually goes first.',
  },
  {
    id: 'fl-water', category: 'fat_loss', medical: false,
    keywords: ['ميه', 'ماء', 'water', 'احتباس', 'انتفاخ', 'hydration', 'شرب'],
    title_ar: 'الميه والاحتباس',
    content_ar: 'اشرب 35مل لكل كجم من وزنك (80كجم = 2.8 لتر) + 500مل لكل ساعة تمرين. قلة الميه تسبب احتباس عكسي وثبات وهمي على الميزان. الصوديوم العالي والكارب العالي يحبسان ميه مؤقتاً — طبيعي ويروح في 2-3 أيام.',
    content_en: '35ml/kg water daily +500ml per training hour. Low water causes rebound retention.',
  },
  {
    id: 'fl-cheat', category: 'fat_loss', medical: false,
    keywords: ['فري', 'cheat', 'refeed', 'ريفيد', 'وجبة مفتوحة', 'cheat meal'],
    title_ar: 'الوجبة المفتوحة والريفيد',
    content_ar: 'وجبة مفتوحة واحدة أسبوعياً (مش يوم كامل) لا تضر. الريفيد المخطط: يوم واحد كل 10-14 يوم بسعرات الصيانة مع كارب عالٍ (يرفع اللبتين ويحسن الالتزام). الفرق: الفري عشوائي، الريفيد محسوب. لا تعوض بعده بصيام قاسٍ.',
    content_en: 'One cheat meal/week is fine. Planned refeed: maintenance calories, high carb, every 10-14 days.',
  },
  {
    id: 'fl-sleep', category: 'fat_loss', medical: false,
    keywords: ['نوم', 'sleep', 'أرق', 'سهر', 'نوم قليل'],
    title_ar: 'النوم والتخسيس',
    content_ar: 'النوم أقل من 6 ساعات: يرفع هرمون الجوع (الجريلين) ويخفض الشبع (اللبتين)، ويجعل 60% من الوزن المفقود عضلات بدل دهون. المطلوب 7-9 ساعات. ثبت موعد النوم والاستيقاظ + ابعد الشاشات ساعة قبل النوم.',
    content_en: '<6h sleep raises hunger hormones; lost weight becomes 60% muscle. Target 7-9h.',
  },
  // ================= CUTTING (تنشيف) =================
  {
    id: 'cut-guide', category: 'cutting', medical: false,
    keywords: ['تنشيف', 'cutting', 'define', 'تشريح', 'عضلات ناشفة', 'cut'],
    title_ar: 'دليل التنشيف',
    content_ar: 'التنشيف = عجز 15-25% تحت TDEE (ابدأ بـ20%) + بروتين 2-2.4جم/كجم + دهون 0.8-1جم/كجم والباقي كارب + استمر على نفس أوزانك في التمرين (لا تخفف الأوزان — خفف الحجم 10-20% لو تعبت). المدة الصحية: 8-16 أسبوع. النزول المستهدف 0.5-1%/أسبوع.',
    content_en: 'Cutting = 15-25% deficit + protein 2-2.4g/kg + keep lifting heavy. 8-16 weeks.',
  },
  {
    id: 'cut-carbs', category: 'cutting', medical: false,
    keywords: ['كارب', 'carb', 'كربوهيدرات', 'carb cycling', 'تدوير الكارب', 'نشويات'],
    title_ar: 'تدوير الكاربوهيدرات',
    content_ar: 'تدوير الكارب: أيام التمرين كارب عالٍ (4-6جم/كجم)، أيام الراحة كارب منخفض (1-2جم/كجم)، البروتين ثابت يومياً. الكارب حول التمرين (قبل وبعد) يحافظ على الأداء. الكيتو ليس إجبارياً — المهم إجمالي السعرات.',
    content_en: 'Carb cycling: high carb on training days (4-6g/kg), low on rest (1-2g/kg). Protein constant.',
  },
  {
    id: 'cut-strength', category: 'cutting', medical: false,
    keywords: ['قوة بتنزل', 'ضعفت', 'strength loss', 'أوزاني نزلت', 'أداء'],
    title_ar: 'نزول القوة أثناء التنشيف',
    content_ar: 'نزول 5-10% من أوزانك في آخر التنشيف طبيعي. للحفاظ على القوة: حافظ على التمارين المركبة الثقيلة (3-6 عدات)، نام كويس، خد كرياتين 3-5جم يومياً، ولا تطول التنشيف عن 16 أسبوع بدون بريك. لو النزول أكثر من 15% راجع سعراتك (العجز كبير زيادة).',
    content_en: '5-10% strength drop late in a cut is normal. Keep heavy compounds, creatine 3-5g, deload as needed.',
  },
  {
    id: 'cut-cardio', category: 'cutting', medical: false,
    keywords: ['كارديو التنشيف', 'كارديو', 'cutting cardio', 'صيام', 'fasted cardio'],
    title_ar: 'الكارديو في التنشيف',
    content_ar: 'ابدأ التنشيف بدون كارديو إضافي (العجز من الأكل فقط)، وأضف الكارديو تدريجياً عند الثبات: 2-3 جلسات × 20-30 دقيقة. الكارديو على معدة فاضية لا يحرق دهون أكثر من العادي — المهم الإجمالي الأسبوعي. المشي اليومي (10k خطوة) أفضل من جلسات عنيفة تحرق عضلات.',
    content_en: 'Start cut without added cardio; add 2-3x20-30min when stalled. Fasted cardio has no fat-loss advantage.',
  },
  // ================= INJURIES =================
  {
    id: 'inj-firstaid', category: 'injury', medical: true,
    keywords: ['إصابة', 'اتصبت', 'injury', 'ألم حاد', 'injured', 'إسعاف', 'ورم', 'التواء'],
    title_ar: 'الإسعاف الأولي للإصابات (PEACE & LOVE)',
    content_ar: 'أول 48 ساعة (PEACE): وقف التمرين على المنطقة (Protect)، ارفعها فوق مستوى القلب (Elevate)، كمادات ثلج 15 دقيقة كل ساعتين أول يوم (Avoid ice بعد 48س)، ضمادة ضاغطة (Compress)، وروح لدكتور لو: ألم شديد، تورم كبير، عدم قدرة على الحركة، طقطقة لحظة الإصابة، تنميل. بعد 48 ساعة (LOVE): حركة خفيفة تدريجية + تمارين + صبر. ⚠️ معلومات استرشادية وليست تشخيصاً — استشر طبيباً.',
    content_en: 'First 48h: stop, elevate, ice 15min/2h, compress. See a doctor for severe pain, big swelling, inability to move, numbness. Educational only — see a doctor.',
  },
  {
    id: 'inj-shoulder', category: 'injury', medical: true,
    keywords: ['كتف', 'shoulder', 'impingement', 'انحشار', 'ألم الكتف', 'rotator'],
    title_ar: 'ألم الكتف (الانحشار)',
    content_ar: 'السبب الأشهر: بنش بزوايا غلط + كتف أمامي مهمل + إحماء ضعيف. الأعراض: ألم عند رفع الذراع فوق الرأس أو البنش. العلاج الأولي: وقف الضغط فوق الرأس والبنش العريض 2-4 أسابيع، كمادات، تمارين rotator cuff الخفيفة (external rotation باستك)، تقوية الكتف الخلفي والترابيس السفلي. تجنب الحقن المسكنة بدون دكتور. لو الألم ليلي أو مع ضعف — دكتور فوراً. ⚠️ استشر طبيباً.',
    content_en: 'Shoulder impingement: stop overhead pressing 2-4 weeks, external rotation band work, rear delt. Night pain/weakness → doctor.',
  },
  {
    id: 'inj-back', category: 'injury', medical: true,
    keywords: ['ظهر', 'back', 'قطنية', 'lower back', 'ديسك', 'disc', 'عرق النسا', 'sciatica', 'ألم الظهر'],
    title_ar: 'ألم أسفل الظهر والديسك',
    content_ar: 'معظم آلام الظهر من الشد العضلي (تتحسن في 2-6 أسابيع): راحة نسبية (لا سرير كامل)، مشي، كمادات دافئة بعد 48س، وتقوية الكور تدريجياً. علامات الخطر (روح طوارئ): ألم نازل للرجل مع تنميل/ضعف، فقدان تحكم مثانة/أمعاء، ألم بعد حادث، ألم ليلي لا يتحسن. الديدليفت والسكوات بأوزان ثقيلة ممنوعة حتى الشفاء. ⚠️ استشر طبيباً.',
    content_en: 'Most back pain is muscular (2-6 weeks): relative rest, walk, heat after 48h. Red flags: leg numbness/weakness, bladder issues → ER.',
  },
  {
    id: 'inj-knee', category: 'injury', medical: true,
    keywords: ['ركبة', 'knee', 'ألم الركبة', 'meniscus', 'غضروف', 'رباط', 'knee pain'],
    title_ar: 'ألم الركبة والغضروف',
    content_ar: 'ألم حول الصابونة مع الطلوع/النزول = غالباً ضعف عضلة الفخذ الأمامية الداخلية (VMO) — العلاج: تقوية quadriceps (leg extension جزئي)، وتقليل السكوات العميق مؤقتاً. علامات الغضروف/الرباط: طقطقة + تورم سريع + الركبة "بتخون" (تعطي) — تحتاج رنين ودكتور عظام. الثلج والراحة والرباط الضاغط أولياً. تجنب الجري والقفز حتى التشخيص. ⚠️ استشر طبيباً.',
    content_en: 'Pain around kneecap = often weak quads; giving-way + rapid swelling suggests meniscus/ligament → MRI/doctor.',
  },
  {
    id: 'inj-elbow', category: 'injury', medical: true,
    keywords: ['كوع', 'elbow', 'تنس', 'tennis elbow', 'golfer', 'ألم الكوع', 'الساعد'],
    title_ar: 'التهاب أوتار الكوع (تنس/جولف)',
    content_ar: 'تنس إلبو (خارج الكوع): من التراي والبنش الثقيل. جولف إلبو (داخل الكوع): من الباي والسحب. العلاج: وقف التمرين المسبب 3-6 أسابيع، ثلج، تمارين eccentric للساعد (نزول بطيء بوزن خفيف 3×15 يومياً)، ورباط الكوع أثناء التمرين لاحقاً. الحقن (كورتيزون/PRP) بقرار دكتور فقط. ⚠️ استشر طبيباً.',
    content_en: 'Tennis (outer)/golfer (inner) elbow: stop culprit 3-6 weeks, daily eccentric wrist work 3x15, ice.',
  },
  {
    id: 'inj-wrist', category: 'injury', medical: true,
    keywords: ['رسغ', 'wrist', 'معصم', 'ألم الرسغ', 'wrist pain'],
    title_ar: 'ألم الرسغ',
    content_ar: 'السبب: بنش بقبضة مثنية للخلف + ضغط بأوزان عالية بدون دعامة. الحل الفوري: wraps للرسغ، قبضة مستقيمة (البار فوق عظمة الساعد)، وقف الضغط 1-2 أسبوع مع ثلج. تقوية: wrist curls وreverse curls خفيفة. لو تورم/ألم مستمر أكثر من 3 أسابيع — أشعة (كسر زورقي خفي شائع). ⚠️ استشر طبيباً.',
    content_en: 'Wrist pain: straight grip, wrist wraps, rest 1-2 weeks. Persistent >3 weeks → X-ray (scaphoid).',
  },
  {
    id: 'inj-strain', category: 'injury', medical: true,
    keywords: ['شد', 'strain', 'مزق', 'تمزق', 'pull', 'عضلة اتقطعت', 'شد عضلي'],
    title_ar: 'الشد والتمزق العضلي',
    content_ar: 'الدرجة 1 (شد): ألم خفيف، راحة 1-2 أسبوع + عودة تدريجية. الدرجة 2 (تمزق جزئي): ألم متوسط + كدمة، راحة 3-6 أسابيع + علاج طبيعي. الدرجة 3 (قطع كامل): ألم حاد + فراغ محسوس + ضعف كامل — طوارئ وغالباً جراحة. القاعدة الذهبية: لا ترجع للتمرين بنفس الوزن — ابدأ بـ50% وزد 10% أسبوعياً بدون ألم. ⚠️ استشر طبيباً.',
    content_en: 'Grade 1: 1-2 weeks. Grade 2: 3-6 weeks + physio. Grade 3 (gap + full weakness): ER. Return at 50%, +10%/week pain-free.',
  },
  {
    id: 'inj-ankle', category: 'injury', medical: true,
    keywords: ['كاحل', 'ankle', 'التواء', 'sprain', 'كاحل ملوي', 'ankle pain'],
    title_ar: 'التواء الكاحل',
    content_ar: 'RICE فوراً: راحة + ثلج 15د كل ساعتين + ضمادة ضاغطة + رفع فوق القلب. لو لا تستطيع الوقوف 4 خطوات أو تورم شديد سريع — أشعة (قاعدة Ottawa) لاستبعاد الكسر. التأهيل: حروف الأبجدية بالقدم + وقوف على رجل واحدة + تقوية باستك. 80% تلتئم في 2-6 أسابيع. ⚠️ استشر طبيباً.',
    content_en: 'Ankle sprain: RICE immediately. Cannot bear weight → X-ray. Rehab: alphabet, single-leg balance, band work.',
  },
  {
    id: 'inj-shin', category: 'injury', medical: true,
    keywords: ['سمانة', 'قصبة', 'shin', 'shin splints', 'ألم الساق', 'calf'],
    title_ar: 'ألم القصبة والسمانة',
    content_ar: 'Shin splints: من زيادة الجري فجأة أو حذاء سيئ — قلل المسافة 50%، ثلج، تمارين toe raises (3×20)، وغيّر الحذاء. شد السمانة المفاجئ: وقف + ثلج + لا تمدد بعنف أول 48س. التمزق مع صوت "فرقعة" + كدمة = راحة 4-8 أسابيع. ⚠️ استشر طبيباً.',
    content_en: 'Shin splints: cut mileage 50%, ice, toe raises, better shoes. Calf pop + bruise = 4-8 weeks off.',
  },
  {
    id: 'inj-prevent', category: 'injury', medical: false,
    keywords: ['إحماء', 'warmup', 'وقاية', 'warm up', 'تسخين', 'prevent injury', 'إطالات', 'stretching'],
    title_ar: 'الإحماء والوقاية من الإصابات',
    content_ar: 'الإحماء الصح: 5 دقائق كارديو خفيف + مجموعتين خفيفتين من أول تمرين (50% ثم 70% من الوزن) + تحريك المفاصل (كتف/ورك). الإطالات الثابتة بعد التمرين مش قبله (قبل التمرين تضعف الأداء 5-8%). ديلود كل 6-8 أسابيع (أسبوع 50% حجم). النوم والتغذية جزء من الوقاية.',
    content_en: 'Warm up: 5min cardio + 2 light sets (50%, 70%) + joint circles. Static stretching AFTER training. Deload every 6-8 weeks.',
  },
  // ================= REHAB / GENERAL =================
  {
    id: 'gen-creatine', category: 'general', medical: false,
    keywords: ['كرياتين', 'creatine', 'مكمل', 'supplement', 'مكملات'],
    title_ar: 'الكرياتين',
    content_ar: 'الكرياتين مونوهيدرات هو المكمل الأكثر إثباتاً: 3-5جم يومياً (أي وقت، مع ميه كافية)، يزيد القوة 5-15% وحجم العضلة. آمن للكلى السليمة (شائعة خرافة الضرر). لا يحتاج تحميل. زيادة 1-2كجم ميه داخل العضلة طبيعية. تجنب الأنواع الغالية (HCL/ethyl ester) — المونوهيدرات الأرخص والأفضل دراسة.',
    content_en: 'Creatine monohydrate 3-5g/day, anytime. Safest, most-studied supplement. No loading needed.',
  },
  {
    id: 'gen-protein-need', category: 'general', medical: false,
    keywords: ['احتياج بروتين', 'كم بروتين', 'protein needs', 'protein per day'],
    title_ar: 'احتياج البروتين اليومي',
    content_ar: 'خامل: 0.8-1جم/كجم. تضخيم: 1.6-2جم/كجم. تنشيف: 2-2.4جم/كجم. أكثر من 2.5جم/كجم لا فائدة إضافية مثبتة. مثال: 80كجم تضخيم = 130-160جم بروتين (صدر فرخة 200جم ≈ 60جم بروتين + 4 بيضات ≈ 24جم + باقي الأكل).',
    content_en: 'Sedentary 0.8-1, bulking 1.6-2, cutting 2-2.4 g/kg. Above 2.5g/kg no proven benefit.',
  },
  {
    id: 'gen-water', category: 'general', medical: false,
    keywords: ['ميه', 'ماء', 'water', 'ترطيب', 'اشرب', 'hydration'],
    title_ar: 'الميه للرياضيين',
    content_ar: '35مل/كجم يومياً أساسي + 500-1000مل لكل ساعة تمرين. الجفاف 2% فقط يخفض الأداء 10-20%. لون البول الأصفر الفاتح = ترطيب ممتاز. في الصيف أو التعرق الشديد أضف ملح/إلكتروليت (موزة + رشة ملح تكفي).',
    content_en: '35ml/kg + 500-1000ml per training hour. 2% dehydration cuts performance 10-20%.',
  },
  {
    id: 'gen-deload', category: 'general', medical: false,
    keywords: ['ديلود', 'deload', 'راحة', 'استشفاء', 'recovery', 'overtraining', 'إرهاق'],
    title_ar: 'الديلود والاستشفاء',
    content_ar: 'علامات تحتاج ديلود: ثبات/نزول أوزان أسبوعين + أرق + مفاصل بتوجع + فقدان حماس. الديلود = أسبوع بنصف الحجم (نفس التمارين، 50% مجموعات أو 60% أوزان). النوم 7-9 ساعات + بروتين كافي = 80% من الاستشفاء. الإفراط الحقيقي نادر — غالباً نقص أكل/نوم.',
    content_en: 'Deload week at 50% volume every 6-8 weeks or on stalled lifts + poor sleep + joint aches.',
  },
  {
    id: 'gen-beginner', category: 'general', medical: false,
    keywords: ['مبتدئ', 'beginner', 'ابدأ', 'start', 'جديد', 'أول مرة جيم'],
    title_ar: 'دليل المبتدئ',
    content_ar: 'أول 3 شهور: 3 أيام full body (تمرين لكل عضلة) + تعلم الأداء الصح بأوزان خفيفة + بروتين 1.6جم/كجم + نوم. لا تحتاج مكملات ولا برامج معقدة. الزيادة الطبيعية أول سنة: 8-12كجم عضل للرجل. الاستمرارية أهم من الكمال.',
    content_en: 'First 3 months: 3x full body, light weights, learn form, 1.6g/kg protein. Consistency beats perfection.',
  },
  {
    id: 'gen-whey', category: 'general', medical: false,
    keywords: ['واي', 'whey', 'بروتين بودر', 'مكمل بروتين', 'protein powder', 'سcoop'],
    title_ar: 'الواي بروتين',
    content_ar: 'الواي بروتين = بروتين مصل اللبن المجفف (25جم بروتين/سكوب 30جم). ليس سحراً — بديل عملي لو مش بتكمل بروتينك من الأكل. الأنواع: Concentrate (أرخص، فيه لاكتوز) وIsolate (أنقى، للي عنده حساسية لاكتوز). التوقيت غير مهم — المهم الإجمالي اليومي. آمن للكلى السليمة.',
    content_en: 'Whey = dried milk protein (25g/scoop). Convenience, not magic. Concentrate vs isolate (lactose). Timing irrelevant; daily total matters.',
  },
  {
    id: 'gen-omega-vitd', category: 'general', medical: false,
    keywords: ['أوميجا', 'omega', 'فيتامين د', 'vitamin d', 'فيتامين', 'vitamins', 'زنك', 'zinc', 'مغنيسيوم', 'magnesium'],
    title_ar: 'أوميجا 3 وفيتامين د',
    content_ar: 'المصريون والعرب: نقص فيتامين د شائع (70%+) رغم الشمس — حلل أولاً، والجرعة الشائعة 1000-2000IU يومياً مع وجبة دهنية (بقرار دكتور لو النقص شديد). أوميجا 3: 1-2جم EPA+DHA يومياً من السمك الدهني مرتين أسبوعياً أو مكمل. الزنك والمغنيسيوم من الأكل المتنوع غالباً كافية.',
    content_en: 'Vitamin D deficiency common — test first, 1000-2000IU/day typical. Omega-3: 1-2g EPA+DHA from fatty fish 2x/week.',
  },
  {
    id: 'gen-fiber', category: 'general', medical: false,
    keywords: ['ألياف', 'fiber', 'هضم', 'إمساك', 'شوفان', 'خضار', 'digestion'],
    title_ar: 'الألياف والهضم',
    content_ar: 'المطلوب 25-35جم ألياف يومياً (خضار + شوفان + بقول + فاكهة). الألياف تشبع وتحسن الهضم وتثبت السكر. زودها تدريجياً + ميه كافية وإلا تسبب انتفاخ. الفول والعدس والشوفان أرخص مصادر.',
    content_en: '25-35g fiber/day. Increase gradually + water. Beans, lentils, oats cheapest sources.',
  },
  {
    id: 'gen-sugar-salt', category: 'general', medical: false,
    keywords: ['سكر', 'sugar', 'ملح', 'salt', 'صوديوم', 'sodium', 'حلويات', 'سكر أبيض'],
    title_ar: 'السكر والملح (حدود WHO)',
    content_ar: 'منظمة الصحة: السكر المضاف أقل من 10% من السعرات (لـ2000 سعرة = أقل من 50جم ≈ 12 معلقة صغيرة) — والأفضل أقل من 5%. الملح: أقل من 5جم/يوم (معلقة صغيرة). أغلب الملح يأتي من الأكل الجاهز والمخلل والجبن المملح — احسبه لو ضغطك عالٍ.',
    content_en: 'WHO: added sugar <10% calories (<50g at 2000kcal), salt <5g/day. Most salt from processed/pickled food.',
  },
  {
    id: 'gen-timing', category: 'general', medical: false,
    keywords: ['قبل التمرين', 'بعد التمرين', 'pre workout', 'post workout', 'توقيت الأكل', 'meal timing', 'أكل قبل'],
    title_ar: 'الأكل قبل وبعد التمرين',
    content_ar: 'قبل التمرين بـ1-2 ساعة: وجبة كارب + بروتين قليل الدهون (مثال: أرز + فراخ أو شوفان + موز). بعد التمرين خلال 2-3 ساعات: 25-50جم بروتين + كارب (نافذة الـ30 دقيقة خرافة — المهم الإجمالي اليومي). الكافيين قبل التمرين بـ30-45 دقيقة يحسن الأداء.',
    content_en: 'Pre: carbs+protein 1-2h before. Post: 25-50g protein within 2-3h. The 30-min window is a myth.',
  },
  {
    id: 'gen-veg', category: 'general', medical: false,
    keywords: ['نباتي', 'vegetarian', 'vegan', 'صيامي', 'بدون لحمة', 'plant protein'],
    title_ar: 'البروتين النباتي',
    content_ar: 'اجمع بقول + حبوب في نفس اليوم (عدس+أرز، فول+عيش، حمص+قمح) لبروتين كامل الأحماض. 100جم عدس مطبوخ = 9جم بروتين، حمص = 9جم، فول = 7.5جم. النباتيون يحتاجون B12 مكمل إجبارياً + حديد مع فيتامين C للامتصاص.',
    content_en: 'Combine legumes+grains daily for complete protein. B12 supplement mandatory for vegans.',
  },
  {
    id: 'gen-ramadan', category: 'general', medical: false,
    keywords: ['رمضان', 'ramadan', 'صيام', 'fasting', 'سحور', 'فطار', 'intermittent'],
    title_ar: 'التغذية والتمرين في رمضان',
    content_ar: 'التمرين الأفضل بعد الفطار بـ1-2 ساعة (أو قبل الفطار بساعة خفيف). السحور: بروتين بطيء (بيض/فول/زبادي) + شوفان + ميه كتير. الفطار: ابدأ بتمر + ميه ثم وجبة متوازنة. البروتين اليومي ثابت (1.6-2.2جم/كجم) موزع بين الفطار والسحور. الميه 2.5-3.5 لتر بين الفطار والسحور.',
    content_en: 'Train 1-2h after iftar. Suhoor: slow protein + oats + water. Keep daily protein, 2.5-3.5L water overnight.',
  },
  {
    id: 'gen-bmi-tdee', category: 'general', medical: false,
    keywords: ['سعرات', 'calories', 'tdee', 'bmr', 'احتياج', 'حاسبة', 'سعراتي'],
    title_ar: 'حساب السعرات (BMR/TDEE)',
    content_ar: 'معادلة Mifflin-St Jeor: رجال: 10×الوزن + 6.25×الطول - 5×العمر + 5. سيدات: نفسها - 161 بدل +5. اضرب في النشاط: خامل 1.2، خفيف 1.375، متوسط 1.55، نشط 1.725، شاق 1.9. مثال: رجل 80كجم/178سم/25سنة/متوسط = 1773×1.55 ≈ 2748 سعرة صيانة.',
    content_en: 'Mifflin-St Jeor: men 10W+6.25H-5A+5, women -161. × activity 1.2-1.9.',
  },
];
