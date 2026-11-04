import type { L10n } from "./i18n";

export type CategoryId =
  | "calculators"
  | "text"
  | "converters"
  | "generators"
  | "pdf"
  | "image";

export interface Category {
  id: CategoryId;
  icon: string;
  title: L10n;
  desc: L10n;
}

export interface ToolMeta {
  slug: string;
  category: CategoryId;
  icon: string;
  title: L10n;
  desc: L10n;
  keywords: { ar: string[]; en: string[] };
}

export const CATEGORIES: Category[] = [
  {
    id: "calculators",
    icon: "🧮",
    title: { ar: "حاسبات", en: "Calculators" },
    desc: {
      ar: "حاسبات يومية دقيقة: BMI، GPA، القروض، الرواتب، الزكاة وأقساط السيارات.",
      en: "Everyday calculators: BMI, GPA, loans, salaries, zakat and car installments.",
    },
  },
  {
    id: "text",
    icon: "✍️",
    title: { ar: "أدوات النصوص", en: "Text Tools" },
    desc: {
      ar: "عدّ الكلمات، تنظيف النصوص، تغيير حالة الأحرف وإحصائيات النص.",
      en: "Word counting, text cleaning, case conversion and text statistics.",
    },
  },
  {
    id: "converters",
    icon: "🔄",
    title: { ar: "محوّلات", en: "Converters" },
    desc: {
      ar: "محوّل الوحدات، محول العملات بأسعار مباشرة، ومحول المناطق الزمنية.",
      en: "Unit converter, live currency converter and time zone converter.",
    },
  },
  {
    id: "generators",
    icon: "⚡",
    title: { ar: "مولّدات", en: "Generators" },
    desc: {
      ar: "مولّد رمز QR، مولّد كلمات مرور قوية، ومولّد معرّفات UUID.",
      en: "QR code generator, strong password generator and UUID generator.",
    },
  },
  {
    id: "pdf",
    icon: "📄",
    title: { ar: "أدوات PDF", en: "PDF Tools" },
    desc: {
      ar: "دمج وتقسيم وضغط وتدوير ملفات PDF، تحويل الصور إلى PDF واستخراج النصوص.",
      en: "Merge, split, compress and rotate PDFs, images to PDF, and text extraction.",
    },
  },
  {
    id: "image",
    icon: "🖼️",
    title: { ar: "أدوات الصور", en: "Image Tools" },
    desc: {
      ar: "ضغط الصور، تغيير الحجم، تحويل الصيغ وتحويل الصور إلى Base64.",
      en: "Compress, resize and convert images, plus image to Base64.",
    },
  },
];

