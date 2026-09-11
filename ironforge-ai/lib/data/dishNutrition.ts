// Verified per-100g nutrition (USDA-based standard values, prepared as described).
// Values are estimates ±10% — the bot MUST use these and never invent numbers.
export interface DishInfo { kcal: number; p: number; c: number; f: number; }

const D: DishInfo = { kcal: 0, p: 0, c: 0, f: 0 };
function d(kcal: number, p: number, c: number, f: number): DishInfo { return { kcal, p, c, f }; }

// key: distinctive lowercase trigger → per-100g values
export const DISH_DB: Array<{ keys: string[]; label_ar: string; per100: DishInfo }> = [
  // ---- EG Breakfast ----
  { keys: ['ful medames', 'فول مدمس', 'foul'], label_ar: 'فول مدمس', per100: d(120, 7, 16, 3.5) },
  { keys: ['taameya', 'طعمية', 'falafel'], label_ar: 'طعمية مخبوزة', per100: d(200, 10, 18, 9) },
  { keys: ['qouraish', 'قريش', 'cottage cheese'], label_ar: 'جبنة قريش', per100: d(100, 17, 3, 1) },
  { keys: ['shakshuka', 'شكشوكة'], label_ar: 'شكشوكة', per100: d(90, 5, 7, 4.5) },
  { keys: ['honey & tahini', 'honey tahini', 'عسل وطحينة', 'tahini honey'], label_ar: 'عسل وطحينة', per100: d(300, 7, 35, 15) },
  { keys: ['tahini sauce', 'tahini bowl', 'طحينة'], label_ar: 'طحينة', per100: d(595, 17, 21, 48) },
  { keys: ['oats', 'شوفان', 'oatmeal'], label_ar: 'شوفان باللبن', per100: d(95, 3.5, 18, 1.5) },
  { keys: ['yogurt & granola', 'yogurt granola', 'زبادي وجرانولا', 'granola'], label_ar: 'زبادي وجرانولا', per100: d(110, 6, 15, 3) },
  // ---- EG Lunch ----
  { keys: ['koshari', 'كشري', 'kushari'], label_ar: 'كشري', per100: d(140, 5, 26, 2) },
  { keys: ['grilled chicken', 'فراخ مشوية', 'chicken breast', 'صدر فراخ', 'صدر دجاج'], label_ar: 'صدور فراخ مشوية', per100: d(165, 31, 0, 3.6) },
  { keys: ['sayadiyah', 'صيادية', 'sayadiah'], label_ar: 'سمك صيادية', per100: d(135, 14, 16, 2) },
  { keys: ['grilled fish', 'سمك مشوي', 'hammour', 'هامور', 'sea bass', 'قاروص'], label_ar: 'سمك مشوي', per100: d(110, 20, 0, 2.5) },
  { keys: ['moussaka', 'مسقعة'], label_ar: 'مسقعة لايت', per100: d(120, 7, 8, 7) },
  { keys: ['lentil soup', 'شوربة عدس', 'lentil'], label_ar: 'شوربة عدس', per100: d(70, 5, 11, 1) },
  { keys: ['shawarma', 'شاورما'], label_ar: 'شاورما', per100: d(160, 15, 12, 6) },
  { keys: ['stuffed peppers', 'محشي', 'mahshi'], label_ar: 'محشي فلفل', per100: d(130, 6, 18, 4) },
  { keys: ['white rice', 'cooked rice', 'أرز أبيض', 'أرز مطبوخ', 'rice'], label_ar: 'أرز مطبوخ', per100: d(130, 2.7, 28, 0.3) },
  { keys: ['aish', 'عيش بلدي', 'baladi', 'tamees', 'تميس', 'pita', 'bread'], label_ar: 'عيش بلدي', per100: d(265, 9, 55, 2) },
  // ---- EG Dinner ----
  { keys: ['tuna', 'تونة'], label_ar: 'تونة', per100: d(130, 23, 0, 2) },
  { keys: ['kofta', 'كفتة', 'kafta', 'kefta'], label_ar: 'كفتة مشوية', per100: d(220, 16, 4, 16) },
  { keys: ['hawawshi', 'حواوشي'], label_ar: 'حواوشي لايت', per100: d(230, 12, 20, 11) },
  { keys: ['vegetable soup', 'شوربة خضار', 'veg soup'], label_ar: 'شوربة خضار', per100: d(40, 1.5, 8, 0.5) },
  { keys: ['eggs & beans', 'بيض وفول', 'eggs beans'], label_ar: 'بيض وفول', per100: d(120, 8, 12, 4) },
  { keys: ['chicken salad', 'سلطة فراخ', 'سلطة دجاج'], label_ar: 'سلطة فراخ', per100: d(120, 16, 5, 5) },
  { keys: ['tuna salad', 'سلطة تونة'], label_ar: 'سلطة تونة', per100: d(110, 14, 4, 4) },
  // ---- Snacks ----
  { keys: ['zabadi', 'زبادي'], label_ar: 'زبادي', per100: d(90, 6, 10, 3) },
  { keys: ['greek yogurt', 'زبادي يوناني'], label_ar: 'زبادي يوناني', per100: d(100, 10, 4, 2) },
  { keys: ['dates', 'تمر', 'date'], label_ar: 'تمر', per100: d(282, 2.5, 75, 0.4) },
  { keys: ['almonds', 'لوز', 'almond'], label_ar: 'لوز', per100: d(579, 21, 22, 50) },
  { keys: ['peanuts', 'سوداني', 'peanut'], label_ar: 'سوداني', per100: d(567, 26, 16, 49) },
  { keys: ['peanut butter', 'زبدة سوداني', 'زبدة الفول'], label_ar: 'زبدة فول سوداني', per100: d(588, 25, 20, 50) },
  { keys: ['apple', 'تفاح'], label_ar: 'تفاح', per100: d(52, 0.3, 14, 0.2) },
  { keys: ['banana', 'موز'], label_ar: 'موز', per100: d(89, 1.1, 23, 0.3) },
  { keys: ['popcorn', 'فشار'], label_ar: 'فشار لايت', per100: d(350, 11, 65, 10) },
  { keys: ['labneh', 'لبنة'], label_ar: 'لبنة', per100: d(120, 8, 5, 8) },
  { keys: ['laban', 'لبن', 'buttermilk', 'ayran'], label_ar: 'لبن رايب', per100: d(45, 3, 6, 1) },
  { keys: ['milk', 'حليب', 'لبن حليب'], label_ar: 'حليب', per100: d(60, 3.2, 4.8, 3.3) },
  { keys: ['honey', 'عسل'], label_ar: 'عسل', per100: d(304, 0.3, 82, 0) },
  { keys: ['egg', 'بيض'], label_ar: 'بيض (الواحدة 50جم ≈ 78 سعرة)', per100: d(155, 13, 1.1, 11) },
  { keys: ['hummus', 'حمص'], label_ar: 'حمص', per100: d(177, 5, 20, 9) },
  { keys: ['fruit salad', 'سلطة فواكه', 'فاكهة'], label_ar: 'سلطة فواكه', per100: d(55, 0.7, 14, 0.3) },
  // ---- SA ----
  { keys: ['kabsa', 'كبسة'], label_ar: 'كبسة', per100: d(155, 13, 17, 4) },
  { keys: ['mandi', 'مندي'], label_ar: 'مندي', per100: d(160, 14, 17, 4) },
  { keys: ['saleeg', 'سليق'], label_ar: 'سليق', per100: d(140, 9, 18, 3) },
  { keys: ['jarish', 'jareesh', 'جريش'], label_ar: 'جريش', per100: d(110, 6, 20, 1.5) },
  { keys: ['lamb', 'لحم غنم', 'لحم ضأن'], label_ar: 'لحم غنم', per100: d(250, 22, 0, 17) },
  // ---- Pasta & sauces & extras ----
  { keys: ['مكرونة', 'معكرونة', 'باستا', 'pasta', 'spaghetti', 'مكرونه'], label_ar: 'مكرونة مسلوقة', per100: d(131, 5, 25, 1) },
  { keys: ['بشاميل', 'bechamel', 'باشميل'], label_ar: 'بشاميل', per100: d(140, 4, 10, 9) },
  { keys: ['صلصة طماطم', 'tomato sauce', 'صوص أحمر', 'صلصه'], label_ar: 'صلصة طماطم', per100: d(35, 1.5, 7, 0.5) },
  { keys: ['بطاطس مقلية', 'fries', 'بطاطس محمرة', 'شيبس'], label_ar: 'بطاطس مقلية', per100: d(320, 3.5, 36, 17) },
  { keys: ['بطاطس مسلوقة', 'boiled potato', 'بطاطس'], label_ar: 'بطاطس مسلوقة', per100: d(87, 1.9, 20, 0.1) },
  { keys: ['زيت', 'oil'], label_ar: 'زيت (المعلقة 10جم ≈ 88 سعرة)', per100: d(884, 0, 0, 100) },
  { keys: ['زبدة', 'butter', 'سمن'], label_ar: 'زبدة', per100: d(717, 0.9, 0.1, 81) },
  { keys: ['جبنة موزاريلا', 'mozzarella', 'موزاريلا'], label_ar: 'موزاريلا', per100: d(280, 20, 3, 18) },
  { keys: ['عدس مطبوخ', 'cooked lentils', 'عدس'], label_ar: 'عدس مطبوخ', per100: d(116, 9, 20, 0.4) },
  { keys: ['حمص مسلوق', 'cooked chickpeas', 'حمص مسلوق'], label_ar: 'حمص مسلوق', per100: d(164, 9, 27, 2.6) },
  { keys: ['لحم بقري', 'beef', 'لحمة'], label_ar: 'لحم بقري خالي', per100: d(200, 26, 0, 10) },
  { keys: ['سلمون', 'salmon'], label_ar: 'سلمون', per100: d(208, 20, 0, 13) },
  { keys: ['بطاطا حلوة', 'sweet potato', 'بطاطا'], label_ar: 'بطاطا حلوة', per100: d(86, 1.6, 20, 0.1) },
  { keys: ['شوفان جاف', 'dry oats', 'rolled oats'], label_ar: 'شوفان جاف', per100: d(389, 17, 66, 7) },
  { keys: ['فول سوداني محمص', 'roasted peanuts'], label_ar: 'فول سوداني', per100: d(567, 26, 16, 49) },
];

