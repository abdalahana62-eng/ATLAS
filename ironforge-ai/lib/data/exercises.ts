import { Exercise } from '@/lib/types';

export const exercises: Exercise[] = [
  // ============ CHEST EXERCISES ============
  {
    id: 'barbell-bench-press',
    name_en: 'Barbell Bench Press',
    name_ar: 'الضغط الصدر بالباربل',
    targetMuscle_en: 'Chest',
    targetMuscle_ar: 'الصدر',
    category: 'chest',
    equipment_en: 'Barbell, Bench',
    equipment_ar: 'باربل، مقعد',
    difficulty: 'intermediate',
    formTips_en: [
      'Keep feet flat on the floor',
      'Grip bar slightly wider than shoulder-width',
      'Lower bar to mid-chest',
      'Press up without locking elbows'
    ],
    formTips_ar: [
      'أبقِ قدميك مسطحتين على الأرض',
      'امسك الباربل بعرض أوسع قليلاً من الكتفين',
      'أنزل الباربل إلى منتصف الصدر',
      'اضغط للأعلى دون قفل المرفقين'
    ],
    muscles_en: ['Pectoralis Major', 'Triceps', 'Anterior Deltoid'],
    muscles_ar: ['العضلة الصدرية الكبرى', 'ثلاثية الذراع', 'الكتف الأمامي']
  },
  {
    id: 'dumbbell-bench-press',
    name_en: 'Dumbbell Bench Press',
    name_ar: 'الضغط الصدر بالدامبل',
    targetMuscle_en: 'Chest',
    targetMuscle_ar: 'الصدر',
    category: 'chest',
    equipment_en: 'Dumbbells, Bench',
    equipment_ar: 'دامبل، مقعد',
    difficulty: 'beginner',
    formTips_en: [
      'Lower dumbbells to chest level',
      'Palms facing forward',
      'Squeeze chest at the top',
      'Control the eccentric phase'
    ],
    formTips_ar: [
      'أنزل الدمابل إلى مستوى الصدر',
      'راحتي اليدين متجهتين للأمام',
      'اضغط على الصدر في الأعلى',
      'تحكم في مرحلة النزول'
    ],
    muscles_en: ['Pectoralis Major', 'Triceps', 'Anterior Deltoid'],
    muscles_ar: ['العضلة الصدرية الكبرى', 'ثلاثية الذراع', 'الكتف الأمامي']
  },
  {
    id: 'incline-bench-press',
    name_en: 'Incline Barbell Bench Press',
    name_ar: 'الضغط الصدر المائل بالأعلى',
    targetMuscle_en: 'Upper Chest',
    targetMuscle_ar: 'الجزء العلوي من الصدر',
    category: 'chest',
    equipment_en: 'Barbell, Incline Bench',
    equipment_ar: 'باربل، مقعد مائل',
    difficulty: 'intermediate',
    formTips_en: [
      'Set bench to 30-45 degrees',
      'Lower bar to upper chest',
      'Keep core tight',
      'Drive through your feet'
    ],
    formTips_ar: [
      'اضبط المقعد بزاوية 30-45 درجة',
      'أنزل الباربل إلى الجزء العلوي من الصدر',
      'أبقِ عضلات الجذع مشدودة',
      'ادفع من خلال قدميك'
    ],
    muscles_en: ['Upper Pectoralis', 'Anterior Deltoid', 'Triceps'],
    muscles_ar: ['الصدر العلوي', 'الكتف الأمامي', 'ثلاثية الذراع']
  },
  {
    id: 'decline-bench-press',
    name_en: 'Decline Barbell Bench Press',
    name_ar: 'الضغط الصدر المائل للأسفل',
    targetMuscle_en: 'Lower Chest',
    targetMuscle_ar: 'الجزء السفلي من الصدر',
    category: 'chest',
    equipment_en: 'Barbell, Decline Bench',
    equipment_ar: 'باربل، مقعد منخفض',
    difficulty: 'intermediate',
    formTips_en: [
      'Secure legs at the top',
      'Lower bar to lower chest',
      'Avoid bouncing the bar',
      'Exhale on the press'
    ],
    formTips_ar: [
      'ثبّت ساقيك في الأعلى',
      'أنزل الباربل إلى الجزء السفلي من الصدر',
      'تجنب ارتداد الباربل',
      'ازفر أثناء الضغط'
    ],
    muscles_en: ['Lower Pectoralis', 'Triceps'],
    muscles_ar: ['الصدر السفلي', 'ثلاثية الذراع']
  },
  {
    id: 'dumbbell-fly',
    name_en: 'Dumbbell Fly',
    name_ar: 'فتحة الصدر بالدامبل',
    targetMuscle_en: 'Chest',
    targetMuscle_ar: 'الصدر',
    category: 'chest',
    equipment_en: 'Dumbbells, Bench',
    equipment_ar: 'دامبل، مقعد',
    difficulty: 'beginner',
    formTips_en: [
      'Keep slight elbow bend',
      'Arms form a wide arc',
      'Squeeze chest at the top',
      'Use lighter weight'
    ],
    formTips_ar: [
      'أبقِ ثني طفيف في المرفقين',
      'الذراعان تشكلان قوساً عريضاً',
      'اضغط على الصدر في الأعلى',
      'استخدم وزناً أخف'
    ],
    muscles_en: ['Pectoralis Major', 'Anterior Deltoid'],
    muscles_ar: ['العضلة الصدرية الكبرى', 'الكتف الأمامي']
  },
  {
    id: 'cable-crossover',
    name_en: 'Cable Crossover',
    name_ar: 'تقاطع الكابل للصدر',
    targetMuscle_en: 'Chest',
    targetMuscle_ar: 'الصدر',
    category: 'chest',
    equipment_en: 'Cable Machine',
    equipment_ar: 'آلة الكابل',
    difficulty: 'beginner',
    formTips_en: [
      'Set cables at shoulder height',
      'Step forward slightly',
      'Bring handles together at chest level',
      'Squeeze for 1 second'
    ],
    formTips_ar: [
      'اضبط الكابلات عند ارتفاع الكتفين',
      'تقدم للأمام قليلاً',
      'جمع المقابض معاً عند مستوى الصدر',
      'اضغط لمدة ثانية واحدة'
    ],
    muscles_en: ['Pectoralis Major', 'Anterior Deltoid'],
    muscles_ar: ['العضلة الصدرية الكبرى', 'الكتف الأمامي']
  },
  {
    id: 'push-ups',
    name_en: 'Push-Ups',
    name_ar: 'الضغط',
    targetMuscle_en: 'Chest',
    targetMuscle_ar: 'الصدر',
    category: 'chest',
    equipment_en: 'Bodyweight',
    equipment_ar: 'وزن الجسم',
    difficulty: 'beginner',
    formTips_en: [
      'Body in straight line',
      'Hands slightly wider than shoulders',
      'Lower chest to floor',
      'Push back up'
    ],
    formTips_ar: [
      'الجسم في خط مستقيم',
      'اليدان أعرض قليلاً من الكتفين',
      'أنزل الصدر إلى الأرض',
      'ادفع للأعلى'
    ],
    muscles_en: ['Pectoralis Major', 'Triceps', 'Core'],
    muscles_ar: ['العضلة الصدرية الكبرى', 'ثلاثية الذراع', 'الجذع']
  },
  {
    id: 'chest-dips',
    name_en: 'Chest Dips',
    name_ar: 'الانخفاضات الصدرية',
    targetMuscle_en: 'Chest',
    targetMuscle_ar: 'الصدر',
    category: 'chest',
    equipment_en: 'Parallel Bars',
    equipment_ar: 'قضبان متوازية',
    difficulty: 'advanced',
    formTips_en: [
      'Lean forward to target chest',
      'Lower until elbows are 90 degrees',
      'Avoid shoulder strain',
      'Push back up powerfully'
    ],
    formTips_ar: [
      'ميل للأمام لاستهداف الصدر',
      'أنزل حتى يكون المرفقان بزاوية 90 درجة',
      'تجنب إجهاد الكتف',
      'ادفع للأعلى بقوة'
    ],
    muscles_en: ['Pectoralis Major', 'Triceps', 'Shoulders'],
    muscles_ar: ['العضلة الصدرية الكبرى', 'ثلاثية الذراع', 'الكتفين']
  },
  {
    id: 'machine-chest-press',
    name_en: 'Machine Chest Press',
    name_ar: 'ضغط الصدر بالآلة',
    targetMuscle_en: 'Chest',
    targetMuscle_ar: 'الصدر',
    category: 'chest',
    equipment_en: 'Chest Press Machine',
    equipment_ar: 'آلة ضغط الصدر',
    difficulty: 'beginner',
    formTips_en: [
      'Sit with back flat against pad',
      'Grasp handles at chest level',
      'Press forward until arms are extended',
      'Return slowly'
    ],
    formTips_ar: [
      'اجلس مع ظهر مسطح على المقعد',
      'امسك المقابض عند مستوى الصدر',
      'اضغط للأمام حتى تمتد الذراعان',
      'عد ببطء'
    ],
    muscles_en: ['Pectoralis Major', 'Triceps', 'Anterior Deltoid'],
    muscles_ar: ['العضلة الصدرية الكبرى', 'ثلاثية الذراع', 'الكتف الأمامي']
  },
  {
    id: 'svend-press',
    name_en: 'Svend Press',
    name_ar: 'ضغط سفيند',
    targetMuscle_en: 'Chest',
    targetMuscle_ar: 'الصدر',
    category: 'chest',
    equipment_en: 'Dumbbell or Plate',
    equipment_ar: 'دامبل أو قرص وزن',
    difficulty: 'beginner',
    formTips_en: [
      'Hold plate at chest level',
      'Press forward with palms together',
      'Squeeze chest hard',
      'Control the return'
    ],
    formTips_ar: [
      'امسك القرص عند مستوى الصدر',
      'اضغط للأمام مع راحة اليدين معاً',
      'اضغط على الصدر بقوة',
      'تحكم في العودة'
    ],
    muscles_en: ['Pectoralis Major', 'Anterior Deltoid'],
    muscles_ar: ['العضلة الصدرية الكبرى', 'الكتف الأمامي']
  },
  {
    id: 'pec-deck-fly',
    name_en: 'Pec Deck Fly',
    name_ar: 'فتحة الصدر بالآلة',
    targetMuscle_en: 'Chest',
    targetMuscle_ar: 'الصدر',
    category: 'chest',
    equipment_en: 'Pec Deck Machine',
    equipment_ar: 'آلة فتحة الصدر',
    difficulty: 'beginner',
    formTips_en: [
      'Sit with back flat',
      'Place forearms on pads',
      'Squeeze arms together',
      'Hold peak contraction'
    ],
    formTips_ar: [
      'اجلس مع ظهر مسطح',
      'ضع الساعدين على الوسائد',
      'جمع الذراعين معاً',
      'ثبّت في ذروة الانقباض'
    ],
    muscles_en: ['Pectoralis Major', 'Anterior Deltoid'],
    muscles_ar: ['العضلة الصدرية الكبرى', 'الكتف الأمامي']
  },
  {
    id: 'spider-crawl',
    name_en: 'Spider Crawl Push-Ups',
    name_ar: 'ضغط الزحف العنكبوتي',
    targetMuscle_en: 'Chest',
    targetMuscle_ar: 'الصدر',
    category: 'chest',
    equipment_en: 'Bodyweight',
    equipment_ar: 'وزن الجسم',
    difficulty: 'advanced',
    formTips_en: [
      'Start in push-up position',
      'Bring knee to elbow as you lower',
      'Alternate sides each rep',
      'Keep core engaged'
    ],
    formTips_ar: [
      'ابدأ في وضعية الضغط',
      'أحضر الركبة إلى المرفق أثناء النزول',
      'بدّل الجانب في كل تكرار',
      'أبقِ الجذع مشدود'
    ],
    muscles_en: ['Pectoralis Major', 'Triceps', 'Core', 'Obliques'],
    muscles_ar: ['العضلة الصدرية الكبرى', 'ثلاثية الذراع', 'الجذع', 'العضلات المائلة']
  },

  // ============ BACK EXERCISES ============
  {
    id: 'deadlift',
    name_en: 'Conventional Deadlift',
    name_ar: 'الرفعة الميتة التقليدية',
    targetMuscle_en: 'Back',
    targetMuscle_ar: 'الظهر',
    category: 'back',
    equipment_en: 'Barbell',
    equipment_ar: 'باربل',
    difficulty: 'advanced',
    formTips_en: [
      'Feet shoulder-width, bar over mid-foot',
      'Hinge at hips, keep back neutral',
      'Grip bar just outside knees',
      'Drive through heels, lift with legs first'
    ],
    formTips_ar: [
      'القدمين بعرض الكتفين، الباربل فوق منتصف القدم',
      'ثني في الوركين، أبقِ الظهر محايداً',
      'امسك الباربل خارج الركبتين بقليل',
      'ادفع من خلال الكعوب، ارفع بالساقين أولاً'
    ],
    muscles_en: ['Erector Spinae', 'Glutes', 'Hamstrings', 'Traps', 'Lats'],
    muscles_ar: ['عضلات العمود الفقري', 'الألوية', 'أوتار الركبة', 'المنشارية', 'اللاتس']
  },
  {
    id: 'sumo-deadlift',
    name_en: 'Sumo Deadlift',
    name_ar: 'الرفعة الميتة السومو',
    targetMuscle_en: 'Back',
    targetMuscle_ar: 'الظهر',
    category: 'back',
    equipment_en: 'Barbell',
    equipment_ar: 'باربل',
    difficulty: 'intermediate',
    formTips_en: [
      'Wide stance, feet turned out',
      'Grip bar inside knees',
      'Keep torso upright',
      'Drive heels into floor'
    ],
    formTips_ar: [
      'واسع الوقفة، القدمين للخارج',
      'امسك الباربل داخل الركبتين',
      'أبقِ الجذع مستقيماً',
      'ادفع الكعوب إلى الأرض'
    ],
    muscles_en: ['Glutes', 'Quads', 'Hamstrings', 'Adductors', 'Lower Back'],
    muscles_ar: ['الألوية', 'الرباعية', 'أوتار الركبة', 'المقربة', 'الظهر السفلي']
  },
  {
    id: 'pull-ups',
    name_en: 'Pull-Ups',
    name_ar: 'الشد العلوي',
    targetMuscle_en: 'Lats',
    targetMuscle_ar: 'اللاتس',
    category: 'back',
    equipment_en: 'Pull-Up Bar',
    equipment_ar: 'قضيب الشد',
    difficulty: 'intermediate',
    formTips_en: [
      'Grip bar wider than shoulder-width',
      'Hang with full arm extension',
      'Pull chest to bar',
      'Lower with control'
    ],
    formTips_ar: [
      'امسك القضيب بعرض أوسع من الكتفين',
      'علّق بتمديد كامل للذراعين',
      'اسحب الصدر إلى القضيب',
      'انزل بتحكم'
    ],
    muscles_en: ['Latissimus Dorsi', 'Biceps', 'Upper Back'],
    muscles_ar: ['العضلة الظهرية العريضة', 'ثنائية الذراع', 'الظهر العلوي']
  },
  {
    id: 'chin-ups',
    name_en: 'Chin-Ups',
    name_ar: 'الشد المعكوس',
    targetMuscle_en: 'Lats',
    targetMuscle_ar: 'اللاتس',
    category: 'back',
    equipment_en: 'Pull-Up Bar',
    equipment_ar: 'قضيب الشد',
    difficulty: 'intermediate',
    formTips_en: [
      'Supinated grip (palms facing you)',
      'Shoulder-width grip',
      'Pull chin above bar',
      'Engage lats first'
    ],
    formTips_ar: [
      'قبضة معكوسة (راحتي اليدين متجهتين إليك)',
      'قبضة بعرض الكتفين',
      'اسحب الذقن فوق القضيب',
      'شغّل عضلات اللاتس أولاً'
    ],
    muscles_en: ['Latissimus Dorsi', 'Biceps', 'Brachiallis'],
    muscles_ar: ['العضلة الظهرية العريضة', 'ثنائية الذراع', 'العضلة العضدية']
  },
  {
    id: 'bent-over-barbell-row',
    name_en: 'Bent-Over Barbell Row',
    name_ar: 'الجذع المائل بالباربل',
    targetMuscle_en: 'Upper Back',
    targetMuscle_ar: 'الظهر العلوي',
    category: 'back',
    equipment_en: 'Barbell',
    equipment_ar: 'باربل',
    difficulty: 'intermediate',
    formTips_en: [
      'Hinge at hips, back flat 45 degrees',
      'Pull bar to lower chest',
      'Squeeze shoulder blades',
      'Lower with control'
    ],
    formTips_ar: [
      'ثني في الوركين، ظهر مسطح بزاوية 45 درجة',
      'اسحب الباربل إلى أسفل الصدر',
      'اضغط على لوحي الكتف',
      'أنزل بتحكم'
    ],
    muscles_en: ['Lats', 'Rhomboids', 'Biceps', 'Traps'],
    muscles_ar: ['اللاتس', 'المنعرجة', 'ثنائية الذراع', 'المنشارية']
  },
  {
    id: 'bent-over-dumbbell-row',
    name_en: 'Bent-Over Dumbbell Row',
    name_ar: 'الجذع المائل بالدامبل',
    targetMuscle_en: 'Upper Back',
    targetMuscle_ar: 'الظهر العلوي',
    category: 'back',
    equipment_en: 'Dumbbells, Bench',
    equipment_ar: 'دامبل، مقعد',
    difficulty: 'beginner',
    formTips_en: [
      'One hand on bench for support',
      'Back flat, parallel to floor',
      'Pull dumbbell to hip',
      'Squeeze shoulder blade'
    ],
    formTips_ar: [
      'يد واحدة على المقعد للدعم',
      'ظهر مسطح، موازي للأرض',
      'اسحب الدامبل إلى الورك',
      'اضغط على لوح الكتف'
    ],
    muscles_en: ['Lats', 'Rhomboids', 'Biceps', 'Traps'],
    muscles_ar: ['اللاتس', 'المنعرجة', 'ثنائية الذراع', 'المنشارية']
  },
  {
    id: 't-bar-row',
    name_en: 'T-Bar Row',
    name_ar: 'الجذع على شكل T',
    targetMuscle_en: 'Upper Back',
    targetMuscle_ar: 'الظهر العلوي',
    category: 'back',
    equipment_en: 'T-Bar Machine or Landmine',
    equipment_ar: 'آلة الجذع T',
    difficulty: 'intermediate',
    formTips_en: [
      'Chest against pad',
      'Pull handle to chest',
      'Squeeze shoulder blades',
      'Avoid swinging'
    ],
    formTips_ar: [
      'الصدر على الوسادة',
      'اسحب المقبض إلى الصدر',
      'اضغط على لوحي الكتف',
      'تجنب التأرجح'
    ],
    muscles_en: ['Lats', 'Rhomboids', 'Biceps', 'Middle Traps'],
    muscles_ar: ['اللاتس', 'المنعرجة', 'ثنائية الذراع', 'منتصف المنشارية']
  },
  {
    id: 'seated-cable-row',
    name_en: 'Seated Cable Row',
    name_ar: 'الجذع الجالس بالكابل',
    targetMuscle_en: 'Middle Back',
    targetMuscle_ar: 'منتصف الظهر',
    category: 'back',
    equipment_en: 'Cable Row Machine',
    equipment_ar: 'آلة الجذع بالكابل',
    difficulty: 'beginner',
    formTips_en: [
      'Sit tall, chest up',
      'Pull handle to lower ribcage',
      'Squeeze shoulder blades',
      'Avoid leaning back excessively'
    ],
    formTips_ar: [
      'اجلس منتصباً، الصدر للأعلى',
      'اسحب المقبض إلى أسفل القفص الصدري',
      'اضغط على لوحي الكتف',
      'تجنب الميل للخلف بشكل مفرط'
    ],
    muscles_en: ['Rhomboids', 'Lats', 'Biceps', 'Lower Traps'],
    muscles_ar: ['المنعرجة', 'اللاتس', 'ثنائية الذراع', 'أسفل المنشارية']
  },
  {
    id: 'lat-pulldown',
    name_en: 'Lat Pulldown',
    name_ar: 'سحب اللاتس للأسفل',
    targetMuscle_en: 'Lats',
    targetMuscle_ar: 'اللاتس',
    category: 'back',
    equipment_en: 'Lat Pulldown Machine',
    equipment_ar: 'آلة سحب اللاتس',
    difficulty: 'beginner',
    formTips_en: [
      'Wide grip on bar',
      'Pull bar to upper chest',
      'Squeeze lats',
      'Avoid leaning back too far'
    ],
    formTips_ar: [
      'قبضة عريضة على القضيب',
      'اسحب القضيب إلى الجزء العلوي من الصدر',
      'اضغط على عضلات اللاتس',
      'تجنب الميل للخلف كثيراً'
    ],
    muscles_en: ['Latissimus Dorsi', 'Biceps', 'Upper Back'],
    muscles_ar: ['العضلة الظهرية العريضة', 'ثنائية الذراع', 'الظهر العلوي']
  },
  {
    id: 'single-arm-cable-row',
    name_en: 'Single-Arm Cable Row',
    name_ar: 'الجذع ذو الذراع الواحد بالكابل',
    targetMuscle_en: 'Back',
    targetMuscle_ar: 'الظهر',
    category: 'back',
    equipment_en: 'Cable Machine',
    equipment_ar: 'آلة الكابل',
    difficulty: 'beginner',
    formTips_en: [
      'Staggered stance for balance',
      'Pull handle to hip',
      'Rotate shoulder slightly',
      'Squeeze at the end'
    ],
    formTips_ar: [
      'وقفة متداخلة للتوازن',
      'اسحب المقبض إلى الورك',
      'أدر الكتف قليلاً',
      'اضغط في النهاية'
    ],
    muscles_en: ['Lats', 'Rhomboids', 'Biceps'],
    muscles_ar: ['اللاتس', 'المنعرجة', 'ثنائية الذراع']
  },
  {
    id: 'face-pulls',
    name_en: 'Face Pulls',
    name_ar: 'سحب الوجه',
    targetMuscle_en: 'Rear Deltoids',
    targetMuscle_ar: 'الكتف الخلفي',
    category: 'back',
    equipment_en: 'Cable Machine with Rope',
    equipment_ar: 'آلة الكابل مع حبل',
    difficulty: 'beginner',
    formTips_en: [
      'Set cable at face height',
      'Pull rope towards forehead',
      'External rotation at shoulders',
      'Squeeze rear delts'
    ],
    formTips_ar: [
      'اضبط الكابل عند ارتفاع الوجه',
      'اسحب الحبل نحو الجبهة',
      'دوران خارجي عند الكتفين',
      'اضغط على الكتف الخلفي'
    ],
    muscles_en: ['Rear Deltoids', 'Upper Traps', 'Rotator Cuff'],
    muscles_ar: ['الكتف الخلفي', 'أعلى المنشارية', 'العضلة المدوّرة']
  },
  {
    id: 'superman-hold',
    name_en: 'Superman Hold',
    name_ar: 'تثبيت سوبرمان',
    targetMuscle_en: 'Lower Back',
    targetMuscle_ar: 'الظهر السفلي',
    category: 'back',
    equipment_en: 'Bodyweight',
    equipment_ar: 'وزن الجسم',
    difficulty: 'beginner',
    formTips_en: [
      'Lie face down on floor',
      'Lift arms and legs simultaneously',
      'Squeeze lower back',
      'Hold for 10-30 seconds'
    ],
    formTips_ar: [
      'استلقِ على بطنك على الأرض',
      'ارفع الذراعين والساقين في نفس الوقت',
      'اضغط على الظهر السفلي',
      'ثبّت لمدة 10-30 ثانية'
    ],
    muscles_en: ['Erector Spinae', 'Glutes', 'Hamstrings'],
    muscles_ar: ['عضلات العمود الفقري', 'الألوية', 'أوتار الركبة']
  },

  // ============ SHOULDERS EXERCISES ============
  {
    id: 'overhead-press',
    name_en: 'Overhead Press (OHP)',
    name_ar: 'الضغط العلوي',
    targetMuscle_en: 'Shoulders',
    targetMuscle_ar: 'الكتفين',
    category: 'shoulders',
    equipment_en: 'Barbell',
    equipment_ar: 'باربل',
    difficulty: 'intermediate',
    formTips_en: [
      'Grip bar slightly wider than shoulders',
      'Start at shoulder height',
      'Press directly overhead',
      'Keep core tight, avoid arching'
    ],
    formTips_ar: [
      'امسك الباربل بعرض أوسع قليلاً من الكتفين',
      'ابدأ عند مستوى الكتفين',
      'اضغط مباشرة فوق الرأس',
      'أبقِ الجذع مشدود، تجنب التقوس'
    ],
    muscles_en: ['Anterior/Medial Deltoid', 'Triceps', 'Upper Chest'],
    muscles_ar: ['الكتف الأمامي/الوسطي', 'ثلاثية الذراع', 'الصدر العلوي']
  },
  {
    id: 'dumbbell-shoulder-press',
    name_en: 'Dumbbell Shoulder Press',
    name_ar: 'ضغط الكتف بالدامبل',
    targetMuscle_en: 'Shoulders',
    targetMuscle_ar: 'الكتفين',
    category: 'shoulders',
    equipment_en: 'Dumbbells',
    equipment_ar: 'دامبل',
    difficulty: 'beginner',
    formTips_en: [
      'Sit or stand with dumbbells at shoulder level',
      'Palms facing forward',
      'Press up until arms are extended',
      'Lower with control'
    ],
    formTips_ar: [
      'اجلس أو قف مع الدمابل عند مستوى الكتف',
      'راحتي اليدين متجهتين للأمام',
      'اضغط للأعلى حتى تمتد الذراعان',
      'أنزل بتحكم'
    ],
    muscles_en: ['Medial/Anterior Deltoid', 'Triceps'],
    muscles_ar: ['الكتف الوسطي/الأمامي', 'ثلاثية الذراع']
  },
  {
    id: 'arnold-press',
    name_en: 'Arnold Press',
    name_ar: 'ضغط أرنولد',
    targetMuscle_en: 'Shoulders',
    targetMuscle_ar: 'الكتفين',
    category: 'shoulders',
    equipment_en: 'Dumbbells',
    equipment_ar: 'دامبل',
    difficulty: 'intermediate',
    formTips_en: [
      'Start with palms facing you',
      'Rotate palms outward as you press',
      'Finish with palms forward',
      'Smooth rotation throughout'
    ],
    formTips_ar: [
      'ابدأ براحة اليدين متجهتين إليك',
      'أدر راحة اليدين للخارج أثناء الضغط',
      'انته براحة اليدين للأمام',
      'دوران سلس طوال الحركة'
    ],
    muscles_en: ['Anterior/Medial Deltoid', 'Triceps', 'Upper Chest'],
    muscles_ar: ['الكتف الأمامي/الوسطي', 'ثلاثية الذراع', 'الصدر العلوي']
  },
  {
    id: 'lateral-raise',
    name_en: 'Lateral Raise',
    name_ar: 'الرفعة الجانبية',
    targetMuscle_en: 'Medial Deltoid',
    targetMuscle_ar: 'الكتف الوسطي',
    category: 'shoulders',
    equipment_en: 'Dumbbells or Cables',
    equipment_ar: 'دامبل أو كابل',
    difficulty: 'beginner',
    formTips_en: [
      'Stand tall, slight bend in elbows',
      'Raise arms to shoulder height',
      'Form a T with your body',
      'Lower slowly'
    ],
    formTips_ar: [
      'قف منتصباً، ثني طفيف في المرفقين',
      'ارفع الذراعين إلى مستوى الكتف',
      'شكل حرف T مع جسمك',
      'انزل ببطء'
    ],
    muscles_en: ['Medial Deltoid', 'Upper Traps'],
    muscles_ar: ['الكتف الوسطي', 'أعلى المنشارية']
  },
  {
    id: 'front-raise',
    name_en: 'Front Raise',
    name_ar: 'الرفعة الأمامية',
    targetMuscle_en: 'Anterior Deltoid',
    targetMuscle_ar: 'الكتف الأمامي',
    category: 'shoulders',
    equipment_en: 'Dumbbells or Barbell',
    equipment_ar: 'دامبل أو باربل',
    difficulty: 'beginner',
    formTips_en: [
      'Hold weight in front of thighs',
      'Raise arms straight in front',
      'Up to shoulder height',
      'Avoid swinging'
    ],
    formTips_ar: [
      'امسك الوزن أمام الفخذين',
      'ارفع الذراعين مستقيمين أمامك',
      'إلى مستوى الكتف',
      'تجنب التأرجح'
    ],
    muscles_en: ['Anterior Deltoid', 'Upper Chest'],
    muscles_ar: ['الكتف الأمامي', 'الصدر العلوي']
  },
  {
    id: 'rear-delt-fly',
    name_en: 'Rear Delt Fly',
    name_ar: 'فتحة الكتف الخلفي',
    targetMuscle_en: 'Rear Deltoid',
    targetMuscle_ar: 'الكتف الخلفي',
    category: 'shoulders',
    equipment_en: 'Dumbbells or Cable',
    equipment_ar: 'دامبل أو كابل',
    difficulty: 'beginner',
    formTips_en: [
      'Hinge at hips, torso nearly parallel',
      'Slight elbow bend',
      'Raise arms out to sides',
      'Squeeze rear delts at top'
    ],
    formTips_ar: [
      'ثني في الوركين، الجذع موازي تقريباً',
      'ثني طفيف في المرفقين',
      'ارفع الذراعين للجانبين',
      'اضغط على الكتف الخلفي في الأعلى'
    ],
    muscles_en: ['Rear Deltoid', 'Upper Back'],
    muscles_ar: ['الكتف الخلفي', 'الظهر العلوي']
  },
  {
    id: 'upright-row',
    name_en: 'Upright Row',
    name_ar: 'الرفعة المستقيمة',
    targetMuscle_en: 'Shoulders',
    targetMuscle_ar: 'الكتفين',
    category: 'shoulders',
    equipment_en: 'Barbell or Dumbbells',
    equipment_ar: 'باربل أو دامبل',
    difficulty: 'intermediate',
    formTips_en: [
      'Close grip on bar',
      'Pull bar up to chin level',
      'Elbows stay high',
      'Avoid internal shoulder rotation'
    ],
    formTips_ar: [
      'قبضة ضيقة على الباربل',
      'اسحب الباربل إلى مستوى الذقن',
      'المرفقان يبقيان مرتفعين',
      'تجنب الدوران الداخلي للكتف'
    ],
    muscles_en: ['Medial Deltoid', 'Traps', 'Biceps'],
    muscles_ar: ['الكتف الوسطي', 'المنشارية', 'ثنائية الذراع']
  },
  {
    id: 'shrugs',
    name_en: 'Barbell Shrugs',
    name_ar: 'رفعة الكتفين بالباربل',
    targetMuscle_en: 'Trapezius',
    targetMuscle_ar: 'المنشارية',
    category: 'shoulders',
    equipment_en: 'Barbell or Dumbbells',
    equipment_ar: 'باربل أو دامبل',
    difficulty: 'beginner',
    formTips_en: [
      'Hold bar at thigh level',
      'Shrug shoulders straight up',
      'Squeeze traps at the top',
      'Avoid rolling shoulders'
    ],
    formTips_ar: [
      'امسك الباربل عند مستوى الفخذين',
      'ارفع الكتفين مستقيمين للأعلى',
      'اضغط على المنشارية في الأعلى',
      'تجنب لف الكتفين'
    ],
    muscles_en: ['Trapezius', 'Upper Back'],
    muscles_ar: ['المنشارية', 'الظهر العلوي']
  },
  {
    id: 'dumbbell-y-raise',
    name_en: 'Dumbbell Y-Raise',
    name_ar: 'رفعة Y بالدامبل',
    targetMuscle_en: 'Shoulders',
    targetMuscle_ar: 'الكتفين',
    category: 'shoulders',
    equipment_en: 'Dumbbells, Bench',
    equipment_ar: 'دامبل، مقعد',
    difficulty: 'beginner',
    formTips_en: [
      'Lie face down on incline bench',
      'Raise arms forming Y shape',
      'Thumbs pointing up',
      'Squeeze at the top'
    ],
    formTips_ar: [
      'استلقِ على بطنك على مقعد مائل',
      'ارفع الذراعين مشكّلاً حرف Y',
      'الإبهام متجه للأعلى',
      'اضغط في الأعلى'
    ],
    muscles_en: ['Posterior Deltoid', 'Upper Traps', 'Lower Traps'],
    muscles_ar: ['الكتف الخلفي', 'أعلى المنشارية', 'أسفل المنشارية']
  },
  {
    id: 'cable-lateral-raise',
    name_en: 'Cable Lateral Raise',
    name_ar: 'الرفعة الجانبية بالكابل',
    targetMuscle_en: 'Medial Deltoid',
    targetMuscle_ar: 'الكتف الوسطي',
    category: 'shoulders',
    equipment_en: 'Cable Machine',
    equipment_ar: 'آلة الكابل',
    difficulty: 'beginner',
    formTips_en: [
      'Set cable at lowest position',
      'Stand sideways to machine',
      'Raise arm to shoulder height',
      'Constant tension throughout'
    ],
    formTips_ar: [
      'اضبط الكابل في أدنى موضع',
      'قف جانباً للآلة',
      'ارفع الذراع إلى مستوى الكتف',
      'توتر مستمر طوال الحركة'
    ],
    muscles_en: ['Medial Deltoid'],
    muscles_ar: ['الكتف الوسطي']
  },

  // ============ ARMS EXERCISES ============
  {
    id: 'barbell-bicep-curl',
    name_en: 'Barbell Bicep Curl',
    name_ar: 'ثني الذراع بالباربل',
    targetMuscle_en: 'Biceps',
    targetMuscle_ar: 'ثنائية الذراع',
    category: 'arms',
    equipment_en: 'Barbell',
    equipment_ar: 'باربل',
    difficulty: 'beginner',
    formTips_en: [
      'Stand tall, elbows at sides',
      'Curl bar up to shoulders',
      'Squeeze biceps at top',
      'Lower slowly'
    ],
    formTips_ar: [
      'قف منتصباً، المرفقان عند الجانبين',
      'ثني الباربل إلى الكتفين',
      'اضغط على ثنائية الذراع في الأعلى',
      'أنزل ببطء'
    ],
    muscles_en: ['Biceps Brachii', 'Brachialis', 'Forearms'],
    muscles_ar: ['ثنائية الذراع', 'العضلة العضدية', 'السواعد']
  },
  {
    id: 'dumbbell-bicep-curl',
    name_en: 'Dumbbell Bicep Curl',
    name_ar: 'ثني الذراع بالدامبل',
    targetMuscle_en: 'Biceps',
    targetMuscle_ar: 'ثنائية الذراع',
    category: 'arms',
    equipment_en: 'Dumbbells',
    equipment_ar: 'دامبل',
    difficulty: 'beginner',
    formTips_en: [
      'Alternate arms or do both together',
      'Elbows pinned to sides',
      'Full range of motion',
      'No swinging'
    ],
    formTips_ar: [
      'بدّل الذراعين أو افعل كلاهما معاً',
      'المرفقان مثبّتان عند الجانبين',
      'مدى كامل للحركة',
      'لا تأرجح'
    ],
    muscles_en: ['Biceps Brachii', 'Brachialis'],
    muscles_ar: ['ثنائية الذراع', 'العضلة العضدية']
  },
  {
    id: 'hammer-curl',
    name_en: 'Hammer Curl',
    name_ar: 'ثني المطرقة',
    targetMuscle_en: 'Brachialis',
    targetMuscle_ar: 'العضلة العضدية',
    category: 'arms',
    equipment_en: 'Dumbbells',
    equipment_ar: 'دامبل',
    difficulty: 'beginner',
    formTips_en: [
      'Neutral grip (palms facing each other)',
      'Curl dumbbells up',
      'Squeeze at top',
      'Lower with control'
    ],
    formTips_ar: [
      'قبضة محايدة (راحتي اليدين متجهتين لبعضهما)',
      'ثني الدمابل للأعلى',
      'اضغط في الأعلى',
      'أنزل بتحكم'
    ],
    muscles_en: ['Brachialis', 'Biceps', 'Brachioradialis'],
    muscles_ar: ['العضلة العضدية', 'ثنائية الذراع', 'العضلة العضدية الكوعية']
  },
  {
    id: 'preacher-curl',
    name_en: 'Preacher Curl',
    name_ar: 'ثني القاريء',
    targetMuscle_en: 'Biceps',
    targetMuscle_ar: 'ثنائية الذراع',
    category: 'arms',
    equipment_en: 'Preacher Bench, Barbell or EZ Bar',
    equipment_ar: 'مقعد القاريء، باربل أو قضيب EZ',
    difficulty: 'intermediate',
    formTips_en: [
      'Chest against pad, arms extended',
      'Curl bar up to shoulders',
      'Full stretch at bottom',
      'Avoid pulling back'
    ],
    formTips_ar: [
      'الصدر على الوسادة، الذراعان ممتدة',
      'ثني القضيب إلى الكتفين',
      'تمدد كامل في الأسفل',
      'تجنب السحب للخلف'
    ],
    muscles_en: ['Biceps Brachii', 'Brachialis'],
    muscles_ar: ['ثنائية الذراع', 'العضلة العضدية']
  },
  {
    id: 'concentration-curl',
    name_en: 'Concentration Curl',
    name_ar: 'ثني التركيز',
    targetMuscle_en: 'Biceps',
    targetMuscle_ar: 'ثنائية الذراع',
    category: 'arms',
    equipment_en: 'Dumbbell',
    equipment_ar: 'دامبل',
    difficulty: 'beginner',
    formTips_en: [
      'Sit, elbow on inner thigh',
      'Curl dumbbell up slowly',
      'Squeeze bicep hard',
      'Full stretch at bottom'
    ],
    formTips_ar: [
      'اجلس، المرفق على الفخذ الداخلي',
      'ثني الدامبل للأعلى ببطء',
      'اضغط على ثنائية الذراع بقوة',
      'تمدد كامل في الأسفل'
    ],
    muscles_en: ['Biceps Brachii'],
    muscles_ar: ['ثنائية الذراع']
  },
  {
    id: 'tricep-pushdown',
    name_en: 'Tricep Pushdown',
    name_ar: 'دفع ثلاثية الذراع للأسفل',
    targetMuscle_en: 'Triceps',
    targetMuscle_ar: 'ثلاثية الذراع',
    category: 'arms',
    equipment_en: 'Cable Machine',
    equipment_ar: 'آلة الكابل',
    difficulty: 'beginner',
    formTips_en: [
      'Elbows pinned to sides',
      'Push bar straight down',
      'Lock elbows at bottom',
      'Squeeze triceps'
    ],
    formTips_ar: [
      'المرفقان مثبّتان عند الجانبين',
      'ادفع القضيب مستقيماً للأسفل',
      'أقفل المرفقين في الأسفل',
      'اضغط على ثلاثية الذراع'
    ],
    muscles_en: ['Triceps Brachii (Lateral Head)'],
    muscles_ar: ['ثلاثية الذراع (الرأس الجانبي)']
  },
  {
    id: 'overhead-tricep-extension',
    name_en: 'Overhead Tricep Extension',
    name_ar: 'تمديد ثلاثية الذراع فوق الرأس',
    targetMuscle_en: 'Triceps',
    targetMuscle_ar: 'ثلاثية الذراع',
    category: 'arms',
    equipment_en: 'Dumbbell or EZ Bar',
    equipment_ar: 'دامبل أو قضيب EZ',
    difficulty: 'intermediate',
    formTips_en: [
      'Weight held overhead',
      'Lower behind head by bending elbows',
      'Keep elbows pointing up',
      'Extend arms back up'
    ],
    formTips_ar: [
      'الوزن مُمسوك فوق الرأس',
      'أنزل خلف الرأس بثني المرفقين',
      'أبقِ المرفقين متجهين للأعلى',
      'مدّ الذراعين للأعلى'
    ],
    muscles_en: ['Triceps Brachii (Long Head)'],
    muscles_ar: ['ثلاثية الذراع (الرأس الطويل)']
  },
  {
    id: 'skull-crushers',
    name_en: 'Skull Crushers',
    name_ar: 'كاسرات الجمجمة',
    targetMuscle_en: 'Triceps',
    targetMuscle_ar: 'ثلاثية الذراع',
    category: 'arms',
    equipment_en: 'EZ Bar or Dumbbells, Bench',
    equipment_ar: 'قضيب EZ أو دامبل، مقعد',
    difficulty: 'intermediate',
    formTips_en: [
      'Lie on bench, weight extended over chest',
      'Lower weight to forehead by bending elbows',
      'Keep elbows pointing up',
      'Extend back up'
    ],
    formTips_ar: [
      'استلقِ على المقعد، الوزن ممتد فوق الصدر',
      'أنزل الوزن إلى الجبهة بثني المرفقين',
      'أبقِ المرفقين متجهين للأعلى',
      'مدّ للأعلى'
    ],
    muscles_en: ['Triceps Brachii (Long/Lateral Head)'],
    muscles_ar: ['ثلاثية الذراع (الرأس الطويل/الجانبي)']
  },
  {
    id: 'close-grip-bench-press',
    name_en: 'Close-Grip Bench Press',
    name_ar: 'ضغط الصدر بقبضة ضيقة',
    targetMuscle_en: 'Triceps',
    targetMuscle_ar: 'ثلاثية الذراع',
    category: 'arms',
    equipment_en: 'Barbell, Bench',
    equipment_ar: 'باربل، مقعد',
    difficulty: 'intermediate',
    formTips_en: [
      'Grip bar shoulder-width or narrower',
      'Lower to lower chest',
      'Elbows close to body',
      'Press straight up'
    ],
    formTips_ar: [
      'امسك الباربل بعرض الكتف أو أضيق',
      'أنزل إلى أسفل الصدر',
      'المرفقان قريبان من الجسم',
      'اضغط مستقيماً للأعلى'
    ],
    muscles_en: ['Triceps Brachii', 'Chest', 'Shoulders'],
    muscles_ar: ['ثلاثية الذراع', 'الصدر', 'الكتفين']
  },
  {
    id: 'dips-triceps',
    name_en: 'Tricep Dips',
    name_ar: 'انخفاضات ثلاثية الذراع',
    targetMuscle_en: 'Triceps',
    targetMuscle_ar: 'ثلاثية الذراع',
    category: 'arms',
    equipment_en: 'Parallel Bars or Bench',
    equipment_ar: 'قضبان متوازية أو مقعد',
    difficulty: 'intermediate',
    formTips_en: [
      'Keep torso upright (lean less forward)',
      'Lower until elbows 90 degrees',
      'Focus on triceps extension',
      'Push back up'
    ],
    formTips_ar: [
      'أبقِ الجذع مستقيماً (ميل أقل للأمام)',
      'أنزل حتى تكون المرفقين بزاوية 90 درجة',
      'ركّز على تمديد ثلاثية الذراع',
      'ادفع للأعلى'
    ],
    muscles_en: ['Triceps Brachii', 'Chest'],
    muscles_ar: ['ثلاثية الذراع', 'الصدر']
  },
  {
    id: 'wrist-curl',
    name_en: 'Wrist Curl',
    name_ar: 'ثني المعصم',
    targetMuscle_en: 'Forearms',
    targetMuscle_ar: 'السواعد',
    category: 'arms',
    equipment_en: 'Barbell or Dumbbells, Bench',
    equipment_ar: 'باربل أو دامبل، مقعد',
    difficulty: 'beginner',
    formTips_en: [
      'Forearms resting on bench',
      'Wrists hanging off edge',
      'Curl wrists upward',
      'Squeeze forearms'
    ],
    formTips_ar: [
      'السواعد مستندة على المقعد',
      'المعصمان متدليان من الحافة',
      'ثني المعصمين للأعلى',
      'اضغط على السواعد'
    ],
    muscles_en: ['Wrist Flexors'],
    muscles_ar: ['ثنائيات المعصم']
  },
  {
    id: 'reverse-wrist-curl',
    name_en: 'Reverse Wrist Curl',
    name_ar: 'ثني المعصم المعكوس',
    targetMuscle_en: 'Forearms',
    targetMuscle_ar: 'السواعد',
    category: 'arms',
    equipment_en: 'Barbell or Dumbbells',
    equipment_ar: 'باربل أو دامبل',
    difficulty: 'beginner',
    formTips_en: [
      'Overhand grip on bar',
      'Forearms on bench',
      'Extend wrists upward',
      'Slow controlled movement'
    ],
    formTips_ar: [
      'قبضة من الأعلى على الباربل',
      'السواعد على المقعد',
      'مدّ المعصمين للأعلى',
      'حركة بطيئة ومتحكم فيها'
    ],
    muscles_en: ['Wrist Extensors'],
    muscles_ar: ['ممددات المعصم']
  },

  // ============ LEGS EXERCISES ============
  {
    id: 'back-squat',
    name_en: 'Back Squat',
    name_ar: 'القرفصاء الخلفي',
    targetMuscle_en: 'Quads',
    targetMuscle_ar: 'الرباعية',
    category: 'legs',
    equipment_en: 'Barbell, Squat Rack',
    equipment_ar: 'باربل، رف القرفصاء',
    difficulty: 'intermediate',
    formTips_en: [
      'Bar rests on upper back/traps',
      'Feet shoulder-width, toes slightly out',
      'Sit back, knees tracking over toes',
      'Thighs parallel to floor or lower'
    ],
    formTips_ar: [
      'الباربل مستند على الظهر العلوي/المنشارية',
      'القدمين بعرض الكتفين، أصابع القدم للخارج قليلاً',
      'اجلس للخلف، الركبتان فوق الأصابع',
      'الفخذان موازيان للأرض أو أدنى'
    ],
    muscles_en: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'],
    muscles_ar: ['الرباعية', 'الألوية', 'أوتار الركبة', 'الجذع']
  },
  {
    id: 'front-squat',
    name_en: 'Front Squat',
    name_ar: 'القرفصاء الأمامي',
    targetMuscle_en: 'Quads',
    targetMuscle_ar: 'الرباعية',
    category: 'legs',
    equipment_en: 'Barbell',
    equipment_ar: 'باربل',
    difficulty: 'advanced',
    formTips_en: [
      'Bar rests on front shoulders',
      'Cross arms or clean grip',
      'Elbows high, chest up',
      'Squat deep, upright torso'
    ],
    formTips_ar: [
      'الباربل مستند على الكتفين الأماميين',
      'تقاطع الذراعين أو قبضة الرفع النظيف',
      'المرفقان مرتفعان، الصدر للأعلى',
      'قرفصاء عميق، جذع مستقيم'
    ],
    muscles_en: ['Quadriceps', 'Core', 'Upper Back', 'Glutes'],
    muscles_ar: ['الرباعية', 'الجذع', 'الظهر العلوي', 'الألوية']
  },
  {
    id: 'romanian-deadlift',
    name_en: 'Romanian Deadlift (RDL)',
    name_ar: 'الرفعة الميتة الرومانية',
    targetMuscle_en: 'Hamstrings',
    targetMuscle_ar: 'أوتار الركبة',
    category: 'legs',
    equipment_en: 'Barbell or Dumbbells',
    equipment_ar: 'باربل أو دامبل',
    difficulty: 'intermediate',
    formTips_en: [
      'Hinge at hips, soft knees',
      'Lower bar along legs',
      'Feel stretch in hamstrings',
      'Squeeze glutes to stand'
    ],
    formTips_ar: [
      'ثني في الوركين، ركبتان مرتخيتان',
      'أنزل الباربل على طول الساقين',
      'اشعر بالتمدد في أوتار الركبة',
      'اضغط على الألوية للوقوف'
    ],
    muscles_en: ['Hamstrings', 'Glutes', 'Lower Back'],
    muscles_ar: ['أوتار الركبة', 'الألوية', 'الظهر السفلي']
  },
  {
    id: 'leg-press',
    name_en: 'Leg Press',
    name_ar: 'ضغط الساق',
    targetMuscle_en: 'Quads',
    targetMuscle_ar: 'الرباعية',
    category: 'legs',
    equipment_en: 'Leg Press Machine',
    equipment_ar: 'آلة ضغط الساق',
    difficulty: 'beginner',
    formTips_en: [
      'Sit with back flat',
      'Feet shoulder-width on platform',
      'Lower until knees ~90 degrees',
      'Push through heels'
    ],
    formTips_ar: [
      'اجلس مع ظهر مسطح',
      'القدمين بعرض الكتفين على المنصة',
      'أنزل حتى تكون الركبتان ~90 درجة',
      'ادفع من خلال الكعوب'
    ],
    muscles_en: ['Quadriceps', 'Glutes', 'Hamstrings'],
    muscles_ar: ['الرباعية', 'الألوية', 'أوتار الركبة']
  },
  {
    id: 'leg-extension',
    name_en: 'Leg Extension',
    name_ar: 'تمديد الساق',
    targetMuscle_en: 'Quads',
    targetMuscle_ar: 'الرباعية',
    category: 'legs',
    equipment_en: 'Leg Extension Machine',
    equipment_ar: 'آلة تمديد الساق',
    difficulty: 'beginner',
    formTips_en: [
      'Sit with back supported',
      'Feet under pad',
      'Extend legs until straight',
      'Squeeze quads, lower slowly'
    ],
    formTips_ar: [
      'اجلس مع ظهر مدعوم',
      'القدمين تحت الوسادة',
      'مدّ الساقين حتى تستقيم',
      'اضغط على الرباعية، أنزل ببطء'
    ],
    muscles_en: ['Quadriceps'],
    muscles_ar: ['الرباعية']
  },
  {
    id: 'leg-curl',
    name_en: 'Leg Curl',
    name_ar: 'ثني الساق',
    targetMuscle_en: 'Hamstrings',
    targetMuscle_ar: 'أوتار الركبة',
    category: 'legs',
    equipment_en: 'Leg Curl Machine',
    equipment_ar: 'آلة ثني الساق',
    difficulty: 'beginner',
    formTips_en: [
      'Lie face down on machine',
      'Heels under pad',
      'Curl heels towards glutes',
      'Squeeze hamstrings'
    ],
    formTips_ar: [
      'استلقِ على بطنك على الآلة',
      'الكعوب تحت الوسادة',
      'ثني الكعوب نحو الألوية',
      'اضغط على أوتار الركبة'
    ],
    muscles_en: ['Hamstrings', 'Glutes'],
    muscles_ar: ['أوتار الركبة', 'الألوية']
  },
  {
    id: 'lunges',
    name_en: 'Walking Lunges',
    name_ar: 'الاندواء المشي',
    targetMuscle_en: 'Quads & Glutes',
    targetMuscle_ar: 'الرباعية والألوية',
    category: 'legs',
    equipment_en: 'Bodyweight or Dumbbells',
    equipment_ar: 'وزن الجسم أو دامبل',
    difficulty: 'beginner',
    formTips_en: [
      'Step forward with one leg',
      'Lower until both knees 90 degrees',
      'Push through front heel to step through',
      'Alternate legs'
    ],
    formTips_ar: [
      'خطوة للأمام بساق واحدة',
      'أنزل حتى تكون الركبتان بزاوية 90 درجة',
      'ادفع من كعب الأمام للمضي قدماً',
      'بدّل الساقين'
    ],
    muscles_en: ['Quadriceps', 'Glutes', 'Hamstrings', 'Calves'],
    muscles_ar: ['الرباعية', 'الألوية', 'أوتار الركبة', 'الساقين']
  },
  {
    id: 'bulgarian-split-squat',
    name_en: 'Bulgarian Split Squat',
    name_ar: 'قرفصاء الانقسام البلغاري',
    targetMuscle_en: 'Quads & Glutes',
    targetMuscle_ar: 'الرباعية والألوية',
    category: 'legs',
    equipment_en: 'Bench, Dumbbells (optional)',
    equipment_ar: 'مقعد، دامبل (اختياري)',
    difficulty: 'intermediate',
    formTips_en: [
      'Rear foot elevated on bench',
      'Front foot far enough forward',
      'Lower until front thigh parallel',
      'Push through front heel'
    ],
    formTips_ar: [
      'القدم الخلفية مرتفعة على المقعد',
      'القدم الأمامية بعيدة بما يكفي للأمام',
      'أنزل حتى يكون الفخذ الأمامي موازياً',
      'ادفع من كعب القدم الأمامية'
    ],
    muscles_en: ['Quadriceps', 'Glutes', 'Hamstrings'],
    muscles_ar: ['الرباعية', 'الألوية', 'أوتار الركبة']
  },
  {
    id: 'hip-thrust',
    name_en: 'Hip Thrust',
    name_ar: 'دفع الورك',
    targetMuscle_en: 'Glutes',
    targetMuscle_ar: 'الألوية',
    category: 'legs',
    equipment_en: 'Barbell, Bench',
    equipment_ar: 'باربل، مقعد',
    difficulty: 'intermediate',
    formTips_en: [
      'Upper back on bench',
      'Bar across hips (use pad)',
      'Feet flat on floor',
      'Drive hips up, squeeze glutes hard'
    ],
    formTips_ar: [
      'الظهر العلوي على المقعد',
      'الباربل عبر الوركين (استخدم وسادة)',
      'القدمين مسطحتين على الأرض',
      'ادفع الوركين للأعلى، اضغط على الألوية بقوة'
    ],
    muscles_en: ['Glutes', 'Hamstrings', 'Quads'],
    muscles_ar: ['الألوية', 'أوتار الركبة', 'الرباعية']
  },
  {
    id: 'calf-raise',
    name_en: 'Standing Calf Raise',
    name_ar: 'رفعة الساق الواقفة',
    targetMuscle_en: 'Calves',
    targetMuscle_ar: 'الساقين',
    category: 'legs',
    equipment_en: 'Calf Raise Machine or Barbell',
    equipment_ar: 'آلة رفعة الساق أو باربل',
    difficulty: 'beginner',
    formTips_en: [
      'Stand on balls of feet',
      'Lower heels below step level',
      'Raise up onto toes',
      'Squeeze calves at top'
    ],
    formTips_ar: [
      'قف على كرات القدم',
      'أنزل الكعوب تحت مستوى الدرجة',
      'ارفع على الأصابع',
      'اضغط على الساقين في الأعلى'
    ],
    muscles_en: ['Gastrocnemius', 'Soleus'],
    muscles_ar: ['السمانية', 'العضلة السمكية']
  },
  {
    id: 'seated-calf-raise',
    name_en: 'Seated Calf Raise',
    name_ar: 'رفعة الساق الجالس',
    targetMuscle_en: 'Soleus',
    targetMuscle_ar: 'العضلة السمكية',
    category: 'legs',
    equipment_en: 'Seated Calf Machine',
    equipment_ar: 'آلة رفعة الساق الجالس',
    difficulty: 'beginner',
    formTips_en: [
      'Sit with knees bent 90 degrees',
      'Feet on platform, balls of feet',
      'Lower heels for stretch',
      'Press up onto toes'
    ],
    formTips_ar: [
      'اجلس مع ثني الركبتين بزاوية 90 درجة',
      'القدمين على المنصة، كرات القدم',
      'أنزل الكعوب للتمدد',
      'اضغط للأعلى على الأصابع'
    ],
    muscles_en: ['Soleus'],
    muscles_ar: ['العضلة السمكية']
  },
  {
    id: 'glute-bridge',
    name_en: 'Glute Bridge',
    name_ar: 'جسر الألوية',
    targetMuscle_en: 'Glutes',
    targetMuscle_ar: 'الألوية',
    category: 'legs',
    equipment_en: 'Bodyweight or Barbell',
    equipment_ar: 'وزن الجسم أو باربل',
    difficulty: 'beginner',
    formTips_en: [
      'Lie on back, knees bent',
      'Feet flat on floor',
      'Lift hips toward ceiling',
      'Squeeze glutes at top'
    ],
    formTips_ar: [
      'استلقِ على ظهرك، الركبتان مثنيتان',
      'القدمين مسطحتين على الأرض',
      'ارفع الوركين نحو السقف',
      'اضغط على الألوية في الأعلى'
    ],
    muscles_en: ['Glutes', 'Hamstrings', 'Core'],
    muscles_ar: ['الألوية', 'أوتار الركبة', 'الجذع']
  },
  {
    id: 'step-ups',
    name_en: 'Step-Ups',
    name_ar: 'صعود الدرجات',
    targetMuscle_en: 'Quads & Glutes',
    targetMuscle_ar: 'الرباعية والألوية',
    category: 'legs',
    equipment_en: 'Step Box or Bench',
    equipment_ar: 'صندوق خطوات أو مقعد',
    difficulty: 'beginner',
    formTips_en: [
      'Place one foot on box',
      'Push through heel to lift body up',
      'Bring second foot on top',
      'Lower with control, alternate'
    ],
    formTips_ar: [
      'ضع قدم واحدة على الصندوق',
      'ادفع من خلال الكعب لرفع الجسم',
      'أحضر القدم الثانية إلى الأعلى',
      'انزل بتحكم، بدّل'
    ],
    muscles_en: ['Quadriceps', 'Glutes', 'Hamstrings'],
    muscles_ar: ['الرباعية', 'الألوية', 'أوتار الركبة']
  },

  // ============ CORE EXERCISES ============
  {
    id: 'plank',
    name_en: 'Plank',
    name_ar: 'اللوح',
    targetMuscle_en: 'Core',
    targetMuscle_ar: 'الجذع',
    category: 'core',
    equipment_en: 'Bodyweight',
    equipment_ar: 'وزن الجسم',
    difficulty: 'beginner',
    formTips_en: [
      'Forearms on floor, elbows under shoulders',
      'Body in straight line',
      'Engage core and glutes',
      'Breathe steadily'
    ],
    formTips_ar: [
      'الساعدان على الأرض، المرفقان تحت الكتفين',
      'الجسم في خط مستقيم',
      'شغّل الجذع والألوية',
      'تنفس بانتظام'
    ],
    muscles_en: ['Rectus Abdominis', 'Transverse Abdominis', 'Obliques'],
    muscles_ar: ['البطنية المستقيمة', 'البطنية المستعرضة', 'المائلة']
  },
  {
    id: 'crunches',
    name_en: 'Crunches',
    name_ar: 'اللفات البطنية',
    targetMuscle_en: 'Abs',
    targetMuscle_ar: 'البطن',
    category: 'core',
    equipment_en: 'Bodyweight',
    equipment_ar: 'وزن الجسم',
    difficulty: 'beginner',
    formTips_en: [
      'Lie on back, knees bent',
      'Hands behind head or crossed',
      'Lift shoulder blades off floor',
      'Lower with control'
    ],
    formTips_ar: [
      'استلقِ على ظهرك، الركبتان مثنيتان',
      'اليدان خلف الرأس أو متقاطعتان',
      'ارفع لوحي الكتف عن الأرض',
      'أنزل بتحكم'
    ],
    muscles_en: ['Rectus Abdominis'],
    muscles_ar: ['البطنية المستقيمة']
  },
  {
    id: 'russian-twist',
    name_en: 'Russian Twist',
    name_ar: 'الالتواء الروسي',
    targetMuscle_en: 'Obliques',
    targetMuscle_ar: 'المائلة',
    category: 'core',
    equipment_en: 'Bodyweight or Weight Plate',
    equipment_ar: 'وزن الجسم أو قرص وزن',
    difficulty: 'beginner',
    formTips_en: [
      'Lean back 45 degrees, feet lifted',
      'Hold weight with both hands',
      'Twist torso side to side',
      'Keep core tight'
    ],
    formTips_ar: [
      'ميل للخلف 45 درجة، القدمين مرفوعتان',
      'امسك الوزن بكلتا يديك',
      'أدر الجذع من جانب لجانب',
      'أبقِ الجذع مشدود'
    ],
    muscles_en: ['Obliques', 'Rectus Abdominis', 'Transverse Abdominis'],
    muscles_ar: ['المائلة', 'البطنية المستقيمة', 'البطنية المستعرضة']
  },
  {
    id: 'leg-raises',
    name_en: 'Hanging Leg Raises',
    name_ar: 'رفعة الساقين المعلقة',
    targetMuscle_en: 'Lower Abs',
    targetMuscle_ar: 'أسفل البطن',
    category: 'core',
    equipment_en: 'Pull-Up Bar',
    equipment_ar: 'قضيب الشد',
    difficulty: 'intermediate',
    formTips_en: [
      'Hang from bar, straight legs',
      'Raise legs to hip level or higher',
      'Control the descent',
      'Avoid swinging'
    ],
    formTips_ar: [
      'علّق من القضيب، ساقان مستقيمتان',
      'ارفع الساقين إلى مستوى الورك أو أعلى',
      'تحكم في النزول',
      'تجنب التأرجح'
    ],
    muscles_en: ['Lower Rectus Abdominis', 'Hip Flexors'],
    muscles_ar: ['أسفل البطنية المستقيمة', 'ثنائيات الورك']
  },
  {
    id: 'side-plank',
    name_en: 'Side Plank',
    name_ar: 'اللوح الجانبي',
    targetMuscle_en: 'Obliques',
    targetMuscle_ar: 'المائلة',
    category: 'core',
    equipment_en: 'Bodyweight',
    equipment_ar: 'وزن الجسم',
    difficulty: 'intermediate',
    formTips_en: [
      'Stack feet, prop on elbow',
      'Body in straight line',
      'Lift hips off floor',
      'Hold position'
    ],
    formTips_ar: [
      'القدمين مكدستين، ارتكاز على المرفق',
      'الجسم في خط مستقيم',
      'ارفع الوركين عن الأرض',
      'ثبّت في الوضعية'
    ],
    muscles_en: ['Obliques', 'Transverse Abdominis', 'Glutes'],
    muscles_ar: ['المائلة', 'البطنية المستعرضة', 'الألوية']
  },
  {
    id: 'bicycle-crunches',
    name_en: 'Bicycle Crunches',
    name_ar: 'لفات الدراجة',
    targetMuscle_en: 'Abs & Obliques',
    targetMuscle_ar: 'البطن والمائلة',
    category: 'core',
    equipment_en: 'Bodyweight',
    equipment_ar: 'وزن الجسم',
    difficulty: 'beginner',
    formTips_en: [
      'Hands behind head, knees lifted',
      'Elbow to opposite knee',
      'Alternate in pedaling motion',
      'Keep core engaged'
    ],
    formTips_ar: [
      'اليدان خلف الرأس، الركبتان مرفوعتان',
      'المرفق إلى الركبة المقابلة',
      'بدّل في حركة الدواسة',
      'أبقِ الجذع مشدود'
    ],
    muscles_en: ['Rectus Abdominis', 'Obliques', 'Hip Flexors'],
    muscles_ar: ['البطنية المستقيمة', 'المائلة', 'ثنائيات الورك']
  },
  {
    id: 'hollow-body-hold',
    name_en: 'Hollow Body Hold',
    name_ar: 'تثبيت الجسم المجوف',
    targetMuscle_en: 'Core',
    targetMuscle_ar: 'الجذع',
    category: 'core',
    equipment_en: 'Bodyweight',
    equipment_ar: 'وزن الجسم',
    difficulty: 'intermediate',
    formTips_en: [
      'Lie on back, legs and arms extended',
      'Press lower back into floor',
      'Lift shoulders and legs slightly',
      'Hold shape'
    ],
    formTips_ar: [
      'استلقِ على ظهرك، الساقين والذراعين ممتدة',
      'اضغط الظهر السفلي على الأرض',
      'ارفع الكتفين والساقين قليلاً',
      'ثبّت في الشكل'
    ],
    muscles_en: ['Transverse Abdominis', 'Rectus Abdominis', 'Hip Flexors'],
    muscles_ar: ['البطنية المستعرضة', 'البطنية المستقيمة', 'ثنائيات الورك']
  },
  {
    id: 'mountain-climbers',
    name_en: 'Mountain Climbers',
    name_ar: 'تسلق الجبال',
    targetMuscle_en: 'Core',
    targetMuscle_ar: 'الجذع',
    category: 'core',
    equipment_en: 'Bodyweight',
    equipment_ar: 'وزن الجسم',
    difficulty: 'beginner',
    formTips_en: [
      'Start in push-up position',
      'Drive knees toward chest quickly',
      'Alternate legs',
      'Keep hips low, core tight'
    ],
    formTips_ar: [
      'ابدأ في وضعية الضغط',
      'ادفع الركبتين نحو الصدر بسرعة',
      'بدّل الساقين',
      'أبقِ الوركين منخفضتين، الجذع مشدود'
    ],
    muscles_en: ['Rectus Abdominis', 'Obliques', 'Hip Flexors', 'Shoulders'],
    muscles_ar: ['البطنية المستقيمة', 'المائلة', 'ثنائيات الورك', 'الكتفين']
  },
  {
    id: 'dead-bug',
    name_en: 'Dead Bug',
    name_ar: 'الحشرة الميتة',
    targetMuscle_en: 'Core',
    targetMuscle_ar: 'الجذع',
    category: 'core',
    equipment_en: 'Bodyweight',
    equipment_ar: 'وزن الجسم',
    difficulty: 'beginner',
    formTips_en: [
      'Lie on back, arms up, knees bent 90°',
      'Lower opposite arm and leg',
      'Keep lower back pressed down',
      'Alternate sides'
    ],
    formTips_ar: [
      'استلقِ على ظهرك، ذراعان للأعلى، ركبتان مثنيتان 90°',
      'أنزل الذراع والساق المقابلين',
      'أبقِ الظهر السفلي مضغوطاً للأسفل',
      'بدّل الجانبين'
    ],
    muscles_en: ['Transverse Abdominis', 'Rectus Abdominis'],
    muscles_ar: ['البطنية المستعرضة', 'البطنية المستقيمة']
  },
  {
    id: 'v-ups',
    name_en: 'V-Ups',
    name_ar: 'رفعة V',
    targetMuscle_en: 'Abs',
    targetMuscle_ar: 'البطن',
    category: 'core',
    equipment_en: 'Bodyweight',
    equipment_ar: 'وزن الجسم',
    difficulty: 'advanced',
    formTips_en: [
      'Lie on back, arms overhead',
      'Simultaneously lift torso and legs',
      'Form a V shape',
      'Touch toes if possible'
    ],
    formTips_ar: [
      'استلقِ على ظهرك، ذراعان فوق الرأس',
      'ارفع الجذع والساقين في نفس الوقت',
      'شكل حرف V',
      'المس أصابع القدم إن أمكن'
    ],
    muscles_en: ['Rectus Abdominis', 'Hip Flexors'],
    muscles_ar: ['البطنية المستقيمة', 'ثنائيات الورك']
  },

  // ============ CARDIO EXERCISES ============
  {
    id: 'running',
    name_en: 'Running',
    name_ar: 'الجري',
    targetMuscle_en: 'Full Body (Cardio)',
    targetMuscle_ar: 'الجسم كله (كارديو)',
    category: 'cardio',
    equipment_en: 'None or Running Shoes',
    equipment_ar: 'لا شيء أو أحذية الجري',
    difficulty: 'beginner',
    formTips_en: [
      'Land on mid-foot',
      'Keep torso upright',
      'Swing arms naturally',
      'Breathe in rhythm'
    ],
    formTips_ar: [
      'الهبوط على منتصف القدم',
      'أبقِ الجذع منتصباً',
      'هزّ الذراعين بشكل طبيعي',
      'تنفس على الإيقاع'
    ],
    muscles_en: ['Quads', 'Hamstrings', 'Calves', 'Glutes', 'Cardiovascular System'],
    muscles_ar: ['الرباعية', 'أوتار الركبة', 'الساقين', 'الألوية', 'الجهاز الدوري']
  },
  {
    id: 'jumping-jacks',
    name_en: 'Jumping Jacks',
    name_ar: 'النط العقبي',
    targetMuscle_en: 'Full Body (Cardio)',
    targetMuscle_ar: 'الجسم كله (كارديو)',
    category: 'cardio',
    equipment_en: 'Bodyweight',
    equipment_ar: 'وزن الجسم',
    difficulty: 'beginner',
    formTips_en: [
      'Jump feet out while raising arms',
      'Land softly on balls of feet',
      'Jump back to start',
      'Keep breathing steady'
    ],
    formTips_ar: [
      'اقفز بالقدمين للخارج مع رفع الذراعين',
      'اهبط برفق على كرات القدم',
      'اقفز للعودة إلى البداية',
      'أبقِ التنفس منتظماً'
    ],
    muscles_en: ['Shoulders', 'Hip Abductors', 'Cardiovascular System'],
    muscles_ar: ['الكتفين', 'مباعدات الورك', 'الجهاز الدوري']
  },
  {
    id: 'burpees',
    name_en: 'Burpees',
    name_ar: 'البربي',
    targetMuscle_en: 'Full Body (Cardio)',
    targetMuscle_ar: 'الجسم كله (كارديو)',
    category: 'cardio',
    equipment_en: 'Bodyweight',
    equipment_ar: 'وزن الجسم',
    difficulty: 'advanced',
    formTips_en: [
      'Squat down, hands on floor',
      'Kick feet back to plank',
      'Do a push-up (optional)',
      'Jump feet in, jump up with hands overhead'
    ],
    formTips_ar: [
      'قرفصاء للأسفل، اليدان على الأرض',
      'اركل القدمين للخلف إلى لوح',
      'افعل ضغط (اختياري)',
      'اقفز بالقدمين للداخل، قفز للأعلى مع ذراعين فوق الرأس'
    ],
    muscles_en: ['Full Body', 'Cardiovascular System'],
    muscles_ar: ['الجسم كله', 'الجهاز الدوري']
  },
  {
    id: 'cycling',
    name_en: 'Cycling',
    name_ar: 'ركوب الدراجة',
    targetMuscle_en: 'Lower Body (Cardio)',
    targetMuscle_ar: 'الجزء السفلي (كارديو)',
    category: 'cardio',
    equipment_en: 'Stationary Bike or Bicycle',
    equipment_ar: 'دراجة ثابتة أو دراجة',
    difficulty: 'beginner',
    formTips_en: [
      'Adjust seat height correctly',
      'Knee slightly bent at bottom of stroke',
      'Keep cadence steady (80-90 RPM)',
      'Sit upright or lean forward slightly'
    ],
    formTips_ar: [
      'اضبط ارتفاع المقعد بشكل صحيح',
      'الركبة منحنية قليلاً في أسفل الدورة',
      'أبقِ الإيقاع منتظماً (80-90 دورة/دقيقة)',
      'اجلس منتصباً أو مائل للأمام قليلاً'
    ],
    muscles_en: ['Quads', 'Hamstrings', 'Glutes', 'Calves'],
    muscles_ar: ['الرباعية', 'أوتار الركبة', 'الألوية', 'الساقين']
  },
  {
    id: 'rowing',
    name_en: 'Rowing Machine',
    name_ar: 'آلة التجديف',
    targetMuscle_en: 'Full Body (Cardio)',
    targetMuscle_ar: 'الجسم كله (كارديو)',
    category: 'cardio',
    equipment_en: 'Rowing Machine',
    equipment_ar: 'آلة التجديف',
    difficulty: 'intermediate',
    formTips_en: [
      'Start with legs compressed, arms extended',
      'Drive with legs first',
      'Then lean back, pull handle to chest',
      'Reverse order to return'
    ],
    formTips_ar: [
      'ابدأ مع ضغط الساقين، ذراعين ممتدة',
      'ادفع بالساقين أولاً',
      'ثم ميل للخلف، اسحب المقبض إلى الصدر',
      'عكس الترتيب للعودة'
    ],
    muscles_en: ['Legs', 'Back', 'Arms', 'Core'],
    muscles_ar: ['الساقين', 'الظهر', 'الذراعين', 'الجذع']
  },
  {
    id: 'jump-rope',
    name_en: 'Jump Rope',
    name_ar: 'حبل القفز',
    targetMuscle_en: 'Full Body (Cardio)',
    targetMuscle_ar: 'الجسم كله (كارديو)',
    category: 'cardio',
    equipment_en: 'Jump Rope',
    equipment_ar: 'حبل القفز',
    difficulty: 'beginner',
    formTips_en: [
      'Light grip on handles',
      'Elbows close to body',
      'Small jumps, just clear the rope',
      'Land softly on balls of feet'
    ],
    formTips_ar: [
      'قبضة خفيفة على المقابض',
      'المرفقان قريبان من الجسم',
      'قفزات صغيرة، تجاوز الحبل فقط',
      'اهبط برفق على كرات القدم'
    ],
    muscles_en: ['Calves', 'Shoulders', 'Cardiovascular System'],
    muscles_ar: ['الساقين', 'الكتفين', 'الجهاز الدوري']
  },
  {
    id: 'high-knees',
    name_en: 'High Knees',
    name_ar: 'الركبتان العاليتان',
    targetMuscle_en: 'Lower Body (Cardio)',
    targetMuscle_ar: 'الجزء السفلي (كارديو)',
    category: 'cardio',
    equipment_en: 'Bodyweight',
    equipment_ar: 'وزن الجسم',
    difficulty: 'beginner',
    formTips_en: [
      'Run in place',
      'Lift knees to hip height',
      'Pump arms with knees',
      'Stay on balls of feet'
    ],
    formTips_ar: [
      'اركض في مكانك',
      'ارفع الركبتين إلى مستوى الورك',
      'هزّ الذراعين مع الركبتين',
      'ابقَ على كرات القدم'
    ],
    muscles_en: ['Hip Flexors', 'Quads', 'Calves', 'Cardiovascular System'],
    muscles_ar: ['ثنائيات الورك', 'الرباعية', 'الساقين', 'الجهاز الدوري']
  },
  {
    id: 'stair-climber',
    name_en: 'Stair Climber',
    name_ar: 'آلة صعود السلالم',
    targetMuscle_en: 'Lower Body (Cardio)',
    targetMuscle_ar: 'الجزء السفلي (كارديو)',
    category: 'cardio',
    equipment_en: 'Stair Climber Machine',
    equipment_ar: 'آلة صعود السلالم',
    difficulty: 'intermediate',
    formTips_en: [
      'Step through entire foot',
      'Avoid leaning on handles too much',
      'Upright posture',
      'Squeeze glutes on each step'
    ],
    formTips_ar: [
      'اركب بالقدم كاملة',
      'تجنب الاعتماد على المقابض كثيراً',
      'وضعية منتصبة',
      'اضغط على الألوية في كل درجة'
    ],
    muscles_en: ['Quads', 'Glutes', 'Hamstrings', 'Calves'],
    muscles_ar: ['الرباعية', 'الألوية', 'أوتار الركبة', 'الساقين']
  },
  {
    id: 'box-jumps',
    name_en: 'Box Jumps',
    name_ar: 'قفز الصندوق',
    targetMuscle_en: 'Full Body (Cardio/Plyo)',
    targetMuscle_ar: 'الجسم كله (كارديو/بليو)',
    category: 'cardio',
    equipment_en: 'Plyometric Box or Bench',
    equipment_ar: 'صندوق بليومتري أو مقعد',
    difficulty: 'advanced',
    formTips_en: [
      'Stand with feet shoulder-width',
      'Swing arms back for momentum',
      'Jump and land softly on box',
      'Step down, don\'t jump down'
    ],
    formTips_ar: [
      'قف بالقدمين بعرض الكتفين',
      'هزّ الذراعين للخلف للزخم',
      'اقفز واهبط برفق على الصندوق',
      'انزل خطوات، لا تقفز للأسفل'
    ],
    muscles_en: ['Quads', 'Glutes', 'Calves', 'Cardiovascular System'],
    muscles_ar: ['الرباعية', 'الألوية', 'الساقين', 'الجهاز الدوري']
  },
  {
    id: 'swimming',
    name_en: 'Swimming (Laps)',
    name_ar: 'السباحة (لفات)',
    targetMuscle_en: 'Full Body (Cardio)',
    targetMuscle_ar: 'الجسم كله (كارديو)',
    category: 'cardio',
    equipment_en: 'Pool, Swimsuit, Goggles',
    equipment_ar: 'مسبح، ملابس سباحة، نظارات سباحة',
    difficulty: 'intermediate',
    formTips_en: [
      'Exhale underwater, inhale above surface',
      'Keep body horizontal and streamlined',
      'Strong hip rotation (freestyle)',
      'Continuous, smooth strokes'
    ],
    formTips_ar: [
      'ازفر تحت الماء، استنشق فوق السطح',
      'أبقِ الجسم أفقيًا ومبسطًا',
      'دوران قوي للورك (السباحة الحرة)',
      'ضربات مستمرة وسلسة'
    ],
    muscles_en: ['Full Body', 'Cardiovascular System'],
    muscles_ar: ['الجسم كله', 'الجهاز الدوري']
  }
];

export const getExerciseById = (id: string): Exercise | undefined => {
  return exercises.find((e) => e.id === id);
};

export const getExercisesByCategory = (category: Exercise['category']): Exercise[] => {
  return exercises.filter((e) => e.category === category);
};

export const getExercisesByDifficulty = (difficulty: Exercise['difficulty']): Exercise[] => {
  return exercises.filter((e) => e.difficulty === difficulty);
};

export const getExercisesByMuscle = (muscle: string): Exercise[] => {
  return exercises.filter(
    (e) =>
      e.muscles_en.some((m) => m.toLowerCase().includes(muscle.toLowerCase())) ||
      e.targetMuscle_en.toLowerCase().includes(muscle.toLowerCase())
  );
};
