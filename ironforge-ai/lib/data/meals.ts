import { Meal } from '@/lib/types';

export const meals: Meal[] = [
  // ============ BREAKFAST ============
  {
    id: 'protein-pancakes',
    name_en: 'Protein Pancakes',
    name_ar: 'فطائر البروتين',
    category_en: 'Breakfast',
    category_ar: 'فطور',
    calories: 380,
    protein: 32,
    carbs: 45,
    fats: 9,
    ingredients_en: [
      '2 scoops vanilla whey protein',
      '1/2 cup rolled oats (blended)',
      '2 egg whites',
      '1 whole egg',
      '1/2 banana',
      '1 tsp baking powder',
      'Cinnamon to taste'
    ],
    ingredients_ar: [
      '2 ملعقة بروتين مصل اللبن بالفانيليا',
      '1/2 كوب شوفان كامل (مطحون)',
      '2 بياض بيض',
      '1 بيضة كاملة',
      '1/2 موزة',
      '1 ملعقة صغيرة بيكنج بودر',
      'قرفة حسب الرغبة'
    ],
    instructions_en: [
      'Blend all ingredients until smooth',
      'Heat non-stick pan over medium heat',
      'Pour batter and cook until bubbles form',
      'Flip and cook other side',
      'Top with berries or Greek yogurt'
    ],
    instructions_ar: [
      'اخلط جميع المكونات حتى تنعيم',
      'سخّن مقلاة غير لاصقة على نار متوسطة',
      'صبّ الخليط واطبخ حتى تتشكل الفقاعات',
      'اقلب واطبخ الجانب الآخر',
      'زين بالberries أو الزبادي اليوناني'
    ],
    tags_en: ['High Protein', 'Breakfast', 'Quick'],
    tags_ar: ['بروتين عالي', 'فطور', 'سريع']
  },
  {
    id: 'egg-white-omelette',
    name_en: 'Egg White Omelette with Veggies',
    name_ar: 'عجة بياض البيض بالخضروات',
    category_en: 'Breakfast',
    category_ar: 'فطور',
    calories: 280,
    protein: 35,
    carbs: 12,
    fats: 10,
    ingredients_en: [
      '6 egg whites',
      '1 whole egg',
      '1/2 cup spinach',
      '1/2 cup mushrooms, sliced',
      '1/4 cup bell pepper, diced',
      '1/4 cup onion, diced',
      '1 tbsp olive oil',
      'Salt & pepper to taste'
    ],
    ingredients_ar: [
      '6 بياض بيض',
      '1 بيضة كاملة',
      '1/2 كوب سبانخ',
      '1/2 كوب فطر مقطع',
      '1/4 كوب فلفل مقطع',
      '1/4 كوب بصل مقطع',
      '1 ملعقة كبيرة زيت زيتون',
      'ملح وفلفل حسب الرغبة'
    ],
    instructions_en: [
      'Whisk egg whites and whole egg together',
      'Heat olive oil in pan',
      'Sauté vegetables until tender',
      'Pour egg mixture over veggies',
      'Cook until set, fold in half, serve'
    ],
    instructions_ar: [
      'اخفق بياض البيض والبيضة الكاملة معاً',
      'سخّن زيت الزيتون في المقلاة',
      'اقلي الخضروات حتى تنضج',
      'صبّ خليط البيض على الخضروات',
      'اطبخ حتى يتماسك، لف في المنتصف، قدم'
    ],
    tags_en: ['High Protein', 'Low Carb', 'Vegetables'],
    tags_ar: ['بروتين عالي', 'كربوهيدرات منخفضة', 'خضروات']
  },
  {
    id: 'oatmeal-protein',
    name_en: 'High Protein Oatmeal',
    name_ar: 'شوفان البروتين العالي',
    category_en: 'Breakfast',
    category_ar: 'فطور',
    calories: 420,
    protein: 30,
    carbs: 55,
    fats: 10,
    ingredients_en: [
      '1/2 cup rolled oats',
      '1 scoop vanilla protein powder',
      '1 cup almond milk',
      '1 tbsp peanut butter',
      '1 tbsp chia seeds',
      '1 tbsp honey',
      'Mixed berries for topping'
    ],
    ingredients_ar: [
      '1/2 كوب شوفان كامل',
      '1 ملعقة بودرة بروتين فانيليا',
      '1 كوب حليب اللوز',
      '1 ملعقة كبيرة زبدة فول سوداني',
      '1 ملعقة كبيرة بذور الشيا',
      '1 ملعقة كبيرة عسل',
      'berries متنوعة للتزيين'
    ],
    instructions_en: [
      'Cook oats in almond milk until creamy',
      'Remove from heat, stir in protein powder',
      'Add peanut butter, chia seeds, and honey',
      'Mix well',
      'Top with berries and serve'
    ],
    instructions_ar: [
      'اطبخ الشوفان في حليب اللوز حتى يصبح كريمياً',
      'أزل عن النار، اخلط بودرة البروتين',
      'أضف زبدة الفول السوداني وبذور الشيا والعسل',
      'اخلط جيداً',
      'زين بالberries وقدم'
    ],
    tags_en: ['High Fiber', 'Energy', 'Breakfast'],
    tags_ar: ['ألياف عالية', 'طاقة', 'فطور']
  },
  {
    id: 'greek-yogurt-bowl',
    name_en: 'Greek Yogurt Protein Bowl',
    name_ar: 'وعاء الزبادي اليوناني بالبروتين',
    category_en: 'Breakfast',
    category_ar: 'فطور',
    calories: 350,
    protein: 35,
    carbs: 35,
    fats: 8,
    ingredients_en: [
      '2 cups non-fat Greek yogurt',
      '1 scoop vanilla protein powder',
      '1/4 cup granola (low sugar)',
      '1/2 cup mixed berries',
      '1 tbsp honey',
      '1 tbsp almonds, sliced'
    ],
    ingredients_ar: [
      '2 كوب زبادي يوناني خالٍ من الدسم',
      '1 ملعقة بودرة بروتين فانيليا',
      '1/4 كوب جرانولا (سكر منخفض)',
      '1/2 كوب berries متنوعة',
      '1 ملعقة كبيرة عسل',
      '1 ملعقة كبيرة لوز مقطع'
    ],
    instructions_en: [
      'Mix Greek yogurt with protein powder until smooth',
      'Transfer to a bowl',
      'Top with granola, berries, and almonds',
      'Drizzle with honey',
      'Serve immediately'
    ],
    instructions_ar: [
      'اخلط الزبادي اليوناني مع بودرة البروتين حتى تنعيم',
      'انقل إلى وعاء',
      'زين بالجرانولا والberries واللوز',
      'رشّ بالعسل',
      'قدم فوراً'
    ],
    tags_en: ['High Protein', 'Probiotics', 'Quick'],
    tags_ar: ['بروتين عالي', 'بروبيوتيك', 'سريع']
  },
  {
    id: 'avocado-toast-egg',
    name_en: 'Avocado Toast with Eggs',
    name_ar: 'نخيل الأفوكادو بالبيض',
    category_en: 'Breakfast',
    category_ar: 'فطور',
    calories: 420,
    protein: 25,
    carbs: 35,
    fats: 22,
    ingredients_en: [
      '2 slices whole wheat bread',
      '1 ripe avocado',
      '2 eggs (poached or scrambled)',
      '1 tbsp lemon juice',
      'Chili flakes',
      'Salt & pepper'
    ],
    ingredients_ar: [
      '2 شرائح خبز قمح كامل',
      '1 أفوكادو ناضج',
      '2 بيضة (مسلوقة أو مقلية)',
      '1 ملعقة كبيرة عصير ليمون',
      'رقائق فلفل حار',
      'ملح وفلفل'
    ],
    instructions_en: [
      'Toast the bread slices',
      'Mash avocado with lemon juice, salt and pepper',
      'Spread avocado on toast',
      'Top with eggs',
      'Sprinkle with chili flakes, serve'
    ],
    instructions_ar: [
      'حمّص شرائح الخبز',
      'اهرس الأفوكادو مع عصير الليمون والملح والفلفل',
      'افرد الأفوكادو على الخبز المحمص',
      'ضع البيض فوقه',
      'رشّ بفلفل حار، قدم'
    ],
    tags_en: ['Healthy Fats', 'Fiber', 'Quick'],
    tags_ar: ['دهون صحية', 'ألياف', 'سريع']
  },
  {
    id: 'breakfast-burrito',
    name_en: 'High Protein Breakfast Burrito',
    name_ar: 'بريتو فطور عالي البروتين',
    category_en: 'Breakfast',
    category_ar: 'فطور',
    calories: 520,
    protein: 38,
    carbs: 48,
    fats: 20,
    ingredients_en: [
      '1 large whole wheat tortilla',
      '4 egg whites + 1 whole egg (scrambled)',
      '1/2 cup black beans, cooked',
      '1/4 cup salsa',
      '1/4 avocado, sliced',
      '2 tbsp low-fat cheese, shredded'
    ],
    ingredients_ar: [
      '1 تورتيلا قمح كاملة كبيرة',
      '4 بياض بيض + 1 بيضة كاملة (مقلية)',
      '1/2 كوب فاصوليا سوداء مطبوخة',
      '1/4 كوب سالسا',
      '1/4 أفوكادو مقطع',
      '2 ملعقة كبيرة جبن قليل الدسم مبشور'
    ],
    instructions_en: [
      'Warm tortilla in microwave or pan',
      'Layer beans, eggs, cheese down the middle',
      'Add salsa and avocado',
      'Roll up tightly',
      'Slice in half, serve'
    ],
    instructions_ar: [
      'سخّن التورتيلا في الميكروويف أو المقلاة',
      'ضع طبقات الفاصوليا والبيض والجبن في المنتصف',
      'أضف السالسا والأفوكادو',
      'لف بإحكام',
      'قسّم إلى نصفين، قدم'
    ],
    tags_en: ['High Protein', 'Meal Prep', 'Fiber'],
    tags_ar: ['بروتين عالي', 'تحضير الوجبات', 'ألياف']
  },
  {
    id: 'chia-pudding',
    name_en: 'Chia Seed Pudding',
    name_ar: 'بودينغ بذور الشيا',
    category_en: 'Breakfast',
    category_ar: 'فطور',
    calories: 320,
    protein: 15,
    carbs: 40,
    fats: 12,
    ingredients_en: [
      '3 tbsp chia seeds',
      '1 cup almond milk',
      '1 scoop vanilla protein powder',
      '1 tbsp maple syrup',
      '1/2 tsp vanilla extract',
      'Fresh fruit for topping'
    ],
    ingredients_ar: [
      '3 ملاعق كبيرة بذور الشيا',
      '1 كوب حليب اللوز',
      '1 ملعقة بودرة بروتين فانيليا',
      '1 ملعقة كبيرة شراب القيقب',
      '1/2 ملعقة صغيرة مستخلص فانيليا',
      'فواكه طازجة للتزيين'
    ],
    instructions_en: [
      'Mix chia seeds, almond milk, protein powder, maple syrup, and vanilla in a jar',
      'Stir well and refrigerate overnight',
      'In the morning, stir again',
      'Top with fresh fruit',
      'Serve cold'
    ],
    instructions_ar: [
      'اخلط بذور الشيا وحليب اللوز وبودرة البروتين وشراب القيقب والفانيليا في مرطبان',
      'حرك جيداً و refrigerate طوال الليل',
      'في الصباح، حرك مرة أخرى',
      'زين بالفواكه الطازجة',
      'قدم بارداً'
    ],
    tags_en: ['Omega-3', 'Meal Prep', 'Vegan Friendly'],
    tags_ar: ['أوميغا 3', 'تحضير الوجبات', 'مناسب للنباتيين']
  },
  {
    id: 'tuna-melt-breakfast',
    name_en: 'Tuna Melt on English Muffin',
    name_ar: 'تونة مالت على مفن إنجليزي',
    category_en: 'Breakfast',
    category_ar: 'فطور',
    calories: 380,
    protein: 38,
    carbs: 28,
    fats: 14,
    ingredients_en: [
      '1 whole wheat English muffin, split',
      '1 can (170g) tuna in water, drained',
      '1 tbsp Greek yogurt',
      '1 tsp Dijon mustard',
      '1/4 cup low-fat cheese, shredded',
      'Pickles (optional)'
    ],
    ingredients_ar: [
      '1 مفن إنجليزي قمح كامل، مقسوم',
      '1 علبة (170جم) تونة في ماء، مصفاة',
      '1 ملعقة كبيرة زبادي يوناني',
      '1 ملعقة صغيرة خردل ديجون',
      '1/4 كوب جبن قليل الدسم مبشور',
      'مخللات (اختياري)'
    ],
    instructions_en: [
      'Toast English muffin',
      'Mix tuna with Greek yogurt and mustard',
      'Spread tuna mixture on muffin halves',
      'Top with cheese',
      'Broil until cheese melts, serve'
    ],
    instructions_ar: [
      'حمّص المفن الإنجليزي',
      'اخلط التونة مع الزبادي اليوناني والخردل',
      'افرد خليط التونة على نصفي المفن',
      'ضع الجبن فوقه',
      'اشوّه حتى يذوب الجبن، قدم'
    ],
    tags_en: ['High Protein', 'Omega-3', 'Quick'],
    tags_ar: ['بروتين عالي', 'أوميغا 3', 'سريع']
  },

  // ============ LUNCH ============
  {
    id: 'grilled-chicken-salad',
    name_en: 'Grilled Chicken Breast Salad',
    name_ar: 'سلطة صدور الدجاج المشوية',
    category_en: 'Lunch',
    category_ar: 'غداء',
    calories: 450,
    protein: 48,
    carbs: 22,
    fats: 18,
    ingredients_en: [
      '200g grilled chicken breast',
      '2 cups mixed greens',
      '1/2 cup cherry tomatoes',
      '1/2 cucumber, diced',
      '1/4 avocado, sliced',
      '1/4 cup quinoa, cooked',
      '2 tbsp olive oil & lemon dressing'
    ],
    ingredients_ar: [
      '200جم صدور دجاج مشوية',
      '2 كوب خضروات ورقية متنوعة',
      '1/2 كوب طماطم كرزية',
      '1/2 خيار مقطع',
      '1/4 أفوكادو مقطع',
      '1/4 كوب كينوا مطبوخة',
      '2 ملعقة كبيرة تتبيلة زيت زيتون وليمون'
    ],
    instructions_en: [
      'Slice grilled chicken breast',
      'Arrange mixed greens in a bowl',
      'Add tomatoes, cucumber, avocado, and quinoa',
      'Top with chicken slices',
      'Drizzle with dressing, toss and serve'
    ],
    instructions_ar: [
      'قطّع صدور الدجاج المشوية',
      'رصّ الخضروات الورقية في وعاء',
      'أضف الطماطم والخيار والأفوكادو والكينوا',
      'ضع شرائح الدجاج فوقها',
      'رشّ بالتتبيلة، قلب وقدم'
    ],
    tags_en: ['High Protein', 'Low Carb', 'Healthy Fats'],
    tags_ar: ['بروتين عالي', 'كربوهيدرات منخفضة', 'دهون صحية']
  },
  {
    id: 'turkey-meal-prep',
    name_en: 'Turkey, Rice & Veggies',
    name_ar: 'ديك رومي وأرز وخضروات',
    category_en: 'Lunch',
    category_ar: 'غداء',
    calories: 520,
    protein: 42,
    carbs: 55,
    fats: 12,
    ingredients_en: [
      '180g ground turkey (lean)',
      '1 cup brown rice, cooked',
      '1 cup broccoli florets',
      '1/2 cup carrots, sliced',
      '1 tbsp soy sauce (low sodium)',
      '1 tsp olive oil',
      'Garlic and ginger to taste'
    ],
    ingredients_ar: [
      '180جم لحم ديك رومي مفروم (خالي من الدهن)',
      '1 كوب أرز بني مطبوخ',
      '1 كوب زهور بروكلي',
      '1/2 كوب جزر مقطع',
      '1 ملعقة كبيرة صويا صوص (ملح منخفض)',
      '1 ملعقة صغيرة زيت زيتون',
      'ثوم وزنجبيل حسب الرغبة'
    ],
    instructions_en: [
      'Heat olive oil, sauté garlic and ginger',
      'Brown ground turkey, season with salt and pepper',
      'Add soy sauce, cook through',
      'Steam broccoli and carrots',
      'Assemble with brown rice, serve'
    ],
    instructions_ar: [
      'سخّن زيت الزيتون، اقلي الثوم والزنجبيل',
      'حمّص لحم الديك الرومي المفروم، بلّل بالملح والفلفل',
      'أضف صويا صوص، اطبخ تماماً',
      'بخّر البروكلي والجزر',
      'جمّع مع الأرز البني، قدم'
    ],
    tags_en: ['Meal Prep', 'High Protein', 'Balanced'],
    tags_ar: ['تحضير الوجبات', 'بروتين عالي', 'متوازن']
  },
  {
    id: 'salmon-quinoa-bowl',
    name_en: 'Salmon Quinoa Power Bowl',
    name_ar: 'وعاء السلمون والكينوا القوي',
    category_en: 'Lunch',
    category_ar: 'غداء',
    calories: 580,
    protein: 42,
    carbs: 48,
    fats: 24,
    ingredients_en: [
      '200g baked salmon fillet',
      '3/4 cup quinoa, cooked',
      '1 cup roasted sweet potato cubes',
      '2 cups baby spinach',
      '1/4 cup edamame',
      '2 tbsp tahini dressing'
    ],
    ingredients_ar: [
      '200جم فيليه سلمون مخبوز',
      '3/4 كوب كينوا مطبوخة',
      '1 كوب مكعبات بطاطا حلوة محمّرة',
      '2 كوب سبانخ صغيرة',
      '1/4 كوب إيدامامي',
      '2 ملعقة كبيرة تتبيلة الطحينة'
    ],
    instructions_en: [
      'Season salmon with salt, pepper, lemon',
      'Bake at 200°C for 12-15 minutes',
      'Roast sweet potato cubes',
      'Assemble bowl with quinoa, spinach, sweet potato, edamame',
      'Top with salmon, drizzle tahini dressing'
    ],
    instructions_ar: [
      'بلّل السلمون بالملح والفلفل والليمون',
      'اخبز عند 200م لمدة 12-15 دقيقة',
      'حمّر مكعبات البطاطا الحلوة',
      'جمّع الوعاء بالكينوا والسبانخ والبطاطا الحلوة والإيدامامي',
      'ضع السلمون فوقه، رشّ بتتبيلة الطحينة'
    ],
    tags_en: ['Omega-3', 'High Protein', 'Complex Carbs'],
    tags_ar: ['أوميغا 3', 'بروتين عالي', 'كربوهيدرات معقدة']
  },
  {
    id: 'beef-stir-fry',
    name_en: 'Beef & Veggie Stir Fry',
    name_ar: 'لحم بقري وخضروات مقلية سريعاً',
    category_en: 'Lunch',
    category_ar: 'غداء',
    calories: 550,
    protein: 45,
    carbs: 40,
    fats: 22,
    ingredients_en: [
      '200g lean sirloin steak, sliced',
      '1 cup mixed vegetables (bell pepper, snap peas, carrots)',
      '1 cup brown rice, cooked',
      '2 tbsp low-sodium soy sauce',
      '1 tbsp sesame oil',
      '2 garlic cloves, minced',
      '1 tsp ginger, grated'
    ],
    ingredients_ar: [
      '200جم شريحة لحم سيرلوين خالية من الدهن',
      '1 كوب خضروات متنوعة (فلفل، بازلاء، جزر)',
      '1 كوب أرز بني مطبوخ',
      '2 ملعقة كبيرة صويا صوص قليلة الملح',
      '1 ملعقة كبيرة زيت سمسم',
      '2 فصوص ثوم مهروسة',
      '1 ملعقة صغيرة زنجبيل مبشور'
    ],
    instructions_en: [
      'Heat sesame oil in wok or large pan',
      'Sauté garlic and ginger for 30 seconds',
      'Add beef, cook until browned (2-3 min)',
      'Add vegetables, stir-fry 3-4 minutes',
      'Add soy sauce, serve over brown rice'
    ],
    instructions_ar: [
      'سخّن زيت السمسم في مقلاة واسعة',
      'اقلي الثوم والزنجبيل لمدة 30 ثانية',
      'أضف اللحم، اطبخ حتى يتحمر (2-3 دقائق)',
      'أضف الخضروات، قلّب لمدة 3-4 دقائق',
      'أضف صويا صوص، قدم فوق الأرز البني'
    ],
    tags_en: ['High Protein', 'Iron', 'Quick'],
    tags_ar: ['بروتين عالي', 'حديد', 'سريع']
  },
  {
    id: 'chickpea-salad-wrap',
    name_en: 'Chickpea Salad Wrap',
    name_ar: 'لفافة سلطة الحمص',
    category_en: 'Lunch',
    category_ar: 'غداء',
    calories: 440,
    protein: 22,
    carbs: 55,
    fats: 16,
    ingredients_en: [
      '1 large whole wheat tortilla',
      '1 cup chickpeas, rinsed and mashed',
      '1/4 cup celery, diced',
      '1/4 cup red onion, diced',
      '2 tbsp Greek yogurt',
      '1 tbsp lemon juice',
      '2 cups mixed greens'
    ],
    ingredients_ar: [
      '1 تورتيلا قمح كاملة كبيرة',
      '1 كوب حمص مغسول ومهروس',
      '1/4 كوب كرفس مقطع',
      '1/4 كوب بصل أحمر مقطع',
      '2 ملعقة كبيرة زبادي يوناني',
      '1 ملعقة كبيرة عصير ليمون',
      '2 كوب خضروات ورقية متنوعة'
    ],
    instructions_en: [
      'Mash chickpeas with fork, leave some texture',
      'Mix with celery, red onion, Greek yogurt, lemon juice',
      'Season with salt and pepper',
      'Spread on tortilla, add mixed greens',
      'Roll tightly, slice diagonally'
    ],
    instructions_ar: [
      'اهرس الحمص بالشوكة، اترك بعض الملمس',
      'اخلط مع الكرفس والبصل الأحمر والزبادي اليوناني وعصير الليمون',
      'بلّل بالملح والفلفل',
      'افرد على التورتيلا، أضف الخضروات الورقية',
      'لف بإحكام، قطّع قطرياً'
    ],
    tags_en: ['Vegetarian', 'High Fiber', 'Plant Protein'],
    tags_ar: ['نباتي', 'ألياف عالية', 'بروتين نباتي']
  },
  {
    id: 'shrimp-brown-rice',
    name_en: 'Garlic Shrimp with Brown Rice',
    name_ar: 'جمبري ثوم بالأرز البني',
    category_en: 'Lunch',
    category_ar: 'غداء',
    calories: 480,
    protein: 40,
    carbs: 52,
    fats: 14,
    ingredients_en: [
      '200g shrimp, peeled and deveined',
      '1 cup brown rice, cooked',
      '4 garlic cloves, minced',
      '1 tbsp olive oil',
      '1 tbsp butter',
      '1/4 cup parsley, chopped',
      'Lemon wedges'
    ],
    ingredients_ar: [
      '200جم جمبري مقشر ومنظف',
      '1 كوب أرز بني مطبوخ',
      '4 فصوص ثوم مهروسة',
      '1 ملعقة كبيرة زيت زيتون',
      '1 ملعقة كبيرة زبدة',
      '1/4 كوب بقدونس مفروم',
      'أرباع ليمون'
    ],
    instructions_en: [
      'Heat olive oil and butter in pan',
      'Sauté garlic until fragrant (30 sec)',
      'Add shrimp, cook 2 minutes per side until pink',
      'Stir in parsley and lemon juice',
      'Serve over brown rice with lemon wedges'
    ],
    instructions_ar: [
      'سخّن زيت الزيتون والزبدة في المقلاة',
      'اقلي الثوم حتى تظهر رائحته (30 ثانية)',
      'أضف الجمبري، اطبخ دقيقتين لكل جانب حتى يصبح وردياً',
      'قلّب مع البقدونس وعصير الليمون',
      'قدم فوق الأرز البني مع أرباع الليمون'
    ],
    tags_en: ['High Protein', 'Low Fat', 'Quick'],
    tags_ar: ['بروتين عالي', 'قليل الدسم', 'سريع']
  },
  {
    id: 'tuna-salad-sandwich',
    name_en: 'Healthy Tuna Salad Sandwich',
    name_ar: 'ساندويتش سلطة تونة صحي',
    category_en: 'Lunch',
    category_ar: 'غداء',
    calories: 420,
    protein: 38,
    carbs: 38,
    fats: 14,
    ingredients_en: [
      '2 slices whole wheat bread',
      '1 can (170g) tuna in water, drained',
      '2 tbsp Greek yogurt',
      '1 tbsp celery, finely diced',
      '1 tsp Dijon mustard',
      'Lettuce and tomato slices'
    ],
    ingredients_ar: [
      '2 شرائح خبز قمح كامل',
      '1 علبة (170جم) تونة في ماء، مصفاة',
      '2 ملعقة كبيرة زبادي يوناني',
      '1 ملعقة كبيرة كرفس مقطع ناعم',
      '1 ملعقة صغيرة خردل ديجون',
      'خس وشرائح طماطم'
    ],
    instructions_en: [
      'Mash tuna with Greek yogurt and mustard',
      'Stir in celery',
      'Season with salt and pepper',
      'Spread on bread, add lettuce and tomato',
      'Top with second slice, cut diagonally'
    ],
    instructions_ar: [
      'اهرس التونة مع الزبادي اليوناني والخردل',
      'قلّب مع الكرفس',
      'بلّل بالملح والفلفل',
      'افرد على الخبز، أضف الخس والطماطم',
      'ضع الشريحة الثانية، قطّع قطرياً'
    ],
    tags_en: ['High Protein', 'Quick', 'Lunch'],
    tags_ar: ['بروتين عالي', 'سريع', 'غداء']
  },
  {
    id: 'mediterranean-chicken',
    name_en: 'Mediterranean Chicken Bowl',
    name_ar: 'وعاء الدجاج المتوسطي',
    category_en: 'Lunch',
    category_ar: 'غداء',
    calories: 520,
    protein: 42,
    carbs: 48,
    fats: 18,
    ingredients_en: [
      '200g grilled chicken breast, sliced',
      '1 cup couscous, cooked',
      '1/2 cup cucumber, diced',
      '1/2 cup cherry tomatoes, halved',
      '1/4 cup olives',
      '1/4 cup feta cheese, crumbled',
      '2 tbsp tzatziki sauce'
    ],
    ingredients_ar: [
      '200جم صدور دجاج مشوية، مقطعة',
      '1 كوب كوسكوس مطبوخ',
      '1/2 كوب خيار مقطع',
      '1/2 كوب طماطم كرزية منقومة',
      '1/4 كوب زيتون',
      '1/4 كوب جبن فيتا مهروس',
      '2 ملعقة كبيرة صلصة التاتزكي'
    ],
    instructions_en: [
      'Season chicken with Mediterranean spices, grill',
      'Prepare couscous according to package',
      'Assemble bowl with couscous, chicken',
      'Top with cucumbers, tomatoes, olives, feta',
      'Drizzle with tzatziki sauce'
    ],
    instructions_ar: [
      'بلّل الدجاج بالبهارات المتوسطية، اشوي',
      'جهّز الكوسكوس حسب التعليمات',
      'جمّع الوعاء بالكوسكوس والدجاج',
      'ضع الخيار والطماطم والزيتون والفيتا فوقه',
      'رشّ بصلصة التاتزكي'
    ],
    tags_en: ['High Protein', 'Mediterranean', 'Flavorful'],
    tags_ar: ['بروتين عالي', 'متوسطي', 'لذيذ']
  },

  // ============ DINNER ============
  {
    id: 'baked-chicken-thighs',
    name_en: 'Baked Chicken Thighs with Veggies',
    name_ar: 'فخاخ دجاج مخبوزة بالخضروات',
    category_en: 'Dinner',
    category_ar: 'عشاء',
    calories: 560,
    protein: 45,
    carbs: 42,
    fats: 24,
    ingredients_en: [
      '220g boneless chicken thighs',
      '1 cup roasted Brussels sprouts',
      '1 medium sweet potato, roasted',
      '1 tbsp olive oil',
      'Rosemary, thyme, garlic powder',
      'Salt & pepper to taste'
    ],
    ingredients_ar: [
      '220جم فخاخ دجاج منزوعة العظام',
      '1 كوب بروكسل براسيل محمّر',
      '1 بطاطا حلوة متوسطة محمّرة',
      '1 ملعقة كبيرة زيت زيتون',
      'إكليل الجبل، زعتر، بودرة ثوم',
      'ملح وفلفل حسب الرغبة'
    ],
    instructions_en: [
      'Preheat oven to 200°C',
      'Season chicken thighs with herbs and spices',
      'Toss Brussels sprouts and sweet potato with olive oil',
      'Arrange on baking sheet, chicken on top',
      'Bake 30-35 minutes until chicken cooked through'
    ],
    instructions_ar: [
      'سخّن الفرن إلى 200م',
      'بلّل فخاخ الدجاج بالأعشاب والبهارات',
      'قلّب بروكسل براسيل والبطاطا الحلوة مع زيت الزيتون',
      'رصّ على صينية، الدجاج فوقها',
      'اخبز 30-35 دقيقة حتى ينضج الدجاج تماماً'
    ],
    tags_en: ['High Protein', 'One Pan', 'Meal Prep'],
    tags_ar: ['بروتين عالي', 'صينية واحدة', 'تحضير الوجبات']
  },
  {
    id: 'cod-vegetables',
    name_en: 'Baked Cod with Roasted Vegetables',
    name_ar: 'قد مخبوز بالخضروات المحمّرة',
    category_en: 'Dinner',
    category_ar: 'عشاء',
    calories: 420,
    protein: 42,
    carbs: 35,
    fats: 15,
    ingredients_en: [
      '200g cod fillet',
      '1 cup mixed roasted veggies (zucchini, eggplant, peppers)',
      '1/2 cup wild rice, cooked',
      '2 tbsp olive oil',
      'Lemon zest and juice',
      'Dill, salt & pepper'
    ],
    ingredients_ar: [
      '200جم فيليه قد',
      '1 كوب خضروات محمّرة متنوعة (كوسا، باذنجان، فلفل)',
      '1/2 كوب أرز بري مطبوخ',
      '2 ملعقة كبيرة زيت زيتون',
      'قشر و عصير ليمون',
      'شبت، ملح وفلفل'
    ],
    instructions_en: [
      'Preheat oven to 200°C',
      'Toss vegetables with olive oil, roast 20 minutes',
      'Season cod with lemon zest, dill, salt, pepper',
      'Place cod on top of vegetables, bake 10-12 minutes',
      'Serve over wild rice, squeeze fresh lemon'
    ],
    instructions_ar: [
      'سخّن الفرن إلى 200م',
      'قلّب الخضروات مع زيت الزيتون، حمّر 20 دقيقة',
      'بلّل القد بقشر الليمون والشبت والملح والفلفل',
      'ضع القد فوق الخضروات، اخبز 10-12 دقيقة',
      'قدم فوق الأرز البري، اعصر ليمون طازج'
    ],
    tags_en: ['High Protein', 'Lean', 'Omega-3'],
    tags_ar: ['بروتين عالي', 'خفيف', 'أوميغا 3']
  },
  {
    id: 'lean-beef-chili',
    name_en: 'Lean Beef Chili with Beans',
    name_ar: 'شيله لحم بقري خالي من الدهن بالفاصوليا',
    category_en: 'Dinner',
    category_ar: 'عشاء',
    calories: 550,
    protein: 45,
    carbs: 50,
    fats: 18,
    ingredients_en: [
      '200g lean ground beef',
      '1/2 cup kidney beans',
      '1/2 cup black beans',
      '1 cup diced tomatoes',
      '1/2 cup onion, diced',
      '2 garlic cloves',
      'Chili powder, cumin, paprika',
      '1 tbsp olive oil'
    ],
    ingredients_ar: [
      '200جم لحم بقري مفروم خالي من الدهن',
      '1/2 كوب فاصوليا حمراء',
      '1/2 كوب فاصوليا سوداء',
      '1 كوب طماطم مقطعة',
      '1/2 كوب بصل مقطع',
      '2 فصوص ثوم',
      'بودرة شيلي، كمون، بابريكا',
      '1 ملعقة كبيرة زيت زيتون'
    ],
    instructions_en: [
      'Heat olive oil, sauté onion and garlic',
      'Brown ground beef, drain excess fat',
      'Add spices, cook 1 minute',
      'Add tomatoes, beans, 1/2 cup water',
      'Simmer 25-30 minutes, adjust seasoning'
    ],
    instructions_ar: [
      'سخّن زيت الزيتون، اقلي البصل والثوم',
      'حمّص اللحم المفروم، صفّي الدهن الزائد',
      'أضف البهارات، اطبخ دقيقة واحدة',
      'أضف الطماطم والفاصوليا و1/2 كوب ماء',
      'اطبخ على نار هادئة 25-30 دقيقة، اضبط التتبيلة'
    ],
    tags_en: ['High Protein', 'High Fiber', 'Iron'],
    tags_ar: ['بروتين عالي', 'ألياف عالية', 'حديد']
  },
  {
    id: 'stuffed-bell-peppers',
    name_en: 'Turkey Stuffed Bell Peppers',
    name_ar: 'فلفل محشي بالديك الرومي',
    category_en: 'Dinner',
    category_ar: 'عشاء',
    calories: 440,
    protein: 38,
    carbs: 40,
    fats: 14,
    ingredients_en: [
      '2 medium bell peppers, halved, seeded',
      '180g ground turkey',
      '1/2 cup brown rice, cooked',
      '1/2 cup tomato sauce',
      '1/4 cup onion, diced',
      '2 garlic cloves, minced',
      '1/4 cup low-fat cheese, shredded'
    ],
    ingredients_ar: [
      '2 فلفل متوسطة منقوصة، منزوعة البذور',
      '180جم لحم ديك رومي مفروم',
      '1/2 كوب أرز بني مطبوخ',
      '1/2 كوب صلصة طماطم',
      '1/4 كوب بصل مقطع',
      '2 فصوص ثوم مهروسة',
      '1/4 كوب جبن قليل الدسم مبشور'
    ],
    instructions_en: [
      'Preheat oven to 190°C',
      'Sauté onion and garlic, add turkey, brown',
      'Mix with cooked rice and tomato sauce',
      'Stuff peppers with mixture, top with cheese',
      'Bake 30-35 minutes until peppers tender'
    ],
    instructions_ar: [
      'سخّن الفرن إلى 190م',
      'اقلي البصل والثوم، أضف الديك الرومي، حمّر',
      'اخلط مع الأرز المطبوخ وصلصة الطماطم',
      'احشي الفلفل بالخليط، ضع الجبن فوقه',
      'اخبز 30-35 دقيقة حتى ينضج الفلفل'
    ],
    tags_en: ['High Protein', 'Vegetables', 'Low Glycemic'],
    tags_ar: ['بروتين عالي', 'خضروات', 'نسبة جلايسيمية منخفضة']
  },
  {
    id: 'teriyaki-tofu-bowl',
    name_en: 'Teriyaki Tofu Rice Bowl',
    name_ar: 'وعاء الأرز بالتوfu التريياكي',
    category_en: 'Dinner',
    category_ar: 'عشاء',
    calories: 480,
    protein: 28,
    carbs: 65,
    fats: 14,
    ingredients_en: [
      '200g firm tofu, pressed and cubed',
      '1 cup brown rice, cooked',
      '1 cup mixed stir-fry vegetables',
      '3 tbsp low-sodium teriyaki sauce',
      '1 tbsp sesame oil',
      '1 tbsp sesame seeds',
      'Scallions for garnish'
    ],
    ingredients_ar: [
      '200جم توfu صلب مضغوط ومكعب',
      '1 كوب أرز بني مطبوخ',
      '1 كوب خضروات مقلية متنوعة',
      '3 ملاعق كبيرة صلصة تريياكي قليلة الملح',
      '1 ملعقة كبيرة زيت سمسم',
      '1 ملعقة كبيرة بذور سمسم',
      'بصل أخضر للتزيين'
    ],
    instructions_en: [
      'Press tofu, cut into cubes',
      'Heat sesame oil, pan-fry tofu until golden',
      'Remove tofu, stir-fry vegetables in same pan',
      'Return tofu, add teriyaki sauce, toss',
      'Serve over brown rice, sesame seeds, scallions'
    ],
    instructions_ar: [
      'اضغط التوfu، قطّع إلى مكعبات',
      'سخّن زيت السمسم، اقلي التوfu حتى يذهب',
      'أزل التوfu، اقلي الخضروات في نفس المقلاة',
      'أعد التوfu، أضف صلصة التريياكي، قلّب',
      'قدم فوق الأرز البني وبذور السمسم والبصل الأخضر'
    ],
    tags_en: ['Vegetarian', 'Plant Protein', 'Asian'],
    tags_ar: ['نباتي', 'بروتين نباتي', 'آسيوي']
  },
  {
    id: 'lentil-curry',
    name_en: 'Red Lentil Curry with Basmati Rice',
    name_ar: 'كاري عدس أحمر بأرز بسمتي',
    category_en: 'Dinner',
    category_ar: 'عشاء',
    calories: 520,
    protein: 28,
    carbs: 78,
    fats: 12,
    ingredients_en: [
      '1 cup red lentils, rinsed',
      '1 cup basmati rice, cooked',
      '1 can (400ml) coconut milk',
      '1 onion, diced',
      '2 garlic cloves, minced',
      '1 tbsp curry powder',
      '1 tsp turmeric',
      '1 tbsp coconut oil'
    ],
    ingredients_ar: [
      '1 كوب عدس أحمر مغسول',
      '1 كوب أرز بسمتي مطبوخ',
      '1 علبة (400مل) حليب جوز هند',
      '1 بصل مقطع',
      '2 فصوص ثوم مهروسة',
      '1 ملعقة كبيرة بودرة كاري',
      '1 ملعقة صغيرة كركم',
      '1 ملعقة كبيرة زيت جوز هند'
    ],
    instructions_en: [
      'Sauté onion and garlic in coconut oil',
      'Add curry powder and turmeric, toast 30 sec',
      'Add lentils and coconut milk, 1 cup water',
      'Simmer 20-25 minutes until lentils are soft',
      'Serve over basmati rice'
    ],
    instructions_ar: [
      'اقلي البصل والثوم في زيت جوز الهند',
      'أضف بودرة الكاري والكركم، حمّص 30 ثانية',
      'أضف العدس وحليب جوز الهند و1 كوب ماء',
      'اطبخ 20-25 دقيقة حتى ينضج العدس',
      'قدم فوق الأرز البسمتي'
    ],
    tags_en: ['Vegan', 'High Fiber', 'Iron'],
    tags_ar: ['نباتي', 'ألياف عالية', 'حديد']
  },
  {
    id: 'steak-mashed-potato',
    name_en: 'Sirloin Steak with Cauliflower Mash',
    name_ar: 'شريحة لحم سيرلوين بهريس القرنبيط',
    category_en: 'Dinner',
    category_ar: 'عشاء',
    calories: 550,
    protein: 50,
    carbs: 22,
    fats: 30,
    ingredients_en: [
      '220g lean sirloin steak',
      '2 cups cauliflower florets',
      '2 tbsp butter or ghee',
      '1 tbsp olive oil',
      'Salt, pepper, garlic powder',
      'Fresh rosemary',
      '1 cup asparagus, steamed'
    ],
    ingredients_ar: [
      '220جم شريحة لحم سيرلوين خالية من الدهن',
      '2 كوب زهور القرنبيط',
      '2 ملعقة كبيرة زبدة أو سمن',
      '1 ملعقة كبيرة زيت زيتون',
      'ملح، فلفل، بودرة ثوم',
      'إكليل الجبل طازج',
      '1 كوب هليون مطهو بالبخار'
    ],
    instructions_en: [
      'Season steak generously with salt, pepper, garlic powder',
      'Heat olive oil in cast iron pan, sear steak 3-4 min per side',
      'Rest steak 5 minutes',
      'Steam cauliflower 8 minutes, blend with butter',
      'Serve steak over cauliflower mash with asparagus'
    ],
    instructions_ar: [
      'بلّل الشريحة بوفرة بالملح والفلفل وبودرة الثوم',
      'سخّن زيت الزيتون في مقلاة حديدية، اقلي الشريحة 3-4 دقائق لكل جانب',
      'اترك اللحم 5 دقائق للراحة',
      'بخّر القرنبيط 8 دقائق، اخلط مع الزبدة',
      'قدم الشريحة فوق بهريس القرنبيط مع الهليون'
    ],
    tags_en: ['High Protein', 'Low Carb', 'Iron'],
    tags_ar: ['بروتين عالي', 'كربوهيدرات منخفضة', 'حديد']
  },
  {
    id: 'mackerel-fillet',
    name_en: 'Pan-Seared Mackerel with Greens',
    name_ar: 'فيليه ماكريول مقلي مع الخضروات الورقية',
    category_en: 'Dinner',
    category_ar: 'عشاء',
    calories: 490,
    protein: 38,
    carbs: 18,
    fats: 30,
    ingredients_en: [
      '200g mackerel fillets',
      '3 cups kale or Swiss chard, sautéed',
      '1/2 cup quinoa, cooked',
      '1 tbsp olive oil',
      'Garlic cloves',
      'Lemon juice',
      'Salt & pepper'
    ],
    ingredients_ar: [
      '200جم فيليه ماكريول',
      '3 كوب كيل أو سلق مقلي',
      '1/2 كوب كينوا مطبوخة',
      '1 ملعقة كبيرة زيت زيتون',
      'فصوص ثوم',
      'عصير ليمون',
      'ملح وفلفل'
    ],
    instructions_en: [
      'Pat mackerel dry, season with salt and pepper',
      'Heat olive oil in pan, skin-side down, sear 4 minutes',
      'Flip, cook 2 more minutes',
      'Sauté kale with garlic until wilted',
      'Serve with quinoa, squeeze fresh lemon'
    ],
    instructions_ar: [
      'جفّف الماكريول، بلّل بالملح والفلفل',
      'سخّن زيت الزيتون في المقلاة، الجلد للأسفل، اقلي 4 دقائق',
      'اقلب، اطبخ دقيقتين إضافيتين',
      'اقلي الكيل مع الثوم حتى يذبل',
      'قدم مع الكينوا، اعصر ليمون طازج'
    ],
    tags_en: ['Omega-3', 'High Protein', 'Healthy Fats'],
    tags_ar: ['أوميغا 3', 'بروتين عالي', 'دهون صحية']
  },

  // ============ SNACK ============
  {
    id: 'protein-shake',
    name_en: 'Vanilla Protein Shake',
    name_ar: 'مخفوق البروتين بالفانيليا',
    category_en: 'Snack',
    category_ar: 'وجبة خفيفة',
    calories: 250,
    protein: 30,
    carbs: 20,
    fats: 4,
    ingredients_en: [
      '1 scoop vanilla whey protein',
      '1 cup almond milk',
      '1/2 frozen banana',
      '1 tbsp peanut butter (optional)',
      'Ice cubes'
    ],
    ingredients_ar: [
      '1 ملعقة بروتين مصل اللبن بالفانيليا',
      '1 كوب حليب اللوز',
      '1/2 موزة مجمدة',
      '1 ملعقة كبيرة زبدة فول سوداني (اختياري)',
      'مكعبات ثلج'
    ],
    instructions_en: [
      'Add all ingredients to blender',
      'Blend until smooth and creamy',
      'Pour into glass',
      'Enjoy immediately'
    ],
    instructions_ar: [
      'أضف جميع المكونات إلى الخلاط',
      'اخلط حتى يصبح ناعماً وكريمياً',
      'صبّ في كأس',
      'استمتع فوراً'
    ],
    tags_en: ['High Protein', 'Quick', 'Post-Workout'],
    tags_ar: ['بروتين عالي', 'سريع', 'بعد التمرين']
  },
  {
    id: 'cottage-cheese-fruit',
    name_en: 'Cottage Cheese with Pineapple',
    name_ar: 'جبنة قريش بالأناناس',
    category_en: 'Snack',
    category_ar: 'وجبة خفيفة',
    calories: 220,
    protein: 28,
    carbs: 20,
    fats: 3,
    ingredients_en: [
      '1 cup low-fat cottage cheese',
      '1/2 cup fresh pineapple chunks',
      '1 tbsp honey (optional)',
      'Cinnamon to taste'
    ],
    ingredients_ar: [
      '1 كوب جبنة قريش قليلة الدسم',
      '1/2 كوب قطع أناناس طازج',
      '1 ملعقة كبيرة عسل (اختياري)',
      'قرفة حسب الرغبة'
    ],
    instructions_en: [
      'Place cottage cheese in a bowl',
      'Top with pineapple chunks',
      'Drizzle with honey if desired',
      'Sprinkle with cinnamon'
    ],
    instructions_ar: [
      'ضع الجبنة القريش في وعاء',
      'ضع قطع الأناناس فوقها',
      'رشّ بالعسل إذا رغبت',
      'رشّ بالقرفة'
    ],
    tags_en: ['High Protein', 'Quick', 'Low Fat'],
    tags_ar: ['بروتين عالي', 'سريع', 'قليل الدسم']
  },
  {
    id: 'apple-peanut-butter',
    name_en: 'Apple with Peanut Butter',
    name_ar: 'تفاح بزبدة الفول السوداني',
    category_en: 'Snack',
    category_ar: 'وجبة خفيفة',
    calories: 280,
    protein: 8,
    carbs: 35,
    fats: 14,
    ingredients_en: [
      '1 medium apple, sliced',
      '2 tbsp natural peanut butter',
      'Cinnamon (optional)'
    ],
    ingredients_ar: [
      '1 تفاحة متوسطة مقطعة',
      '2 ملعقة كبيرة زبدة فول سوداني طبيعية',
      'قرفة (اختياري)'
    ],
    instructions_en: [
      'Wash and slice apple',
      'Dip each slice in peanut butter',
      'Sprinkle with cinnamon if desired',
      'Eat immediately'
    ],
    instructions_ar: [
      'اغسل التفاحة وقطّعها',
      'غمّس كل شريحة في زبدة الفول السوداني',
      'رشّ بالقرفة إذا رغبت',
      'كل فوراً'
    ],
    tags_en: ['Fiber', 'Healthy Fats', 'Quick'],
    tags_ar: ['ألياف', 'دهون صحية', 'سريع']
  },
  {
    id: 'greek-yogurt-protein',
    name_en: 'Greek Yogurt with Protein',
    name_ar: 'زبادي يوناني بالبروتين',
    category_en: 'Snack',
    category_ar: 'وجبة خفيفة',
    calories: 240,
    protein: 35,
    carbs: 15,
    fats: 4,
    ingredients_en: [
      '1.5 cups non-fat Greek yogurt',
      '1 scoop vanilla protein powder',
      '1 tbsp honey',
      '1 tbsp walnuts, crushed'
    ],
    ingredients_ar: [
      '1.5 كوب زبادي يوناني خالٍ من الدسم',
      '1 ملعقة بودرة بروتين فانيليا',
      '1 ملعقة كبيرة عسل',
      '1 ملعقة كبيرة جوز مهروس'
    ],
    instructions_en: [
      'Whisk protein powder into Greek yogurt',
      'Transfer to bowl',
      'Drizzle with honey',
      'Sprinkle crushed walnuts on top'
    ],
    instructions_ar: [
      'اخفق بودرة البروتين في الزبادي اليوناني',
      'انقل إلى وعاء',
      'رشّ بالعسل',
      'رشّ الجوز المهروم فوقه'
    ],
    tags_en: ['High Protein', 'Probiotics', 'Quick'],
    tags_ar: ['بروتين عالي', 'بروبيوتيك', 'سريع']
  },
  {
    id: 'edamame-snack',
    name_en: 'Steamed Edamame',
    name_ar: 'إيدامامي مطهو بالبخار',
    category_en: 'Snack',
    category_ar: 'وجبة خفيفة',
    calories: 180,
    protein: 18,
    carbs: 15,
    fats: 8,
    ingredients_en: [
      '1 cup edamame (in pods)',
      'Sea salt to taste',
      'Chili flakes (optional)'
    ],
    ingredients_ar: [
      '1 كوب إيدامامي (في القشور)',
      'ملح بحري حسب الرغبة',
      'رقائق فلفل حار (اختياري)'
    ],
    instructions_en: [
      'Steam edamame in pods for 5-7 minutes',
      'Drain and rinse with cold water briefly',
      'Sprinkle with sea salt and chili flakes',
      'Pop the beans out to eat'
    ],
    instructions_ar: [
      'بخّر الإيدامامي في القشور لمدة 5-7 دقائق',
      'صفي واشطف بالماء البارد لفترة وجيزة',
      'رشّ بملح بحري و فلفل حار',
      'أخرج الحبوب لتأكلها'
    ],
    tags_en: ['Plant Protein', 'Soy', 'Low Calorie'],
    tags_ar: ['بروتين نباتي', 'صويا', 'سعرات منخفضة']
  },
  {
    id: 'protein-balls',
    name_en: 'Peanut Butter Protein Balls',
    name_ar: 'كرات بروتين زبدة الفول السوداني',
    category_en: 'Snack',
    category_ar: 'وجبة خفيفة',
    calories: 150,
    protein: 10,
    carbs: 14,
    fats: 7,
    ingredients_en: [
      '1/2 cup rolled oats',
      '1/4 cup peanut butter',
      '2 tbsp honey',
      '1 scoop chocolate protein powder',
      '1 tbsp chia seeds',
      '1 tbsp shredded coconut'
    ],
    ingredients_ar: [
      '1/2 كوب شوفان كامل',
      '1/4 كوب زبدة فول سوداني',
      '2 ملعقة كبيرة عسل',
      '1 ملعقة بودرة بروتين شوكولاتة',
      '1 ملعقة كبيرة بذور الشيا',
      '1 ملعقة كبيرة جوز هند مبشور'
    ],
    instructions_en: [
      'Mix all ingredients in a large bowl',
      'Refrigerate 15 minutes to firm up',
      'Roll into 1-inch balls',
      'Store in refrigerator up to 1 week'
    ],
    instructions_ar: [
      'اخلط جميع المكونات في وعاء كبير',
      'بارد في الثلاجة 15 دقيقة ليتصلب',
      'لفّ إلى كرات بحجم 1 بوصة',
      'خزن في الثلاجة حتى أسبوع واحد'
    ],
    tags_en: ['Meal Prep', 'No Bake', 'Quick'],
    tags_ar: ['تحضير الوجبات', 'بدون خبز', 'سريع']
  },
  {
    id: 'hard-boiled-eggs',
    name_en: 'Hard Boiled Eggs',
    name_ar: 'بيض مسلوق',
    category_en: 'Snack',
    category_ar: 'وجبة خفيفة',
    calories: 150,
    protein: 13,
    carbs: 2,
    fats: 10,
    ingredients_en: [
      '2 large eggs',
      'Water',
      'Salt & pepper to taste'
    ],
    ingredients_ar: [
      '2 بيضات كبيرتان',
      'ماء',
      'ملح وفلفل حسب الرغبة'
    ],
    instructions_en: [
      'Place eggs in pot, cover with cold water',
      'Bring to boil, then remove from heat',
      'Cover and let sit 10-12 minutes',
      'Transfer to ice water, peel, season'
    ],
    instructions_ar: [
      'ضع البيض في قدر، غطِّ بالماء البارد',
      'أغلي، ثم أزل من النار',
      'غطّ واترك 10-12 دقيقة',
      'انقل إلى ماء مثلج، قشر، بلّل'
    ],
    tags_en: ['High Protein', 'Keto Friendly', 'Quick'],
    tags_ar: ['بروتين عالي', 'مناسب للكيتو', 'سريع']
  },
  {
    id: 'nuts-mix',
    name_en: 'Trail Mix (Protein-Packed)',
    name_ar: 'مكسرات متنوعة (غنية بالبروتين)',
    category_en: 'Snack',
    category_ar: 'وجبة خفيفة',
    calories: 280,
    protein: 10,
    carbs: 22,
    fats: 19,
    ingredients_en: [
      '15 almonds',
      '15 cashews',
      '2 tbsp pumpkin seeds',
      '1 tbsp dark chocolate chips (70%+)',
      '2 tbsp dried cranberries'
    ],
    ingredients_ar: [
      '15 لوزة',
      '15 كاجو',
      '2 ملعقة كبيرة بذور قرع',
      '1 ملعقة كبيرة رقائق شوكولاتة داكنة (70%+)',
      '2 ملعقة كبيرة توت بري مجفف'
    ],
    instructions_en: [
      'Combine all ingredients in a small container',
      'Mix well',
      'Portion into 1/4 cup servings',
      'Enjoy as a quick snack'
    ],
    instructions_ar: [
      'جمّع جميع المكونات في حاوية صغيرة',
      'اخلط جيداً',
      'قسّم إلى حصص 1/4 كوب',
      'استمتع كوجبة خفيفة سريعة'
    ],
    tags_en: ['Healthy Fats', 'Portable', 'Energy'],
    tags_ar: ['دهون صحية', 'محمول', 'طاقة']
  },

  // ============ PRE-WORKOUT ============
  {
    id: 'oatmeal-pre-workout',
    name_en: 'Oatmeal & Banana Pre-Workout',
    name_ar: 'شوفان وموز قبل التمرين',
    category_en: 'Pre-Workout',
    category_ar: 'قبل التمرين',
    calories: 320,
    protein: 12,
    carbs: 55,
    fats: 6,
    ingredients_en: [
      '1/2 cup rolled oats, cooked',
      '1 medium banana',
      '1 tbsp honey',
      '1 tsp cinnamon'
    ],
    ingredients_ar: [
      '1/2 كوب شوفان كامل مطبوخ',
      '1 موزة متوسطة',
      '1 ملعقة كبيرة عسل',
      '1 ملعقة صغيرة قرفة'
    ],
    instructions_en: [
      'Cook oatmeal according to package',
      'Top with sliced banana',
      'Drizzle with honey',
      'Sprinkle with cinnamon',
      'Eat 45-60 minutes before workout'
    ],
    instructions_ar: [
      'اطبخ الشوفان حسب التعليمات',
      'زين بالموز المقطع',
      'رشّ بالعسل',
      'رشّ بالقرفة',
      'كل 45-60 دقيقة قبل التمرين'
    ],
    tags_en: ['Energy', 'Complex Carbs', 'Pre-Workout'],
    tags_ar: ['طاقة', 'كربوهيدرات معقدة', 'قبل التمرين']
  },
  {
    id: 'white-rice-chicken',
    name_en: 'White Rice & Grilled Chicken',
    name_ar: 'أرز أبيض ودجاج مشوي',
    category_en: 'Pre-Workout',
    category_ar: 'قبل التمرين',
    calories: 380,
    protein: 28,
    carbs: 55,
    fats: 4,
    ingredients_en: [
      '1 cup white rice, cooked',
      '120g grilled chicken breast',
      'Soy sauce to taste',
      'Green onion for garnish'
    ],
    ingredients_ar: [
      '1 كوب أرز أبيض مطبوخ',
      '120جم صدور دجاج مشوية',
      'صويا صوص حسب الرغبة',
      'بصل أخضر للتزيين'
    ],
    instructions_en: [
      'Cook white rice until fluffy',
      'Slice grilled chicken breast',
      'Arrange rice and chicken on plate',
      'Drizzle with soy sauce, garnish',
      'Eat 60-90 minutes before workout'
    ],
    instructions_ar: [
      'اطبخ الأرز الأبيض حتى يصبح رطباً',
      'قطّع صدور الدجاج المشوية',
      'رصّ الأرز والدجاج على الطبق',
      'رشّ بصويا صوص، زيّن',
      'كل 60-90 دقيقة قبل التمرين'
    ],
    tags_en: ['Quick Energy', 'High Glycemic', 'Pre-Workout'],
    tags_ar: ['طاقة سريعة', 'نسبة جلايسيمية عالية', 'قبل التمرين']
  },
  {
    id: 'fruit-smoothie-pre',
    name_en: 'Fruit Smoothie Pre-Workout',
    name_ar: 'سموذي فواكه قبل التمرين',
    category_en: 'Pre-Workout',
    category_ar: 'قبل التمرين',
    calories: 280,
    protein: 10,
    carbs: 55,
    fats: 3,
    ingredients_en: [
      '1 cup frozen mixed berries',
      '1 banana',
      '1 cup orange juice',
      '1/2 cup Greek yogurt',
      '1 tsp honey'
    ],
    ingredients_ar: [
      '1 كوب berries متنوعة مجمدة',
      '1 موزة',
      '1 كوب عصير برتقال',
      '1/2 كوب زبادي يوناني',
      '1 ملعقة صغيرة عسل'
    ],
    instructions_en: [
      'Add all ingredients to blender',
      'Blend until smooth',
      'Pour into glass',
      'Drink 30-45 minutes before workout'
    ],
    instructions_ar: [
      'أضف جميع المكونات إلى الخلاط',
      'اخلط حتى ينعيم',
      'صبّ في كأس',
      'اشرب 30-45 دقيقة قبل التمرين'
    ],
    tags_en: ['Quick Energy', 'Vitamins', 'Liquid Meal'],
    tags_ar: ['طاقة سريعة', 'فيتامينات', 'وجبة سائلة']
  },

  // ============ POST-WORKOUT ============
  {
    id: 'post-workout-shake',
    name_en: 'Post-Workout Recovery Shake',
    name_ar: 'مخفوق التعافي بعد التمرين',
    category_en: 'Post-Workout',
    category_ar: 'بعد التمرين',
    calories: 350,
    protein: 35,
    carbs: 45,
    fats: 4,
    ingredients_en: [
      '1 scoop whey protein (vanilla or chocolate)',
      '1 frozen banana',
      '1 cup skim milk or almond milk',
      '1 tbsp honey',
      'Ice cubes'
    ],
    ingredients_ar: [
      '1 ملعقة بروتين مصل اللبن (فانيليا أو شوكولاتة)',
      '1 موزة مجمدة',
      '1 كوب حليب خالي الدسم أو حليب لوز',
      '1 ملعقة كبيرة عسل',
      'مكعبات ثلج'
    ],
    instructions_en: [
      'Add all ingredients to blender',
      'Blend until smooth and creamy',
      'Serve immediately',
      'Drink within 30 minutes post-workout'
    ],
    instructions_ar: [
      'أضف جميع المكونات إلى الخلاط',
      'اخلط حتى ينعيم ويصبح كريمياً',
      'قدم فوراً',
      'اشرب خلال 30 دقيقة بعد التمرين'
    ],
    tags_en: ['High Protein', 'Recovery', 'Post-Workout'],
    tags_ar: ['بروتين عالي', 'تعافي', 'بعد التمرين']
  },
  {
    id: 'chicken-sweet-potato',
    name_en: 'Chicken & Sweet Potato Post-Workout',
    name_ar: 'دجاج وبطاطا حلوة بعد التمرين',
    category_en: 'Post-Workout',
    category_ar: 'بعد التمرين',
    calories: 480,
    protein: 42,
    carbs: 58,
    fats: 6,
    ingredients_en: [
      '200g grilled chicken breast',
      '1 medium sweet potato, baked',
      '1 cup steamed broccoli',
      '1 tbsp olive oil',
      'Salt & pepper'
    ],
    ingredients_ar: [
      '200جم صدور دجاج مشوية',
      '1 بطاطا حلوة متوسطة مخبوزة',
      '1 كوب بروكلي مطهو بالبخار',
      '1 ملعقة كبيرة زيت زيتون',
      'ملح وفلفل'
    ],
    instructions_en: [
      'Bake sweet potato at 200°C for 45 minutes',
      'Grill chicken breast',
      'Steam broccoli florets',
      'Assemble all on plate, drizzle olive oil',
      'Eat within 1-2 hours post-workout'
    ],
    instructions_ar: [
      'اخبز البطاطا الحلوة عند 200م لمدة 45 دقيقة',
      'اشوي صدور الدجاج',
      'بخّر زهور البروكلي',
      'جمّع الكل على الطبق، رشّ بزيت الزيتون',
      'كل خلال 1-2 ساعة بعد التمرين'
    ],
    tags_en: ['High Protein', 'Complex Carbs', 'Recovery'],
    tags_ar: ['بروتين عالي', 'كربوهيدرات معقدة', 'تعافي']
  },
  {
    id: 'salmon-avocado-toast',
    name_en: 'Smoked Salmon Avocado Toast',
    name_ar: 'نخيل الأفوكادو بالسلمون المدخن',
    category_en: 'Post-Workout',
    category_ar: 'بعد التمرين',
    calories: 420,
    protein: 28,
    carbs: 35,
    fats: 20,
    ingredients_en: [
      '2 slices sourdough bread, toasted',
      '80g smoked salmon',
      '1/2 avocado, mashed',
      '1 tbsp cream cheese (low fat)',
      'Capers and dill',
      'Lemon juice'
    ],
    ingredients_ar: [
      '2 شرائح خبز سوردو محمّص',
      '80جم سلمون مدخن',
      '1/2 أفوكادو مهروس',
      '1 ملعقة كبيرة جبن كريمي (قليل الدسم)',
      'كابر وشبت',
      'عصير ليمون'
    ],
    instructions_en: [
      'Toast sourdough bread slices',
      'Spread cream cheese and avocado on toast',
      'Top with smoked salmon slices',
      'Garnish with capers and fresh dill',
      'Squeeze lemon juice on top'
    ],
    instructions_ar: [
      'حمّص شرائح خبز السوردو',
      'افرد جبن الكريمي والأفوكادو على الخبز المحمص',
      'ضع شرائح السلمون المدخن فوقها',
      'زين بالكابر والشبت الطازج',
      'اعصر عصير الليمون فوقه'
    ],
    tags_en: ['Omega-3', 'Protein', 'Healthy Fats'],
    tags_ar: ['أوميغا 3', 'بروتين', 'دهون صحية']
  },
  {
    id: 'tuna-rice-cakes',
    name_en: 'Tuna Rice Cakes',
    name_ar: 'كعكات الأرز بالتونة',
    category_en: 'Post-Workout',
    category_ar: 'بعد التمرين',
    calories: 300,
    protein: 30,
    carbs: 30,
    fats: 6,
    ingredients_en: [
      '3 brown rice cakes',
      '1 can (170g) tuna in water, drained',
      '2 tbsp Greek yogurt',
      '1 tsp Dijon mustard',
      'Lemon juice',
      'Black pepper'
    ],
    ingredients_ar: [
      '3 كعكات أرز بني',
      '1 علبة (170جم) تونة في ماء، مصفاة',
      '2 ملعقة كبيرة زبادي يوناني',
      '1 ملعقة صغيرة خردل ديجون',
      'عصير ليمون',
      'فلفل أسود'
    ],
    instructions_en: [
      'Mix tuna with Greek yogurt, mustard, lemon juice, pepper',
      'Spread tuna mixture on rice cakes',
      'Serve immediately',
      'Great 30-60 minutes post-workout'
    ],
    instructions_ar: [
      'اخلط التونة مع الزبادي اليوناني والخردل وعصير الليمون والفلفل',
      'افرد خليط التونة على كعكات الأرز',
      'قدم فوراً',
      'ممتاز 30-60 دقيقة بعد التمرين'
    ],
    tags_en: ['High Protein', 'Quick', 'Portable'],
    tags_ar: ['بروتين عالي', 'سريع', 'محمول']
  }
];

export const getMealById = (id: string): Meal | undefined => {
  return meals.find((m) => m.id === id);
};

export const getMealsByCategory = (category_en: Meal['category_en']): Meal[] => {
  return meals.filter((m) => m.category_en === category_en);
};

export const getMealsByTags = (tags: string[]): Meal[] => {
  return meals.filter((m) =>
    tags.some((tag) => m.tags_en.map((t) => t.toLowerCase()).includes(tag.toLowerCase()))
  );
};

export const getMealsByMaxCalories = (maxCalories: number): Meal[] => {
  return meals.filter((m) => m.calories <= maxCalories);
};

export const getMealsByMinProtein = (minProtein: number): Meal[] => {
  return meals.filter((m) => m.protein >= minProtein);
};