function norm(s: string): string {
  return s.toLowerCase().replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي');
}

// Find verified items mentioned in the user message (max 6)
export function findDishData(message: string): Array<{ label_ar: string; per100: (typeof D) }> {
  const q = norm(message);
  const out: Array<{ label_ar: string; per100: (typeof D) }> = [];
  for (const item of DISH_DB) {
    if (out.length >= 6) break;
    if (item.keys.some(k => q.includes(norm(k)))) out.push({ label_ar: item.label_ar, per100: item.per100 });
  }
  return out;
}

export function buildDishContext(message: string, locale: string): string {
  const hits = findDishData(message);
  if (!hits.length) return '';
  const ar = locale === 'ar';
  let ctx = ar
    ? '\n\n=== قيم معتمدة لكل 100جم (USDA — استخدمها حرفياً واحسب منها الجرامات، لا تخترع أرقاماً) ===\n'
    : '\n\n=== Verified per-100g values (USDA — use literally to compute grams, never invent) ===\n';
  for (const h of hits) {
    ctx += `- ${h.label_ar}: ${h.per100.kcal}kcal | P${h.per100.p}g C${h.per100.c}g F${h.per100.f}g /100g\n`;
  }
  ctx += ar
    ? 'القاعدة: الجرامات = (المطلوب من الماكرو ÷ قيمة الـ100جم) × 100. اذكر أن القيم تقريبية ±10%.\n'
    : 'Rule: grams = (needed macro ÷ per-100g value) × 100. State values are ±10% estimates.\n';
  return ctx;
}
