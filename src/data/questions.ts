import type { Locale } from "@/i18n/translations";

export interface Question {
  id: string;
  type: "theory" | "simulation";
  question: { ar: string; en: string };
  options: { ar: string; en: string }[];
  correctIndex: number;
  explanation: { ar: string; en: string };
}

export const questions: Record<string, Question[]> = {
  health: [
    {
      id: "h1", type: "theory",
      question: { ar: "ما هو العضو المسؤول عن ضخ الدم في جسم الإنسان؟", en: "Which organ is responsible for pumping blood in the human body?" },
      options: [
        { ar: "الكبد", en: "Liver" },
        { ar: "القلب", en: "Heart" },
        { ar: "الرئتان", en: "Lungs" },
        { ar: "الكلى", en: "Kidneys" },
      ],
      correctIndex: 1,
      explanation: { ar: "القلب هو العضو المسؤول عن ضخ الدم إلى جميع أنحاء الجسم", en: "The heart is the organ responsible for pumping blood throughout the body" },
    },
    {
      id: "h2", type: "simulation",
      question: { ar: "مريض يعاني من حروق من الدرجة الثانية. ما هو أول إجراء يجب اتخاذه؟", en: "A patient has second-degree burns. What is the first action to take?" },
      options: [
        { ar: "وضع الثلج مباشرة", en: "Apply ice directly" },
        { ar: "تبريد المنطقة بالماء الجاري لمدة 10-20 دقيقة", en: "Cool with running water for 10-20 minutes" },
        { ar: "وضع الزبدة على الحرق", en: "Apply butter to the burn" },
        { ar: "فقع الفقاعات", en: "Pop the blisters" },
      ],
      correctIndex: 1,
      explanation: { ar: "تبريد الحرق بالماء الجاري هو الإسعاف الأولي الصحيح للحروق", en: "Cooling with running water is the correct first aid for burns" },
    },
    {
      id: "h3", type: "theory",
      question: { ar: "أي من التالي ليس من أعراض مرض السكري؟", en: "Which of the following is NOT a symptom of diabetes?" },
      options: [
        { ar: "كثرة التبول", en: "Frequent urination" },
        { ar: "العطش الشديد", en: "Excessive thirst" },
        { ar: "زيادة الوزن السريعة", en: "Rapid weight gain" },
        { ar: "بطء التئام الجروح", en: "Slow wound healing" },
      ],
      correctIndex: 2,
      explanation: { ar: "فقدان الوزن غير المبرر هو العرض الأكثر شيوعاً وليس زيادة الوزن", en: "Unexplained weight loss is a common symptom, not weight gain" },
    },
    {
      id: "h4", type: "simulation",
      question: { ar: "شخص فاقد للوعي ولكنه يتنفس. ما هو الوضع الصحيح لوضعه فيه؟", en: "An unconscious person is breathing. What is the correct position to place them in?" },
      options: [
        { ar: "على الظهر مع رفع الرأس", en: "On back with head elevated" },
        { ar: "وضع الإفاقة (الجانبي)", en: "Recovery position (side)" },
        { ar: "الجلوس", en: "Sitting up" },
        { ar: "على البطن", en: "Face down" },
      ],
      correctIndex: 1,
      explanation: { ar: "وضع الإفاقة يحمي مجرى التنفس ويمنع الاختناق", en: "Recovery position protects the airway and prevents choking" },
    },
    {
      id: "h5", type: "theory",
      question: { ar: "ما هي الوحدة الأساسية للجهاز العصبي؟", en: "What is the basic unit of the nervous system?" },
      options: [
        { ar: "الخلية العصبية (العصبون)", en: "Neuron" },
        { ar: "خلايا الدم الحمراء", en: "Red blood cells" },
        { ar: "الصفائح الدموية", en: "Platelets" },
        { ar: "الخلايا الليمفاوية", en: "Lymphocytes" },
      ],
      correctIndex: 0,
      explanation: { ar: "العصبون هو الوحدة البنائية والوظيفية للجهاز العصبي", en: "Neurons are the structural and functional units of the nervous system" },
    },
  ],
  cs: [
    {
      id: "c1", type: "theory",
      question: { ar: "ما هو الناتج من: console.log(typeof null)؟", en: "What is the output of: console.log(typeof null)?" },
      options: [
        { ar: "null", en: "null" },
        { ar: "undefined", en: "undefined" },
        { ar: "object", en: "object" },
        { ar: "string", en: "string" },
      ],
      correctIndex: 2,
      explanation: { ar: "في JavaScript، typeof null يُرجع 'object' وهذا خطأ معروف في اللغة", en: "In JavaScript, typeof null returns 'object' — this is a known bug in the language" },
    },
    {
      id: "c2", type: "simulation",
      question: { ar: "تطبيق ويب يعاني من بطء شديد. أي من التالي يجب فحصه أولاً؟", en: "A web app is extremely slow. Which should you check first?" },
      options: [
        { ar: "تغيير لون الواجهة", en: "Change the UI color" },
        { ar: "فحص استعلامات قاعدة البيانات والشبكة", en: "Check database queries and network" },
        { ar: "إضافة المزيد من الصفحات", en: "Add more pages" },
        { ar: "تغيير الخط", en: "Change the font" },
      ],
      correctIndex: 1,
      explanation: { ar: "البداية بفحص الأداء عبر الشبكة وقاعدة البيانات هي الخطوة الأولى", en: "Starting with network and database performance checks is the first step" },
    },
    {
      id: "c3", type: "theory",
      question: { ar: "ما هو تعقيد البحث الثنائي (Binary Search)؟", en: "What is the time complexity of Binary Search?" },
      options: [
        { ar: "O(n)", en: "O(n)" },
        { ar: "O(log n)", en: "O(log n)" },
        { ar: "O(n²)", en: "O(n²)" },
        { ar: "O(1)", en: "O(1)" },
      ],
      correctIndex: 1,
      explanation: { ar: "البحث الثنائي يقسم المجموعة إلى نصفين في كل خطوة", en: "Binary search halves the dataset at each step, giving O(log n)" },
    },
    {
      id: "c4", type: "simulation",
      question: { ar: "تحتاج لتخزين بيانات المستخدمين بشكل آمن. أي طريقة الأفضل؟", en: "You need to store user data securely. Which approach is best?" },
      options: [
        { ar: "تخزينها كنص عادي", en: "Store as plain text" },
        { ar: "تشفير البيانات الحساسة وتجزئة كلمات المرور", en: "Encrypt sensitive data and hash passwords" },
        { ar: "إرسالها عبر البريد الإلكتروني", en: "Send via email" },
        { ar: "حفظها في ملف نصي على السيرفر", en: "Save in a text file on server" },
      ],
      correctIndex: 1,
      explanation: { ar: "تشفير البيانات وتجزئة كلمات المرور هي أفضل ممارسات الأمان", en: "Encrypting data and hashing passwords are security best practices" },
    },
    {
      id: "c5", type: "theory",
      question: { ar: "أي من التالي هو بروتوكول لنقل البيانات عبر الإنترنت؟", en: "Which protocol is used for data transfer over the internet?" },
      options: [
        { ar: "HTML", en: "HTML" },
        { ar: "CSS", en: "CSS" },
        { ar: "HTTP", en: "HTTP" },
        { ar: "SQL", en: "SQL" },
      ],
      correctIndex: 2,
      explanation: { ar: "HTTP هو بروتوكول نقل النص التشعبي المستخدم في الويب", en: "HTTP (HyperText Transfer Protocol) is used for web data transfer" },
    },
  ],
  business: [
    {
      id: "b1", type: "theory",
      question: { ar: "ما هي الخطوة الأولى في إعداد خطة عمل؟", en: "What is the first step in preparing a business plan?" },
      options: [
        { ar: "تحديد الميزانية", en: "Set the budget" },
        { ar: "دراسة السوق وتحليل المنافسين", en: "Market research and competitor analysis" },
        { ar: "توظيف الموظفين", en: "Hire employees" },
        { ar: "تصميم الشعار", en: "Design the logo" },
      ],
      correctIndex: 1,
      explanation: { ar: "دراسة السوق هي الأساس لبناء أي خطة عمل ناجحة", en: "Market research is the foundation for any successful business plan" },
    },
    {
      id: "b2", type: "simulation",
      question: { ar: "أنت مدير مشروع ولديك ميزانية محدودة. المشروع متأخر عن الجدول. ماذا تفعل؟", en: "You're a project manager with limited budget. The project is behind schedule. What do you do?" },
      options: [
        { ar: "تجاهل التأخير", en: "Ignore the delay" },
        { ar: "إعادة ترتيب الأولويات وتركيز الموارد على المهام الحرجة", en: "Reprioritize and focus resources on critical tasks" },
        { ar: "إلغاء المشروع", en: "Cancel the project" },
        { ar: "طلب ميزانية إضافية فوراً", en: "Request additional budget immediately" },
      ],
      correctIndex: 1,
      explanation: { ar: "إعادة ترتيب الأولويات يضمن إنجاز أهم المهام في الوقت المتاح", en: "Reprioritizing ensures the most critical tasks are completed on time" },
    },
    {
      id: "b3", type: "theory",
      question: { ar: "ما المقصود بـ ROI؟", en: "What does ROI stand for?" },
      options: [
        { ar: "مؤشر الأداء الرئيسي", en: "Key Performance Indicator" },
        { ar: "العائد على الاستثمار", en: "Return on Investment" },
        { ar: "إدارة الجودة الشاملة", en: "Total Quality Management" },
        { ar: "تكلفة البضاعة المباعة", en: "Cost of Goods Sold" },
      ],
      correctIndex: 1,
      explanation: { ar: "ROI هو مقياس لتقييم كفاءة وربحية الاستثمار", en: "ROI measures the efficiency and profitability of an investment" },
    },
    {
      id: "b4", type: "simulation",
      question: { ar: "عميل غاضب يهدد بإلغاء عقد كبير. ما أفضل نهج للتعامل؟", en: "An angry client threatens to cancel a major contract. What's the best approach?" },
      options: [
        { ar: "تجاهل شكواه", en: "Ignore their complaint" },
        { ar: "الاستماع بعناية وتقديم حل بديل مع خطة تحسين", en: "Listen carefully and offer an alternative solution with improvement plan" },
        { ar: "تقديم خصم كبير فوراً", en: "Offer a large discount immediately" },
        { ar: "إحالته لموظف آخر", en: "Redirect to another employee" },
      ],
      correctIndex: 1,
      explanation: { ar: "الاستماع الفعال وتقديم حلول عملية يبني الثقة ويحافظ على العلاقة", en: "Active listening and practical solutions build trust and maintain the relationship" },
    },
    {
      id: "b5", type: "theory",
      question: { ar: "أي من المصطلحات التالية يصف عملية تقسيم السوق إلى مجموعات؟", en: "Which term describes dividing the market into groups?" },
      options: [
        { ar: "التسعير", en: "Pricing" },
        { ar: "تجزئة السوق", en: "Market Segmentation" },
        { ar: "التوزيع", en: "Distribution" },
        { ar: "الترويج", en: "Promotion" },
      ],
      correctIndex: 1,
      explanation: { ar: "تجزئة السوق تساعد في استهداف العملاء المناسبين بمنتجات مخصصة", en: "Market segmentation helps target the right customers with tailored products" },
    },
  ],
  shariah: [
    {
      id: "s1", type: "theory",
      question: { ar: "ما هي أركان الإسلام الخمسة؟ أيها الركن الثالث؟", en: "What are the five pillars of Islam? Which is the third?" },
      options: [
        { ar: "الصلاة", en: "Prayer (Salah)" },
        { ar: "الزكاة", en: "Almsgiving (Zakat)" },
        { ar: "الصوم", en: "Fasting (Sawm)" },
        { ar: "الحج", en: "Pilgrimage (Hajj)" },
      ],
      correctIndex: 1,
      explanation: { ar: "الزكاة هي الركن الثالث من أركان الإسلام بعد الشهادتين والصلاة", en: "Zakat is the third pillar of Islam, after Shahada and Salah" },
    },
    {
      id: "s2", type: "simulation",
      question: { ar: "شخص يسأل عن حكم بيع سلعة لم يستلمها بعد. ما الحكم الشرعي؟", en: "Someone asks about selling goods they haven't received yet. What's the ruling?" },
      options: [
        { ar: "جائز مطلقاً", en: "Permissible in all cases" },
        { ar: "لا يجوز بيع ما لم يُقبض إلا في حالات مستثناة", en: "Not permissible to sell what hasn't been received, with some exceptions" },
        { ar: "مكروه فقط", en: "Only disliked (makruh)" },
        { ar: "لا علاقة للشريعة بالتجارة", en: "Shari'ah doesn't deal with trade" },
      ],
      correctIndex: 1,
      explanation: { ar: "نهى النبي ﷺ عن بيع ما لم يُقبض لما فيه من الغرر", en: "The Prophet ﷺ prohibited selling what hasn't been received due to uncertainty (gharar)" },
    },
    {
      id: "s3", type: "theory",
      question: { ar: "ما هو المصدر الثاني للتشريع الإسلامي بعد القرآن الكريم؟", en: "What is the second source of Islamic legislation after the Quran?" },
      options: [
        { ar: "الإجماع", en: "Consensus (Ijma)" },
        { ar: "السنة النبوية", en: "Prophetic Sunnah" },
        { ar: "القياس", en: "Analogy (Qiyas)" },
        { ar: "العرف", en: "Custom (Urf)" },
      ],
      correctIndex: 1,
      explanation: { ar: "السنة النبوية هي المصدر الثاني للتشريع بعد القرآن الكريم", en: "The Prophetic Sunnah is the second source after the Holy Quran" },
    },
    {
      id: "s4", type: "simulation",
      question: { ar: "خلاف بين شريكين في مشروع تجاري حول توزيع الأرباح. كيف تحكم؟", en: "Two partners dispute profit distribution. How do you rule?" },
      options: [
        { ar: "يأخذ الأقوى نصيباً أكبر", en: "The stronger partner gets more" },
        { ar: "الأرباح حسب الاتفاق، والخسارة حسب رأس المال", en: "Profits per agreement, losses per capital ratio" },
        { ar: "تقسيم متساوٍ دائماً", en: "Always equal split" },
        { ar: "لا حل شرعي لهذه المسألة", en: "No Shari'ah solution exists" },
      ],
      correctIndex: 1,
      explanation: { ar: "في الشركة الإسلامية: الربح حسب الاتفاق والخسارة بقدر رأس المال", en: "In Islamic partnership: profit by agreement, loss by capital proportion" },
    },
    {
      id: "s5", type: "theory",
      question: { ar: "ما معنى 'الاجتهاد' في أصول الفقه؟", en: "What does 'Ijtihad' mean in Islamic jurisprudence?" },
      options: [
        { ar: "التقليد الأعمى", en: "Blind imitation" },
        { ar: "بذل الجهد في استنباط الأحكام الشرعية من الأدلة", en: "Exerting effort to derive rulings from evidence" },
        { ar: "رفض السنة", en: "Rejecting the Sunnah" },
        { ar: "الاكتفاء بالقرآن فقط", en: "Relying only on the Quran" },
      ],
      correctIndex: 1,
      explanation: { ar: "الاجتهاد هو بذل الوسع في استنباط الحكم الشرعي من أدلته التفصيلية", en: "Ijtihad is exerting effort to derive Islamic rulings from detailed evidence" },
    },
  ],
};