export const TOOLS: ToolMeta[] = [
  // ---------------- calculators ----------------
  {
    slug: "bmi-calculator",
    category: "calculators",
    icon: "⚖️",
    title: { ar: "حاسبة BMI — مؤشر كتلة الجسم", en: "BMI Calculator — Body Mass Index" },
    desc: {
      ar: "احسب مؤشر كتلة الجسم BMI من الطول والوزن، واعرف فئتك (نقص وزن، طبيعي، زيادة، سمنة) والوزن المثالي لطولك.",
      en: "Calculate your body mass index from height and weight, see your category and the healthy weight range for your height.",
    },
    keywords: {
      ar: ["حاسبة BMI", "مؤشر كتلة الجسم", "حاسبة كتلة الجسم", "الوزن المثالي", "حاسبة الوزن"],
      en: ["bmi calculator", "body mass index", "bmi chart", "ideal weight calculator"],
    },
  },
  {
    slug: "gpa-calculator",
    category: "calculators",
    icon: "🎓",
    title: { ar: "حاسبة GPA — المعدل التراكمي", en: "GPA Calculator — Cumulative Grade Point" },
    desc: {
      ar: "احسب معدلك التراكمي GPA من الساعات المعتمدة ونقاط الدرجات، مع دعم إضافة مادة غير محدودة.",
      en: "Calculate your cumulative GPA from credit hours and grade points, with unlimited courses.",
    },
    keywords: {
      ar: ["حاسبة GPA", "المعدل التراكمي", "حساب المعدل الجامعي", "التقدير الجامعي"],
      en: ["gpa calculator", "cumulative gpa", "grade point average", "college gpa"],
    },
  },
  {
    slug: "loan-calculator",
    category: "calculators",
    icon: "🏦",
    title: { ar: "حاسبة القروض والأقساط الشهرية", en: "Loan & Mortgage Installment Calculator" },
    desc: {
      ar: "احسب القسط الشهري للقرض أو التمويل العقاري، وإجمالي المبلغ المدفوع وقيمة الفائدة خلال مدة التمويل.",
      en: "Calculate the monthly installment for a loan or mortgage, total payments and total interest over the term.",
    },
    keywords: {
      ar: ["حاسبة القرض", "القسط الشهري", "تمويل عقاري", "حاسبة الفائدة", "أقساط القرض"],
      en: ["loan calculator", "mortgage calculator", "monthly installment", "loan interest"],
    },
  },
  {
    slug: "salary-calculator",
    category: "calculators",
    icon: "💼",
    title: { ar: "حاسبة الراتب — الأساسي والبدلات والاقتطاعات", en: "Salary Calculator — Basic, Allowances & Deductions" },
    desc: {
      ar: "تفكيك الراتب: الأساسي، بدل السكن والمواصلات، التأمينات الاجتماعية، وصافي الراتب بعد الاقتطاعات.",
      en: "Break down your salary: basic pay, housing and transport allowances, social insurance and net pay after deductions.",
    },
    keywords: {
      ar: ["حاسبة الراتب", "صافي الراتب", "بدل السكن", "التأمينات الاجتماعية", "راتب"],
      en: ["salary calculator", "net salary", "salary breakdown", "gross pay calculator"],
    },
  },
  {
    slug: "zakat-calculator",
    category: "calculators",
    icon: "🌙",
    title: { ar: "حاسبة الزكاة", en: "Zakat Calculator" },
    desc: {
      ar: "احسب زكاة المال بنسبة 2.5% من صافي الأموال (نقد، ذهب، بضائع، ديون مستحقة) بعد مطابقة النصاب.",
      en: "Calculate zakat at 2.5% of net wealth (cash, gold, inventory, receivables) after applying the nisab threshold.",
    },
    keywords: {
      ar: ["حاسبة الزكاة", "زكاة المال", "النصاب", "زكاة الذهب", "حساب الزكاة"],
      en: ["zakat calculator", "zakat on wealth", "nisab", "zakat money calculator"],
    },
  },
  {
    slug: "car-installment-calculator",
    category: "calculators",
    icon: "🚗",
    title: { ar: "حاسبة أقساط السيارات", en: "Car Installment Calculator" },
    desc: {
      ar: "احسب القسط الشهري لشراء السيارة: سعر السيارة، المقدم، نسبة الفائدة ومدة التمويل بالشهور.",
      en: "Calculate your monthly car installment: car price, down payment, interest rate and financing term in months.",
    },
    keywords: {
      ar: ["أقساط السيارات", "حاسبة تقسيط السيارة", "تمويل سيارات", "قسط السيارة الشهري"],
      en: ["car installment calculator", "car finance calculator", "auto loan calculator"],
    },
  },

  // ---------------- text ----------------
  {
    slug: "word-counter",
    category: "text",
    icon: "🔢",
    title: { ar: "عدّاد الكلمات والأحرف", en: "Word & Character Counter" },
    desc: {
      ar: "عدّاد كلمات وأحرف وجمل وفقرات فوري مع وقت القراءة والكلام المقدر — مثالي للمقالات والتدوين والسيرة الذاتية.",
      en: "Instant word, character, sentence and paragraph counter with estimated reading and speaking time.",
    },
    keywords: {
      ar: ["عداد الكلمات", "عد الاحرف", "عداد كلمات", "وقت القراءة", "كلمات المقال"],
      en: ["word counter", "character counter", "word count tool", "reading time"],
    },
  },
  {
    slug: "case-converter",
    category: "text",
    icon: "Aa",
    title: { ar: "محول حالة الأحرف", en: "Text Case Converter" },
    desc: {
      ar: "حوّل النص إلى أحرف كبيرة أو صغيرة، أو صيغة العنوان أو الجملة، مع نسخة متبادلة الأحرف بضغطة واحدة.",
      en: "Convert text to UPPERCASE, lowercase, Title Case, Sentence case or aLtErNaTiNg case instantly.",
    },
    keywords: {
      ar: ["تحويل الاحرف الكبيرة", "حالة الاحرف", "uppercase عربي", "تحويل النص"],
      en: ["text case converter", "uppercase lowercase", "title case converter"],
    },
  },
  {
    slug: "text-cleaner",
    category: "text",
    icon: "🧹",
    title: { ar: "تنظيف النصوص والمسافات", en: "Whitespace & Line Break Cleaner" },
    desc: {
      ar: "نظّف المسافات الزائدة والأسطر الفارغة وفواصل الأسطر، وأزل المحارف المخفية (Zero-Width) بضغطة واحدة.",
      en: "Clean up extra spaces, empty lines and line breaks, and strip hidden zero-width characters in one click.",
    },
    keywords: {
      ar: ["تنظيف النص", "حذف المسافات الزائدة", "حذف الاحرف المخفية", "ترتيب الافكار"],
      en: ["remove extra spaces", "whitespace cleaner", "remove line breaks", "clean text online"],
    },
  },
  {
    slug: "text-statistics",
    category: "text",
    icon: "📊",
    title: { ar: "إحصائيات النص", en: "Text Statistics" },
    desc: {
      ar: "تحليل إحصائي كامل للنص: الكلمات الفريدة، متوسط طول الكلمة والجملة، أطول كلمة، وتكرار الكلمات الأكثر استخدامًا.",
      en: "Full text analysis: unique words, average word and sentence length, longest word and most frequent words.",
    },
    keywords: {
      ar: ["احصائيات النص", "تحليل النص", "تكرار الكلمات", "تحليل نص عربي"],
      en: ["text statistics", "text analysis", "word frequency counter"],
    },
  },

  // ---------------- converters ----------------
  {
    slug: "unit-converter",
    category: "converters",
    icon: "📐",
    title: { ar: "محول الوحدات", en: "Unit Converter" },
    desc: {
      ar: "تحويل سريع بين وحدات الطول والوزن والحرارة (متر، كيلومتر، باوند، كيلوغرام، سيليزية، فهرنهايت...) بدقة عالية.",
      en: "Fast conversion between length, weight and temperature units (meter, km, pound, kg, Celsius, Fahrenheit...).",
    },
    keywords: {
      ar: ["محول الوحدات", "تحويل الوحدات", "تحويل المتر الى كيلومتر", "تحويل كيلو الى باوند", "تحويل درجة الحرارة"],
      en: ["unit converter", "length converter", "weight converter", "temperature converter"],
    },
  },
  {
    slug: "currency-converter",
    category: "converters",
    icon: "💱",
    title: { ar: "محول العملات", en: "Currency Converter" },
    desc: {
      ar: "تحويل العملات بأسعار الصرف المباشرة (الدولار، الريال، الدرهم، اليورو...) مع جدول احتياطي يعمل بدون إنترنت.",
      en: "Convert currencies with live exchange rates (USD, SAR, AED, EUR...) plus an offline fallback rate table.",
    },
    keywords: {
      ar: ["محول العملات", "تحويل الريال للدولار", "سعر الصرف", "تحويل العملات اون لاين"],
      en: ["currency converter", "exchange rate", "usd to sar", "currency exchange calculator"],
    },
  },
  {
    slug: "time-zone-converter",
    category: "converters",
    icon: "🌍",
    title: { ar: "محول المناطق الزمنية", en: "Time Zone Converter" },
    desc: {
      ar: "حوّل الوقت والتاريخ بين مناطق العالم الزمنية — مثالي للمواعيد الدولية والاجتماعات عن بُعد.",
      en: "Convert date and time between world time zones — perfect for international meetings and calls.",
    },
    keywords: {
      ar: ["محول التوقيت", "المناطق الزمنية", "التوقيت العالمي", "الفرق الزمني بين الدول"],
      en: ["time zone converter", "world clock", "time difference calculator"],
    },
  },

  // ---------------- generators ----------------
  {
    slug: "qr-code-generator",
    category: "generators",
    icon: "🔳",
    title: { ar: "مولّد رمز QR", en: "QR Code Generator" },
    desc: {
      ar: "أنشئ رمز QR لأي نص أو رابط أو شبكة Wi-Fi، وحمّله كصورة PNG أو ملف SVG بجودة عالية ومجانيًا.",
      en: "Create QR codes for any text, URL or Wi-Fi network and download them as PNG or SVG — free and unlimited.",
    },
    keywords: {
      ar: ["مولد QR", "رمز الاستجابة السريعة", "توليد باركود", "QR واي فاي", "انشاء رمز qr"],
      en: ["qr code generator", "qr code maker", "wifi qr code", "qr code png svg"],
    },
  },
  {
    slug: "password-generator",
    category: "generators",
    icon: "🔒",
    title: { ar: "مولّد كلمات المرور القوية", en: "Strong Password Generator" },
    desc: {
      ar: "توليد كلمات مرور عشوائية وآمنة محليًا مع مؤشر قوة كلمة المرور وإمكانية التحكم في الطول والرموز.",
      en: "Generate random, secure passwords locally with a strength meter and full control over length and character sets.",
    },
    keywords: {
      ar: ["مولد كلمات المرور", "كلمة مرور قوية", "باسورد", "توليد باسورد عشوائي"],
      en: ["password generator", "strong password", "random password generator", "secure password"],
    },
  },
  {
    slug: "uuid-generator",
    category: "generators",
    icon: "🆔",
    title: { ar: "مولّد UUID", en: "UUID Generator" },
    desc: {
      ar: "توليد معرّفات UUID v4 عشوائية وفريدة للمطورين — توليد حتى 50 معرّفًا دفعة واحدة مع النسخ والتنزيل.",
      en: "Generate random unique UUID v4 identifiers for developers — up to 50 at once with copy and download.",
    },
    keywords: {
      ar: ["مولد UUID", "توليد UUID", "معرف فريد", "uuid v4"],
      en: ["uuid generator", "guid generator", "uuid v4 online", "random uuid"],
    },
  },

  // ---------------- pdf ----------------
  {
    slug: "pdf-merge",
    category: "pdf",
    icon: "🧩",
    title: { ar: "دمج ملفات PDF", en: "Merge PDF Files" },
    desc: {
      ar: "ادمج عدة ملفات PDF في ملف واحد مجانًا وبدون رفع الملفات — رتّب الملفات كما تريد واحصل على النتيجة فورًا.",
      en: "Combine multiple PDF files into one free online — reorder your files and get the merged PDF instantly, no uploads.",
    },
    keywords: {
      ar: ["دمج PDF", "دمج ملفات بي دي اف", "توحيد ملفات PDF", "دمج ملفات PDF اون لاين", "دمج عدة ملفات pdf"],
      en: ["merge pdf", "combine pdf files", "pdf merger online", "merge pdf free", "join pdf files"],
    },
  },
  {
    slug: "pdf-split",
    category: "pdf",
    icon: "✂️",
    title: { ar: "تقسيم ملف PDF", en: "Split PDF File" },
    desc: {
      ar: "قسّم ملف PDF إلى أجزاء أو استخرج صفحات محددة (مثال: 1-3، 5) كملفات منفصلة — سريع وبدون تسجيل.",
      en: "Split a PDF into parts or extract specific pages (e.g. 1-3, 5) as separate files — fast, free, no signup.",
    },
    keywords: {
      ar: ["تقسيم PDF", "استخراج صفحات PDF", "فصل ملف PDF", "تقسيم ملف بي دي اف"],
      en: ["split pdf", "extract pages from pdf", "separate pdf pages", "pdf splitter online"],
    },
  },
  {
    slug: "pdf-compress",
    category: "pdf",
    icon: "🗜️",
    title: { ar: "ضغط ملف PDF", en: "Compress PDF File" },
    desc: {
      ar: "قلّل حجم ملف PDF قبل الإرسال أو الرفع — ضغط يعمل بالكامل داخل المتصفح مع تحكم في الجودة ومقارنة الحجم قبل وبعد.",
      en: "Reduce PDF file size before sending or uploading — in-browser compression with quality control and before/after size comparison.",
    },
    keywords: {
      ar: ["ضغط PDF", "تقليل حجم PDF", "ضغط ملف بي دي اف", "تصغير حجم الملف"],
      en: ["compress pdf", "reduce pdf size", "pdf compressor online", "shrink pdf file"],
    },
  },
  {
    slug: "pdf-rotate",
    category: "pdf",
    icon: "🔄",
    title: { ar: "تدوير صفحات PDF", en: "Rotate PDF Pages" },
    desc: {
      ar: "دوّر كل صفحات ملف PDF أو صفحات محددة بزاوية 90 أو 180 أو 270 درجة، واحفظ الملف المصحح فورًا.",
      en: "Rotate all pages or a selected range of a PDF by 90, 180 or 270 degrees and save the fixed file instantly.",
    },
    keywords: {
      ar: ["تدوير PDF", "تدوير صفحات", "تصحيح اتجاه PDF", "تدوير ملف بي دي اف"],
      en: ["rotate pdf", "rotate pdf pages", "change pdf orientation", "rotate pdf online free"],
    },
  },
  {
    slug: "images-to-pdf",
    category: "pdf",
    icon: "🖼️",
    title: { ar: "تحويل الصور إلى PDF", en: "Images to PDF Converter" },
    desc: {
      ar: "حوّل صور JPG و PNG إلى ملف PDF واحد مع ترتيب الصور واختيار حجم الصفحة (A4 أو حجم الصورة).",
      en: "Convert JPG and PNG images into a single PDF file with custom ordering and page size (A4 or original size).",
    },
    keywords: {
      ar: ["تحويل الصور الى PDF", "صورة الى PDF", "عمل PDF من صور", "تحويل jpg الى pdf"],
      en: ["images to pdf", "jpg to pdf", "png to pdf", "image to pdf converter"],
    },
  },
  {
    slug: "pdf-to-text",
    category: "pdf",
    icon: "📝",
    title: { ar: "استخراج النص من PDF", en: "PDF to Text Extractor" },
    desc: {
      ar: "استخرج النصوص من ملف PDF وانسخها أو حمّلها كملف نصي — مفيد للبحث والاقتباس وتحرير المحتوى.",
      en: "Extract text from a PDF file, copy it or download it as a text file — great for research, quoting and editing.",
    },
    keywords: {
      ar: ["استخراج النص من PDF", "تحويل PDF الى نص", "نسخ نص من PDF", "قراءة ملف PDF"],
      en: ["pdf to text", "extract text from pdf", "pdf text extractor", "convert pdf to txt"],
    },
  },
  {
    slug: "pdf-to-word",
    category: "pdf",
    icon: "📰",
    title: { ar: "تحويل PDF إلى Word", en: "PDF to Word Converter" },
    desc: {
      ar: "تحويل PDF إلى مستند Word قابل للتحرير — هذه الميزة قيد التطوير وستتوفر قريبًا. استخدم حاليًا أداة استخراج النص.",
      en: "Convert PDF to an editable Word document — this feature is under development and coming soon. Use the PDF to text tool meanwhile.",
    },
    keywords: {
      ar: ["تحويل PDF الى وورد", "PDF الى Word", "تحويل بي دي اف للوورد"],
      en: ["pdf to word", "convert pdf to docx", "pdf to doc converter"],
    },
  },

  // ---------------- image ----------------
  {
    slug: "image-compress",
    category: "image",
    icon: "🗜️",
    title: { ar: "ضغط الصور", en: "Compress Image Online" },
    desc: {
      ar: "اضغط صور JPG و PNG و WebP لتقليل حجمها مع الحفاظ على الجودة — مقارنة الحجم قبل وبعد وتنزيل فوري.",
      en: "Compress JPG, PNG and WebP images to reduce file size while keeping quality — see before/after size and download instantly.",
    },
    keywords: {
      ar: ["ضغط الصور", "تقليل حجم الصورة", "ضغط صورة jpg", "تصغير حجم الصورة"],
      en: ["compress image", "reduce image size", "image compressor", "compress jpg png"],
    },
  },
  {
    slug: "image-resize",
    category: "image",
    icon: "📏",
    title: { ar: "تغيير حجم الصورة", en: "Resize Image Online" },
    desc: {
      ar: "غيّر أبعاد الصورة بالبكسل أو بالنسبة المئوية مع الحفاظ على التناسب — مثالي لصور السوشيال ميديا والهوية.",
      en: "Resize images by pixels or percentage while keeping the aspect ratio — perfect for social media and profiles.",
    },
    keywords: {
      ar: ["تغيير حجم الصورة", "تصغير الصورة", "احجام الصور", "resize image"],
      en: ["resize image", "change image dimensions", "image resizer online", "crop resize photo"],
    },
  },
  {
    slug: "image-convert",
    category: "image",
    icon: "🔁",
    title: { ar: "تحويل صيغة الصورة", en: "Convert Image Format" },
    desc: {
      ar: "حوّل الصور بين PNG و JPG و WebP بجودة عالية — مفيد لتوافق المواقع وتقليل حجم الملفات.",
      en: "Convert images between PNG, JPG and WebP at high quality — useful for web compatibility and smaller files.",
    },
    keywords: {
      ar: ["تحويل صيغة الصورة", "تحويل png الى jpg", "تحويل صورة الى webp", "تغيير صيغة الصورة"],
      en: ["convert image format", "png to jpg", "jpg to webp", "image converter online"],
    },
  },
  {
    slug: "image-to-base64",
    category: "image",
    icon: "🧬",
    title: { ar: "تحويل الصورة إلى Base64", en: "Image to Base64 Encoder" },
    desc: {
      ar: "حوّل أي صورة إلى نص Base64 جاهز للاستخدام في HTML أو CSS أو البرمجة، مع نسخ سريع وتحميل كملف.",
      en: "Encode any image to Base64 text ready for HTML, CSS or code, with quick copy and file download.",
    },
    keywords: {
      ar: ["تحويل صورة الى base64", "base64 للصور", "ترميز الصور", "data uri"],
      en: ["image to base64", "base64 encoder", "image to data uri", "convert image base64"],
    },
  },
];

export function getTool(slug: string): ToolMeta | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function toolsByCategory(id: CategoryId): ToolMeta[] {
  return TOOLS.filter((t) => t.category === id);
}

export function categoryById(id: CategoryId): Category {
  return CATEGORIES.find((c) => c.id === id)!;
}
