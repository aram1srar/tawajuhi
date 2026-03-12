export interface Question {
  id: string;
  type: "theory" | "interest" | "practical" | "open";
  question: { ar: string; en: string };
  options: { ar: string; en: string }[];
  correctIndex: number;
  explanation: { ar: string; en: string };
  path: "cs" | "health" | "business" | "shariah";
  jobContext?: { ar: string; en: string };
}

export const questions: Record<string, Question[]> = {
  cs: [
    // Original theory (8)
    { id: "cs1", type: "theory", path: "cs", question: { ar: "أي من المكونات التالية يعتبر \"عقل\" الحاسب؟", en: "Which of the following is considered the \"brain\" of the computer?" }, options: [{ ar: "الرام", en: "RAM" }, { ar: "المعالج", en: "Processor (CPU)" }, { ar: "القرص الصلب", en: "Hard Drive" }], correctIndex: 1, explanation: { ar: "المعالج (CPU) هو العنصر المسؤول عن تنفيذ العمليات الحسابية والمنطقية", en: "The CPU executes all computational and logical operations" } },
    { id: "cs2", type: "theory", path: "cs", question: { ar: "لغة البرمجة التي تُستخدم بكثرة في مجال الذكاء الاصطناعي هي:", en: "The programming language widely used in AI is:" }, options: [{ ar: "Python", en: "Python" }, { ar: "HTML", en: "HTML" }, { ar: "CSS", en: "CSS" }], correctIndex: 0, explanation: { ar: "Python هي اللغة الأكثر استخداماً في مجال الذكاء الاصطناعي", en: "Python is the most widely used language in AI" } },
    { id: "cs3", type: "theory", path: "cs", question: { ar: "أصغر وحدة لتخزين البيانات في الحاسب هي:", en: "The smallest unit of data storage in a computer is:" }, options: [{ ar: "بايت", en: "Byte" }, { ar: "بت", en: "Bit" }, { ar: "ميجابايت", en: "Megabyte" }], correctIndex: 1, explanation: { ar: "البت (Bit) هو أصغر وحدة لتخزين البيانات", en: "A Bit is the smallest data unit" } },
    { id: "cs4", type: "theory", path: "cs", question: { ar: "الرمز الذي يمثل \"البوابة المنطقية\" التي تعطي مخرجاً صحيحاً فقط إذا كان جميع المدخلات صحيحة:", en: "The logic gate that outputs true only when ALL inputs are true:" }, options: [{ ar: "OR", en: "OR" }, { ar: "AND", en: "AND" }, { ar: "NOT", en: "NOT" }], correctIndex: 1, explanation: { ar: "بوابة AND تعطي مخرجاً صحيحاً فقط عندما تكون جميع المدخلات صحيحة", en: "AND gate outputs true only when all inputs are true" } },
    { id: "cs5", type: "theory", path: "cs", question: { ar: "نظام الترقيم الذي يعتمد عليه الحاسب في معالجة البيانات هو:", en: "The numbering system computers use to process data is:" }, options: [{ ar: "العشري", en: "Decimal" }, { ar: "الثنائي", en: "Binary" }, { ar: "الستة عشري", en: "Hexadecimal" }], correctIndex: 1, explanation: { ar: "النظام الثنائي (0 و 1) هو أساس عمل الحاسب", en: "Binary is the foundation of computer processing" } },
    { id: "cs6", type: "theory", path: "cs", question: { ar: "\"البرمجيات الخبيثة\" التي تشفر ملفات المستخدم وتطلب مقابلاً مادياً هي:", en: "Malware that encrypts user files and demands payment is:" }, options: [{ ar: "الفيروسات", en: "Viruses" }, { ar: "فدية (Ransomware)", en: "Ransomware" }, { ar: "الديدان", en: "Worms" }], correctIndex: 1, explanation: { ar: "برامج الفدية تشفر الملفات وتطلب مبلغاً مالياً", en: "Ransomware encrypts files and demands payment" } },
    { id: "cs7", type: "theory", path: "cs", question: { ar: "ما هو البروتوكول المسؤول عن نقل صفحات الويب بأمان؟", en: "Which protocol is responsible for secure web page transfer?" }, options: [{ ar: "FTP", en: "FTP" }, { ar: "HTTP", en: "HTTP" }, { ar: "HTTPS", en: "HTTPS" }], correctIndex: 2, explanation: { ar: "HTTPS يضيف طبقة تشفير SSL/TLS", en: "HTTPS adds SSL/TLS encryption" } },
    { id: "cs8", type: "theory", path: "cs", question: { ar: "تقنية تسمح للأجهزة بالتواصل مع بعضها عبر الإنترنت دون تدخل بشري:", en: "Technology that allows devices to communicate over the internet without human intervention:" }, options: [{ ar: "الواقع الافتراضي", en: "Virtual Reality" }, { ar: "إنترنت الأشياء", en: "Internet of Things (IoT)" }, { ar: "الحوسبة السحابية", en: "Cloud Computing" }], correctIndex: 1, explanation: { ar: "إنترنت الأشياء (IoT) يربط الأجهزة ببعضها", en: "IoT connects devices to each other" } },
    // Original interest (6)
    { id: "cs9", type: "interest", path: "cs", question: { ar: "هل تفضل قضاء وقت فراغك في تعلم كيفية عمل تطبيق معين؟", en: "Do you prefer spending free time learning how a specific app works?" }, options: [{ ar: "نعم بشدة", en: "Yes, definitely" }, { ar: "أحياناً", en: "Sometimes" }, { ar: "لا", en: "No" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    { id: "cs10", type: "interest", path: "cs", question: { ar: "هل تستمتع بفك الأجهزة الإلكترونية القديمة لاستكشاف قطعها؟", en: "Do you enjoy taking apart old electronics to explore their components?" }, options: [{ ar: "نعم", en: "Yes" }, { ar: "ربما", en: "Maybe" }, { ar: "لا", en: "No" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    { id: "cs11", type: "interest", path: "cs", question: { ar: "هل تفضل حل المسائل الرياضية على كتابة المقالات الأدبية؟", en: "Do you prefer solving math problems over writing essays?" }, options: [{ ar: "نعم", en: "Yes" }, { ar: "لا فرق", en: "No difference" }, { ar: "لا", en: "No" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    { id: "cs12", type: "interest", path: "cs", question: { ar: "هل يستهويك تصميم نماذج ثلاثية الأبعاد باستخدام الكمبيوتر؟", en: "Are you interested in designing 3D models using a computer?" }, options: [{ ar: "نعم", en: "Yes" }, { ar: "ليس كثيراً", en: "Not much" }, { ar: "لا", en: "No" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    { id: "cs13", type: "interest", path: "cs", question: { ar: "هل تشعر بالإثارة عند اكتشاف ثغرة تقنية أو حل مشكلة في جهاز؟", en: "Do you feel excited when discovering a tech bug or fixing a device problem?" }, options: [{ ar: "نعم", en: "Yes" }, { ar: "أحياناً", en: "Sometimes" }, { ar: "لا", en: "No" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    { id: "cs14", type: "interest", path: "cs", question: { ar: "هل تفضل العمل المنفرد على مشاريع تتطلب تركيزاً تقنياً عالياً؟", en: "Do you prefer working alone on projects requiring high technical focus?" }, options: [{ ar: "نعم", en: "Yes" }, { ar: "لا", en: "No" }, { ar: "حسب المشروع", en: "Depends on the project" }], correctIndex: 0, explanation: { ar: "", en: "" } },

    // NEW: Practical/Professional simulation questions
    { id: "cs_sw1", type: "practical", path: "cs",
      jobContext: { ar: "أنت مهندس برمجيات في شركة تطوير برامج. مهمتك تصميم وتطوير التطبيقات البرمجية.", en: "You are a software engineer at a development company. Your task is designing and developing software applications." },
      question: { ar: "إذا كنت تعمل على تطوير تطبيق ويب وواجهت مشكلات في الأداء، ما هو الحل الأول الذي ستبحث عنه؟", en: "If you're developing a web app and face performance issues, what's the first solution you'd look for?" },
      options: [{ ar: "تحليل الكود للبحث عن مشاكل في البنية", en: "Analyze code for structural issues" }, { ar: "إضافة مزيد من الأجهزة لتسريع المعالجة", en: "Add more hardware to speed up processing" }, { ar: "تغيير قاعدة البيانات بالكامل", en: "Change the entire database" }, { ar: "زيادة عدد المطورين في الفريق", en: "Increase the number of developers" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    { id: "cs_sw2", type: "open", path: "cs",
      jobContext: { ar: "أنت مهندس برمجيات في شركة تطوير برامج.", en: "You are a software engineer at a development company." },
      question: { ar: "إذا كان التطبيق الذي تطوره يحتوي على خطأ برمجي يصعب تحديده، كيف ستتعامل مع هذه المشكلة؟", en: "If the application you're developing has a hard-to-identify bug, how would you handle this problem?" },
      options: [], correctIndex: -1, explanation: { ar: "", en: "" } },
    { id: "cs_sys1", type: "practical", path: "cs",
      jobContext: { ar: "أنت مهندس نظم مكلف بتصميم الأنظمة الهندسية للأجهزة التقنية.", en: "You are a systems engineer designing engineering systems for technical devices." },
      question: { ar: "إذا كان عليك تصميم نظام كمبيوتر لأحد العملاء، ما هو أول شيء يجب مراعاته؟", en: "If you had to design a computer system for a client, what's the first thing to consider?" },
      options: [{ ar: "احتياجات العميل والمتطلبات التي يحددها", en: "Client needs and specified requirements" }, { ar: "الميزانية المتاحة فقط", en: "Available budget only" }, { ar: "البرمجيات التي يجب استخدامها", en: "Software to be used" }, { ar: "مواصفات الأجهزة فقط", en: "Hardware specs only" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    { id: "cs_sys2", type: "open", path: "cs",
      jobContext: { ar: "أنت مهندس نظم مكلف بتصميم الأنظمة الهندسية.", en: "You are a systems engineer designing engineering systems." },
      question: { ar: "كيف يمكن تحسين كفاءة النظام الذي قمت بتصميمه إذا تم اكتشاف أنه يعاني من مشكلات في الأداء؟", en: "How can you improve the efficiency of a system you designed if performance issues are discovered?" },
      options: [], correctIndex: -1, explanation: { ar: "", en: "" } },
    { id: "cs_net1", type: "practical", path: "cs",
      jobContext: { ar: "أنت مهندس شبكات مكلف بتصميم وصيانة الشبكات الرقمية.", en: "You are a network engineer designing and maintaining digital networks." },
      question: { ar: "إذا طلب منك إعداد شبكة لشركة، ما هو العنصر الأول الذي يجب أن تأخذه في الاعتبار؟", en: "If asked to set up a network for a company, what's the first element to consider?" },
      options: [{ ar: "تحديد البنية التحتية للشبكة وتوصيل الأجهزة", en: "Define network infrastructure and connect devices" }, { ar: "تحديد مواقع المكاتب التي يجب توصيلها", en: "Identify office locations to connect" }, { ar: "إعداد أجهزة التوجيه فقط دون النظر للأمان", en: "Set up routers only without security" }, { ar: "توصيل الشبكة مباشرة دون التخطيط", en: "Connect the network directly without planning" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    { id: "cs_net2", type: "open", path: "cs",
      jobContext: { ar: "أنت مهندس شبكات.", en: "You are a network engineer." },
      question: { ar: "كيف يمكنك تحسين أداء الشبكة في شركة كبيرة مع وجود عدد كبير من الأجهزة المتصلة؟", en: "How can you improve network performance in a large company with many connected devices?" },
      options: [], correctIndex: -1, explanation: { ar: "", en: "" } },
    { id: "cs_elec1", type: "practical", path: "cs",
      jobContext: { ar: "أنت مهندس كهرباء مسؤول عن تصميم وصيانة الأنظمة الكهربائية.", en: "You are an electrical engineer responsible for designing and maintaining electrical systems." },
      question: { ar: "إذا كان لديك نظام كهربائي يعاني من انقطاع متكرر للتيار، ما هو أول إجراء يجب أن تتخذه؟", en: "If an electrical system has frequent outages, what's the first step?" },
      options: [{ ar: "تحليل النظام الكهربائي والبحث عن العطل في الأسلاك", en: "Analyze the electrical system and look for wiring faults" }, { ar: "زيادة سعة الأجهزة الكهربائية", en: "Increase electrical device capacity" }, { ar: "التأكد من تشغيل جميع الأجهزة دون دراسة المشكلة", en: "Ensure all devices run without studying the problem" }, { ar: "استبدال كل الأجهزة في النظام", en: "Replace all devices in the system" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    { id: "cs_elec2", type: "open", path: "cs",
      jobContext: { ar: "أنت مهندس كهرباء.", en: "You are an electrical engineer." },
      question: { ar: "كيف يمكنك تحسين كفاءة النظام الكهربائي في منشأة صناعية تواجه مشاكل في استهلاك الطاقة؟", en: "How can you improve electrical system efficiency in an industrial facility facing energy consumption problems?" },
      options: [], correctIndex: -1, explanation: { ar: "", en: "" } },
    { id: "cs_mech1", type: "practical", path: "cs",
      jobContext: { ar: "أنت مهندس ميكانيكي متخصص في تصميم وتحليل الأنظمة الميكانيكية.", en: "You are a mechanical engineer specializing in designing and analyzing mechanical systems." },
      question: { ar: "ما هو أول شيء يجب أن تفعله عند تصميم جهاز ميكانيكي جديد؟", en: "What's the first thing to do when designing a new mechanical device?" },
      options: [{ ar: "إجراء تحليل للنظام لتحديد المتطلبات الأساسية", en: "Perform system analysis to determine basic requirements" }, { ar: "استخدام أدوات التحليل فقط دون تحديد المتطلبات", en: "Use analysis tools only without defining requirements" }, { ar: "اختيار المواد دون النظر لتصميم الجهاز", en: "Choose materials without considering the design" }, { ar: "البدء في إنتاج الجهاز مباشرة", en: "Start producing the device directly" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    { id: "cs_mech2", type: "open", path: "cs",
      jobContext: { ar: "أنت مهندس ميكانيكي.", en: "You are a mechanical engineer." },
      question: { ar: "إذا اكتشفت أن جهازًا ميكانيكيًا مصممًا حديثًا يعاني من مشاكل في الكفاءة، كيف ستتعامل مع هذه المشكلة؟", en: "If you discovered a newly designed mechanical device has efficiency problems, how would you handle it?" },
      options: [], correctIndex: -1, explanation: { ar: "", en: "" } },
    { id: "cs_env1", type: "practical", path: "cs",
      jobContext: { ar: "أنت مهندس بيئة مكلف بتصميم حلول تحافظ على البيئة.", en: "You are an environmental engineer designing solutions to protect the environment." },
      question: { ar: "إذا كان عليك إدارة محطة لتصفية المياه، ما هو الحل الأفضل للتقليل من التلوث؟", en: "If managing a water treatment plant, what's the best solution to reduce pollution?" },
      options: [{ ar: "استخدام تقنيات حديثة لمعالجة المياه", en: "Use modern water treatment technologies" }, { ar: "زيادة عدد الموظفين في المحطة", en: "Increase station staff" }, { ar: "تجاهل الفحص البيئي على المدى الطويل", en: "Ignore long-term environmental inspection" }, { ar: "زيادة كمية المواد الكيميائية المستخدمة", en: "Increase chemicals used in treatment" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    { id: "cs_env2", type: "open", path: "cs",
      jobContext: { ar: "أنت مهندس بيئة.", en: "You are an environmental engineer." },
      question: { ar: "كيف يمكن تقليل التلوث البيئي الناتج عن المصانع؟", en: "How can you reduce environmental pollution from factories?" },
      options: [], correctIndex: -1, explanation: { ar: "", en: "" } },
    // NEW theory questions
    { id: "cs_cyber1", type: "practical", path: "cs",
      jobContext: { ar: "يتم إخبارك أن هناك هجومًا على الشبكة الخاصة بالشركة.", en: "You're told there's an attack on the company network." },
      question: { ar: "ما هو أول إجراء يجب اتخاذه عندما يتم اكتشاف هجوم سيبراني؟", en: "What's the first step when a cyberattack is discovered?" },
      options: [{ ar: "عزل الشبكة وإيقاف الأنظمة المتأثرة", en: "Isolate the network and shut down affected systems" }, { ar: "انتظار توجيهات الإدارة العليا", en: "Wait for upper management instructions" }, { ar: "محاولة إصلاح الأضرار بسرعة", en: "Try to fix damages quickly" }, { ar: "الإبلاغ عن المشكلة للشبكة المحلية فقط", en: "Report only to local network" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    { id: "cs_elecdesign1", type: "practical", path: "cs",
      jobContext: { ar: "أنت مهندس إلكترونيات مكلف بتصميم جهاز إلكتروني صغير يعمل على الطاقة الشمسية.", en: "You're an electronics engineer tasked with designing a small solar-powered electronic device." },
      question: { ar: "كيف يمكن تحسين تصميم الجهاز ليكون فعالًا ومستدامًا؟", en: "How to improve the device design for efficiency and sustainability?" },
      options: [{ ar: "استخدام أجهزة استشعار صغيرة منخفضة الطاقة مع بطارية شمسية", en: "Use small low-power sensors with solar battery" }, { ar: "استخدام أجهزة استشعار عالية الطاقة مع بطارية قابلة للشحن", en: "Use high-power sensors with rechargeable battery" }, { ar: "تصميم الجهاز بدون حماية ضد العوامل البيئية", en: "Design without environmental protection" }, { ar: "استخدام بطاريات قابلة لإعادة الشحن فقط", en: "Use only rechargeable batteries" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    { id: "cs_resistance1", type: "theory", path: "cs",
      question: { ar: "ما هي الوظيفة الأساسية للمقاومة في الدائرة الكهربائية؟", en: "What is the basic function of resistance in an electrical circuit?" },
      options: [{ ar: "تحويل الطاقة الكهربائية إلى حرارة", en: "Convert electrical energy to heat" }, { ar: "زيادة التيار في الدائرة", en: "Increase current in the circuit" }, { ar: "تخزين الطاقة", en: "Store energy" }, { ar: "توصيل الكهرباء بين العناصر المختلفة", en: "Connect electricity between different elements" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    { id: "cs_processor1", type: "theory", path: "cs",
      question: { ar: "ما هو المعالج في الحاسوب؟", en: "What is the processor in a computer?" },
      options: [{ ar: "هو الجزء الذي يتيح نقل البيانات بين الأجهزة", en: "The part that transfers data between devices" }, { ar: "هو الجزء المسؤول عن تنفيذ التعليمات وحساب العمليات", en: "The part responsible for executing instructions and computing operations" }, { ar: "هو الجزء الذي يدير شبكة الإنترنت", en: "The part that manages the internet network" }, { ar: "هو الجزء المسؤول عن تخزين البيانات", en: "The part responsible for storing data" }], correctIndex: 1, explanation: { ar: "", en: "" } },
    // NEW: Expressive open-ended questions for deeper analysis
    { id: "cs_expr1", type: "open", path: "cs",
      question: { ar: "تخيل أنك حصلت على فرصة لتطوير مشروع تقني يخدم مجتمعك المحلي. ما هو المشروع الذي ستختاره ولماذا؟ وكيف ستبدأ في تنفيذه؟", en: "Imagine you got an opportunity to develop a tech project serving your local community. What project would you choose, why, and how would you start implementing it?" },
      options: [], correctIndex: -1, explanation: { ar: "", en: "" } },
    { id: "cs_expr2", type: "open", path: "cs",
      question: { ar: "ما هو أكبر تحدٍّ تقني واجهته في حياتك (سواء في الدراسة أو خارجها)؟ كيف تعاملت معه وماذا تعلمت منه؟", en: "What's the biggest technical challenge you've faced (in school or outside)? How did you handle it and what did you learn?" },
      options: [], correctIndex: -1, explanation: { ar: "", en: "" } },
    { id: "cs_expr3", type: "open", path: "cs",
      question: { ar: "إذا كان بإمكانك اختراع تطبيق أو جهاز تقني جديد لم يُصنع من قبل، ماذا سيكون؟ اشرح فكرتك وكيف سيغير حياة الناس.", en: "If you could invent a new app or device that hasn't been made before, what would it be? Explain your idea and how it would change people's lives." },
      options: [], correctIndex: -1, explanation: { ar: "", en: "" } },
    { id: "cs_expr4", type: "open", path: "cs",
      question: { ar: "كيف ترى مستقبل التكنولوجيا في المملكة العربية السعودية خلال العشر سنوات القادمة؟ وما الدور الذي تطمح أن تلعبه في هذا المستقبل؟", en: "How do you see the future of technology in Saudi Arabia in the next 10 years? What role do you aspire to play?" },
      options: [], correctIndex: -1, explanation: { ar: "", en: "" } },
  ],
  health: [
    // Original theory (8)
    { id: "h1", type: "theory", path: "health", question: { ar: "أي جزء من الخلية يحتوي على المعلومات الوراثية (DNA)؟", en: "Which part of the cell contains genetic information (DNA)?" }, options: [{ ar: "السيتوبلازم", en: "Cytoplasm" }, { ar: "النواة", en: "Nucleus" }, { ar: "الفجوة", en: "Vacuole" }], correctIndex: 1, explanation: { ar: "", en: "" } },
    { id: "h2", type: "theory", path: "health", question: { ar: "العملية التي يقوم بها النبات لصنع غذائه باستخدام الضوء هي:", en: "The process plants use to make food using light is:" }, options: [{ ar: "التنفس", en: "Respiration" }, { ar: "البناء الضوئي", en: "Photosynthesis" }, { ar: "التخمر", en: "Fermentation" }], correctIndex: 1, explanation: { ar: "", en: "" } },
    { id: "h3", type: "theory", path: "health", question: { ar: "فصيلة الدم التي تسمى \"المعطي العام\" هي:", en: "The blood type called the \"universal donor\" is:" }, options: [{ ar: "AB", en: "AB" }, { ar: "A", en: "A" }, { ar: "O", en: "O" }], correctIndex: 2, explanation: { ar: "", en: "" } },
    { id: "h4", type: "theory", path: "health", question: { ar: "المادة الكيميائية التي تسرع التفاعلات الحيوية في الجسم هي:", en: "The chemical that speeds up biological reactions in the body is:" }, options: [{ ar: "السكر", en: "Sugar" }, { ar: "الإنزيم", en: "Enzyme" }, { ar: "الملح", en: "Salt" }], correctIndex: 1, explanation: { ar: "", en: "" } },
    { id: "h5", type: "theory", path: "health", question: { ar: "الغاز الذي يحتاجه الإنسان في عملية التنفس الخلوي هو:", en: "The gas humans need for cellular respiration is:" }, options: [{ ar: "ثاني أكسيد الكربون", en: "Carbon Dioxide" }, { ar: "الأكسجين", en: "Oxygen" }, { ar: "النيتروجين", en: "Nitrogen" }], correctIndex: 1, explanation: { ar: "", en: "" } },
    { id: "h6", type: "theory", path: "health", question: { ar: "مرض \"السكري\" ينتج عن خلل في إفراز هرمون:", en: "Diabetes results from a disorder in the secretion of:" }, options: [{ ar: "الأدرينالين", en: "Adrenaline" }, { ar: "الثايروكسين", en: "Thyroxine" }, { ar: "الإنسولين", en: "Insulin" }], correctIndex: 2, explanation: { ar: "", en: "" } },
    { id: "h7", type: "theory", path: "health", question: { ar: "الوحدة الأساسية لبناء الكائن الحي هي:", en: "The basic building unit of living organisms is:" }, options: [{ ar: "النسيج", en: "Tissue" }, { ar: "الخلية", en: "Cell" }, { ar: "العضو", en: "Organ" }], correctIndex: 1, explanation: { ar: "", en: "" } },
    { id: "h8", type: "theory", path: "health", question: { ar: "علم دراسة التفاعلات بين الكائنات الحية وبيئتها هو:", en: "The science of studying interactions between organisms and their environment is:" }, options: [{ ar: "علم البيئة", en: "Ecology" }, { ar: "علم وظائف الأعضاء", en: "Physiology" }, { ar: "علم التشريح", en: "Anatomy" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    // Original interest (6)
    { id: "h9", type: "interest", path: "health", question: { ar: "هل تشعر بالرغبة في مساعدة الناس عند تعرضهم لوعكة صحية؟", en: "Do you feel the urge to help people when they're feeling unwell?" }, options: [{ ar: "نعم", en: "Yes" }, { ar: "أحياناً", en: "Sometimes" }, { ar: "لا", en: "No" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    { id: "h10", type: "interest", path: "health", question: { ar: "هل تستمتع بمشاهدة البرامج الوثائقية عن جسم الإنسان أو الكائنات؟", en: "Do you enjoy watching documentaries about the human body or organisms?" }, options: [{ ar: "نعم", en: "Yes" }, { ar: "قليلاً", en: "A little" }, { ar: "لا", en: "No" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    { id: "h11", type: "interest", path: "health", question: { ar: "هل لديك صبر لإجراء تجارب في المختبر ومراقبة النتائج؟", en: "Do you have patience for lab experiments and observing results?" }, options: [{ ar: "نعم", en: "Yes" }, { ar: "لا", en: "No" }, { ar: "ربما", en: "Maybe" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    { id: "h12", type: "interest", path: "health", question: { ar: "هل تهتم بقراءة النشرات الدوائية ومعرفة آثارها الجانبية؟", en: "Do you care about reading drug leaflets and learning about side effects?" }, options: [{ ar: "نعم", en: "Yes" }, { ar: "لا", en: "No" }, { ar: "نادراً", en: "Rarely" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    { id: "h13", type: "interest", path: "health", question: { ar: "هل تفضل العمل في بيئة المستشفيات والمراكز الصحية؟", en: "Do you prefer working in hospitals and health centers?" }, options: [{ ar: "نعم", en: "Yes" }, { ar: "لا", en: "No" }, { ar: "لست متأكداً", en: "Not sure" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    { id: "h14", type: "interest", path: "health", question: { ar: "هل يستهويك البحث عن حلول لمشاكل التلوث البيئي؟", en: "Are you interested in finding solutions for environmental pollution?" }, options: [{ ar: "نعم", en: "Yes" }, { ar: "لا", en: "No" }, { ar: "أحياناً", en: "Sometimes" }], correctIndex: 0, explanation: { ar: "", en: "" } },

    // NEW: Practical/Professional
    { id: "h_nurse1", type: "practical", path: "health",
      jobContext: { ar: "أنت ممرض/ة في قسم الطوارئ بمستشفى كبير.", en: "You are a nurse in the ER of a major hospital." },
      question: { ar: "إذا جاء مريض إلى قسم الطوارئ مصابًا في اليد ويشكو من ألم حاد، ما هو الإجراء الأول؟", en: "If a patient comes to the ER with a hand injury and severe pain, what's the first step?" },
      options: [{ ar: "إجراء الأشعة لتحديد شدة الإصابة", en: "X-ray to determine injury severity" }, { ar: "تقديم مسكنات للألم ثم التوجه لمتابعة العلاج", en: "Provide painkillers then proceed with treatment" }, { ar: "تحليل حالة المريض عبر الفحص البدني فقط", en: "Analyze patient condition through physical exam only" }, { ar: "مغادرة المريض بعد إعطائه مسكنات خفيفة", en: "Discharge patient after light painkillers" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    { id: "h_nurse2", type: "open", path: "health",
      jobContext: { ar: "أنت ممرض/ة في قسم الطوارئ.", en: "You are an ER nurse." },
      question: { ar: "إذا كان لديك مريض يعاني من إصابة خطيرة وضغط دم منخفض، ما هي خطوات الإسعافات الأولية؟", en: "If you have a patient with a serious injury and low blood pressure, what are the first aid steps?" },
      options: [], correctIndex: -1, explanation: { ar: "", en: "" } },
    { id: "h_gp1", type: "practical", path: "health",
      jobContext: { ar: "أنت طبيب عام في عيادة.", en: "You are a general practitioner at a clinic." },
      question: { ar: "إذا جاءك مريض يشكو من ألم في الصدر وصعوبة في التنفس، ما هو أول إجراء؟", en: "If a patient complains of chest pain and breathing difficulty, what's the first step?" },
      options: [{ ar: "فحص ضغط الدم فقط", en: "Check blood pressure only" }, { ar: "إجراء تخطيط قلب للتأكد من وجود أزمة قلبية", en: "ECG to check for heart attack" }, { ar: "إعطاء أدوية مسكنة فقط وتوجيه المريض للراحة", en: "Give painkillers only and advise rest" }, { ar: "توجيه المريض للمختص فورًا", en: "Refer to specialist immediately" }], correctIndex: 1, explanation: { ar: "", en: "" } },
    { id: "h_gp2", type: "open", path: "health",
      jobContext: { ar: "أنت طبيب عام في عيادة.", en: "You are a general practitioner." },
      question: { ar: "كيف يمكنك التعامل مع ألم مفاجئ في الصدر عند المريض؟", en: "How would you handle sudden chest pain in a patient?" },
      options: [], correctIndex: -1, explanation: { ar: "", en: "" } },
    { id: "h_er1", type: "practical", path: "health",
      jobContext: { ar: "أنت طبيب طوارئ في مستشفى.", en: "You are an emergency medicine physician at a hospital." },
      question: { ar: "إذا جاءك مريض مصابًا في الرأس ويظهر عليه علامات ارتجاج، ما هو أول إجراء؟", en: "If a patient comes with a head injury showing concussion signs, what's the first step?" },
      options: [{ ar: "إجراء مسح بالأشعة المقطعية لتحديد درجة الإصابة", en: "CT scan to determine injury severity" }, { ar: "إعطاء مسكنات للألم وتوجيه المريض للراحة", en: "Give painkillers and advise rest" }, { ar: "انتظار الطبيب المختص وتقديم الإسعافات الأولية فقط", en: "Wait for specialist and provide first aid only" }, { ar: "مغادرة المريض بعد الراحة", en: "Discharge patient after rest" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    { id: "h_er2", type: "open", path: "health",
      jobContext: { ar: "أنت طبيب طوارئ.", en: "You are an emergency physician." },
      question: { ar: "إذا كان لديك مريض يعاني من إصابة خطيرة في الرأس مع نزيف داخلي، كيف ستتعامل مع الحالة؟", en: "If you have a patient with a serious head injury and internal bleeding, how would you handle it?" },
      options: [], correctIndex: -1, explanation: { ar: "", en: "" } },
    { id: "h_pt1", type: "practical", path: "health",
      jobContext: { ar: "أنت أخصائي علاج طبيعي.", en: "You are a physical therapist." },
      question: { ar: "إذا كان لديك مريض أجرى عملية جراحية للركبة، كيف ستساعده في عملية التعافي؟", en: "If a patient had knee surgery, how would you help them recover?" },
      options: [{ ar: "إعطاء الأدوية فقط لتخفيف الألم", en: "Give medication only for pain relief" }, { ar: "تحديد برنامج تمارين علاجية تدريجية", en: "Design a gradual therapeutic exercise program" }, { ar: "إراحة المريض وعدم إجراء أي نشاطات بدنية", en: "Rest patient with no physical activities" }, { ar: "التوجيه للمريض بالقيام بتمارين شاقة مباشرة", en: "Direct patient to intense exercises immediately" }], correctIndex: 1, explanation: { ar: "", en: "" } },
    { id: "h_pt2", type: "open", path: "health",
      jobContext: { ar: "أنت أخصائي علاج طبيعي.", en: "You are a physical therapist." },
      question: { ar: "كيف يمكنك تصميم برنامج علاج طبيعي لمريض يعاني من إصابة مزمنة في الركبة؟", en: "How would you design a physical therapy program for a patient with a chronic knee injury?" },
      options: [], correctIndex: -1, explanation: { ar: "", en: "" } },
    { id: "h_icu1", type: "practical", path: "health",
      jobContext: { ar: "أنت ممرض في وحدة العناية المركزة.", en: "You are an ICU nurse." },
      question: { ar: "إذا كان لديك مريض يعاني من انخفاض حاد في ضغط الدم، ماذا يجب أن تفعل؟", en: "If a patient has a severe drop in blood pressure, what should you do?" },
      options: [{ ar: "زيادة الأدوية وتقديم السوائل الوريدية", en: "Increase medication and provide IV fluids" }, { ar: "مراقبة المريض 24 ساعة دون تقديم أي أدوية", en: "Monitor patient 24 hours without medication" }, { ar: "تقديم مسكنات للألم فقط", en: "Provide painkillers only" }, { ar: "مغادرة المريض إلى غرفة العناية العادية", en: "Move patient to regular care room" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    { id: "h_icu2", type: "open", path: "health",
      jobContext: { ar: "أنت ممرض في وحدة العناية المركزة.", en: "You are an ICU nurse." },
      question: { ar: "كيف تتعامل مع مريض يعاني من مضاعفات صحية مفاجئة؟", en: "How do you handle a patient with sudden health complications?" },
      options: [], correctIndex: -1, explanation: { ar: "", en: "" } },
    { id: "h_pharm1", type: "practical", path: "health",
      jobContext: { ar: "أنت صيدلي مسؤول عن تحضير وتوزيع الأدوية.", en: "You are a pharmacist responsible for preparing and distributing medications." },
      question: { ar: "إذا جاءك مريض يشتكي من آلام شديدة ويطلب مسكنات قوية، كيف ستتعامل؟", en: "If a patient complains of severe pain and requests strong painkillers, how would you handle it?" },
      options: [{ ar: "صرف الدواء بناءً على طلب المريض", en: "Dispense based on patient request" }, { ar: "تحليل التاريخ الطبي للتأكد من ملاءمة الدواء", en: "Analyze medical history to ensure drug suitability" }, { ar: "إعطاء المريض أدوية خفيفة فقط", en: "Give only light medication" }, { ar: "توجيه المريض إلى طبيب مختص", en: "Refer patient to a specialist" }], correctIndex: 1, explanation: { ar: "", en: "" } },
    { id: "h_pharm2", type: "open", path: "health",
      jobContext: { ar: "أنت صيدلي.", en: "You are a pharmacist." },
      question: { ar: "كيف يمكنك ضمان أن المرضى يستخدمون الأدوية بشكل صحيح دون حدوث تفاعلات ضارة؟", en: "How can you ensure patients use medications correctly without harmful interactions?" },
      options: [], correctIndex: -1, explanation: { ar: "", en: "" } },
    // NEW challenge questions
    { id: "h_diabetes1", type: "practical", path: "health",
      jobContext: { ar: "المريض يحتاج إلى نصائح غذائية بعد إصابته بداء السكري.", en: "The patient needs dietary advice after being diagnosed with diabetes." },
      question: { ar: "ما هي النصائح الغذائية التي يجب أن تقدمها لمريض مصاب بالسكري؟", en: "What dietary advice should you give a diabetic patient?" },
      options: [{ ar: "تقليل تناول السكريات والتركيز على الخضروات والبروتينات", en: "Reduce sugar intake and focus on vegetables and proteins" }, { ar: "تناول السكريات بكثرة وتجنب الخضروات", en: "Eat lots of sugar and avoid vegetables" }, { ar: "تناول أطعمة دهنية ومقلية للحصول على طاقة", en: "Eat fatty and fried foods for energy" }, { ar: "زيادة تناول الأطعمة المعلبة لأنها أسرع في التحضير", en: "Increase canned foods as they're faster to prepare" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    { id: "h_sports1", type: "practical", path: "health",
      jobContext: { ar: "مريض رياضي يعاني من إصابة في الركبة أثناء ممارسة الرياضة.", en: "An athlete has a knee injury during sports." },
      question: { ar: "ما هو الإجراء الأول الذي يجب على الطبيب اتخاذه؟", en: "What is the first step the doctor should take?" },
      options: [{ ar: "إعطاء مضادات الالتهاب لتقليل التورم", en: "Give anti-inflammatories to reduce swelling" }, { ar: "إجراء جراحة فورية لإصلاح الركبة", en: "Perform immediate surgery to repair the knee" }, { ar: "ممارسة التمارين الرياضية لتقوية الركبة", en: "Exercise to strengthen the knee" }, { ar: "التشخيص الأولي باستخدام الأشعة قبل اتخاذ قرار العلاج", en: "Initial diagnosis using X-ray before treatment decision" }], correctIndex: 3, explanation: { ar: "", en: "" } },
    { id: "h_diagnosis1", type: "theory", path: "health",
      question: { ar: "كيف يتم تشخيص الأمراض؟", en: "How are diseases diagnosed?" },
      options: [{ ar: "من خلال الفحوصات المبدئية فقط", en: "Through initial examinations only" }, { ar: "عن طريق الفحص السريري والفحوصات المخبرية", en: "Through clinical examination and lab tests" }, { ar: "من خلال مراقبة الأعراض فقط", en: "Through symptom monitoring only" }, { ar: "لا يمكن تشخيص الأمراض في وقت مبكر", en: "Diseases cannot be diagnosed early" }], correctIndex: 1, explanation: { ar: "", en: "" } },
    { id: "h_medicine1", type: "theory", path: "health",
      question: { ar: "ما هو التوحيد في الطب؟", en: "What is integration in medicine?" },
      options: [{ ar: "التأكد من عدم تفاعل الأدوية مع بعضها", en: "Ensuring drugs don't interact with each other" }, { ar: "استخدام العلاج الواحد لجميع الحالات", en: "Using one treatment for all cases" }, { ar: "التركيز على العلاج الروحي فقط", en: "Focusing on spiritual treatment only" }, { ar: "التكامل بين العلاجات التقليدية والعصرية", en: "Integration between traditional and modern treatments" }], correctIndex: 3, explanation: { ar: "", en: "" } },
    // NEW: Expressive open-ended questions for deeper analysis
    { id: "h_expr1", type: "open", path: "health",
      question: { ar: "لماذا اخترت أن تتوجه نحو المجال الصحي؟ ما الذي يحفزك ويدفعك للاهتمام بصحة الآخرين؟ اذكر موقفاً شخصياً أثّر في قرارك.", en: "Why did you choose the health field? What motivates you to care for others' health? Mention a personal experience that influenced your decision." },
      options: [], correctIndex: -1, explanation: { ar: "", en: "" } },
    { id: "h_expr2", type: "open", path: "health",
      question: { ar: "إذا كان لديك مريض يرفض العلاج بسبب معتقداته الشخصية، كيف ستتعامل معه مع الحفاظ على احترامك لقراره وفي نفس الوقت حماية صحته؟", en: "If a patient refuses treatment due to personal beliefs, how would you handle it while respecting their decision and protecting their health?" },
      options: [], correctIndex: -1, explanation: { ar: "", en: "" } },
    { id: "h_expr3", type: "open", path: "health",
      question: { ar: "ما هي أكبر مشكلة صحية تعتقد أن المجتمع السعودي يواجهها اليوم؟ وكيف يمكن لمتخصص صحي شاب أن يساهم في حلها؟", en: "What's the biggest health problem Saudi society faces today? How can a young health professional contribute to solving it?" },
      options: [], correctIndex: -1, explanation: { ar: "", en: "" } },
    { id: "h_expr4", type: "open", path: "health",
      question: { ar: "صِف موقفاً تعرّضت فيه لضغط نفسي أو مسؤولية كبيرة. كيف تعاملت مع الضغط؟ وهل تعتقد أن هذه المهارة مهمة في المجال الصحي؟", en: "Describe a situation where you faced significant stress or responsibility. How did you handle it? Do you think this skill is important in healthcare?" },
      options: [], correctIndex: -1, explanation: { ar: "", en: "" } },
  ],
  business: [
    // Original theory (8)
    { id: "b1", type: "theory", path: "business", question: { ar: "\"العرض والطلب\" هما الركيزتان الأساسيتان لعلم:", en: "\"Supply and demand\" are the two main pillars of:" }, options: [{ ar: "الإدارة", en: "Management" }, { ar: "الاقتصاد", en: "Economics" }, { ar: "المحاسبة", en: "Accounting" }], correctIndex: 1, explanation: { ar: "", en: "" } },
    { id: "b2", type: "theory", path: "business", question: { ar: "القائمة التي توضح أرباح وخسائر الشركة خلال فترة معينة هي:", en: "The statement showing a company's profits and losses over a period is:" }, options: [{ ar: "الميزانية", en: "Balance Sheet" }, { ar: "قائمة الدخل", en: "Income Statement" }, { ar: "التدفق النقدي", en: "Cash Flow" }], correctIndex: 1, explanation: { ar: "", en: "" } },
    { id: "b3", type: "theory", path: "business", question: { ar: "عملية ترويج المنتجات للوصول إلى العميل المستهدف تسمى:", en: "The process of promoting products to reach target customers is called:" }, options: [{ ar: "التوزيع", en: "Distribution" }, { ar: "التسويق", en: "Marketing" }, { ar: "الإنتاج", en: "Production" }], correctIndex: 1, explanation: { ar: "", en: "" } },
    { id: "b4", type: "theory", path: "business", question: { ar: "\"رأس المال\" في المشاريع يشمل:", en: "\"Capital\" in business includes:" }, options: [{ ar: "الأموال فقط", en: "Money only" }, { ar: "الأموال والمعدات", en: "Money and equipment" }, { ar: "الموظفين فقط", en: "Employees only" }], correctIndex: 1, explanation: { ar: "", en: "" } },
    { id: "b5", type: "theory", path: "business", question: { ar: "عندما ترتفع الأسعار بشكل مستمر، تسمى هذه الظاهرة:", en: "When prices rise continuously, this phenomenon is called:" }, options: [{ ar: "الركود", en: "Recession" }, { ar: "التضخم", en: "Inflation" }, { ar: "الكساد", en: "Depression" }], correctIndex: 1, explanation: { ar: "", en: "" } },
    { id: "b6", type: "theory", path: "business", question: { ar: "الشخص الذي يتحمل المخاطرة لبدء مشروع جديد يسمى:", en: "A person who takes risks to start a new business is called:" }, options: [{ ar: "موظف", en: "Employee" }, { ar: "رائد أعمال", en: "Entrepreneur" }, { ar: "مستشار", en: "Consultant" }], correctIndex: 1, explanation: { ar: "", en: "" } },
    { id: "b7", type: "theory", path: "business", question: { ar: "أي مما يلي يعتبر من الأصول (Assets) للشركة؟", en: "Which of the following is considered a company asset?" }, options: [{ ar: "القروض", en: "Loans" }, { ar: "المباني والأراضي", en: "Buildings and land" }, { ar: "الرواتب", en: "Salaries" }], correctIndex: 1, explanation: { ar: "", en: "" } },
    { id: "b8", type: "theory", path: "business", question: { ar: "وظيفة \"التخطيط\" في الإدارة تهدف إلى:", en: "The \"planning\" function in management aims to:" }, options: [{ ar: "تحديد الأهداف المستقبلية", en: "Set future goals" }, { ar: "مراقبة الموظفين", en: "Monitor employees" }, { ar: "دفع الفواتير", en: "Pay bills" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    // Original interest (6)
    { id: "b9", type: "interest", path: "business", question: { ar: "هل تحب تنظيم الفعاليات وإدارة الميزانيات المخصصة لها؟", en: "Do you enjoy organizing events and managing their budgets?" }, options: [{ ar: "نعم", en: "Yes" }, { ar: "لا", en: "No" }, { ar: "أحياناً", en: "Sometimes" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    { id: "b10", type: "interest", path: "business", question: { ar: "هل تجد نفسك بارعاً في إقناع زملائك بفكرة معينة؟", en: "Do you find yourself skilled at convincing peers?" }, options: [{ ar: "نعم", en: "Yes" }, { ar: "لا", en: "No" }, { ar: "نادراً", en: "Rarely" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    { id: "b11", type: "interest", path: "business", question: { ar: "هل تهتم بمتابعة أخبار الشركات العالمية وأسعار العملات؟", en: "Are you interested in following global company news and currency rates?" }, options: [{ ar: "نعم", en: "Yes" }, { ar: "لا", en: "No" }, { ar: "قليلاً", en: "A little" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    { id: "b12", type: "interest", path: "business", question: { ar: "هل تفضل العمل المكتبي القيادي على العمل الميداني؟", en: "Do you prefer office leadership work over field work?" }, options: [{ ar: "نعم", en: "Yes" }, { ar: "لا", en: "No" }, { ar: "كلاهما", en: "Both" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    { id: "b13", type: "interest", path: "business", question: { ar: "هل تستمتع بحساب الأرقام والنسب المئوية والأرباح؟", en: "Do you enjoy calculating numbers, percentages, and profits?" }, options: [{ ar: "نعم", en: "Yes" }, { ar: "لا", en: "No" }, { ar: "أحياناً", en: "Sometimes" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    { id: "b14", type: "interest", path: "business", question: { ar: "هل تحب العمل في بيئة تتطلب التفاوض والبيع والشراء؟", en: "Do you like working in environments requiring negotiation?" }, options: [{ ar: "نعم", en: "Yes" }, { ar: "لا", en: "No" }, { ar: "ربما", en: "Maybe" }], correctIndex: 0, explanation: { ar: "", en: "" } },

    // NEW: Practical/Professional
    { id: "b_pm1", type: "practical", path: "business",
      jobContext: { ar: "أنت مدير مشروع مكلف بإدارة مشروع تجاري كبير.", en: "You are a project manager managing a large business project." },
      question: { ar: "ما هو أول قرار يجب عليك اتخاذه عند بدء إدارة مشروع جديد؟", en: "What's the first decision when starting to manage a new project?" },
      options: [{ ar: "تحديد الموارد التي ستحتاجها", en: "Identify needed resources" }, { ar: "وضع خطة زمنية مع تحديد المهام", en: "Create timeline with defined tasks" }, { ar: "تحديد الفريق الذي سيعمل في المشروع", en: "Define the project team" }, { ar: "التواصل مع العملاء لمراجعة نطاق المشروع", en: "Communicate with clients to review project scope" }], correctIndex: 1, explanation: { ar: "", en: "" } },
    { id: "b_pm2", type: "open", path: "business",
      jobContext: { ar: "أنت مدير مشروع.", en: "You are a project manager." },
      question: { ar: "إذا واجهت تأخيرًا في مواعيد تسليم المشروع بسبب مشكلة غير متوقعة مع أحد الموردين، كيف ستتعامل مع المشكلة؟", en: "If you face a project delay due to an unexpected supplier issue, how would you handle it?" },
      options: [], correctIndex: -1, explanation: { ar: "", en: "" } },
    { id: "b_ba1", type: "practical", path: "business",
      jobContext: { ar: "أنت محلل أعمال مكلف بتحليل العمليات التجارية.", en: "You are a business analyst analyzing business operations." },
      question: { ar: "ما هي الخطوة الأولى عندما تبدأ في دراسة تحليل البيانات؟", en: "What's the first step when starting data analysis?" },
      options: [{ ar: "جمع البيانات من مختلف الأقسام", en: "Collect data from various departments" }, { ar: "تحليل البيانات المالية فقط", en: "Analyze financial data only" }, { ar: "التواصل مع العملاء فقط لفهم احتياجاتهم", en: "Communicate with clients only" }, { ar: "تجميع المعلومات دون تصنيفها", en: "Gather information without classifying it" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    { id: "b_ba2", type: "open", path: "business",
      jobContext: { ar: "أنت محلل أعمال.", en: "You are a business analyst." },
      question: { ar: "كيف يمكنك استخدام البيانات المجمعة لتحسين الكفاءة التشغيلية للشركة؟", en: "How can you use collected data to improve operational efficiency?" },
      options: [], correctIndex: -1, explanation: { ar: "", en: "" } },
    { id: "b_mkt1", type: "practical", path: "business",
      jobContext: { ar: "أنت مدير تسويق مسؤول عن الاستراتيجيات التسويقية.", en: "You are a marketing manager responsible for marketing strategies." },
      question: { ar: "كيف يمكنك تحليل أداء حملة تسويقية بعد تنفيذها؟", en: "How can you analyze a marketing campaign's performance after execution?" },
      options: [{ ar: "تتبع عدد المبيعات فقط", en: "Track sales numbers only" }, { ar: "قياس الاستجابة والتفاعل عبر وسائل التواصل الاجتماعي", en: "Measure response and engagement on social media" }, { ar: "فقط قياس عدد الإعلانات المعروضة", en: "Only measure number of ads shown" }, { ar: "تحليل البيانات الإحصائية المتعلقة بالمبيعات فقط", en: "Analyze sales statistics only" }], correctIndex: 1, explanation: { ar: "", en: "" } },
    { id: "b_mkt2", type: "open", path: "business",
      jobContext: { ar: "أنت مدير تسويق.", en: "You are a marketing manager." },
      question: { ar: "إذا كنت ترى أن حملة تسويقية لم تحقق أهدافها، ما هي الخطوات التصحيحية التي ستتخذها؟", en: "If a marketing campaign didn't meet its goals, what corrective steps would you take?" },
      options: [], correctIndex: -1, explanation: { ar: "", en: "" } },
    { id: "b_fin1", type: "practical", path: "business",
      jobContext: { ar: "أنت مدير مالي مكلف بتخطيط وإدارة الشؤون المالية.", en: "You are a financial manager planning and managing finances." },
      question: { ar: "كيف تضمن إدارة الأموال بشكل سليم في الشركة؟", en: "How do you ensure proper money management in the company?" },
      options: [{ ar: "تتبع النفقات والإيرادات فقط", en: "Track expenses and revenues only" }, { ar: "تحليل الميزانية بشكل دوري وتعديلها حسب الحاجة", en: "Analyze budget periodically and adjust as needed" }, { ar: "تجاهل التدفقات النقدية والتركيز على الإيرادات", en: "Ignore cash flows and focus only on revenues" }, { ar: "زيادة الإنفاق لضمان نمو الشركة", en: "Increase spending to ensure company growth" }], correctIndex: 1, explanation: { ar: "", en: "" } },
    { id: "b_fin2", type: "open", path: "business",
      jobContext: { ar: "أنت مدير مالي.", en: "You are a financial manager." },
      question: { ar: "إذا كانت الشركة تواجه أزمة مالية بسبب زيادة النفقات، كيف ستعمل على تقليص التكاليف؟", en: "If the company faces a financial crisis due to increased expenses, how would you cut costs?" },
      options: [], correctIndex: -1, explanation: { ar: "", en: "" } },
    { id: "b_ops1", type: "practical", path: "business",
      jobContext: { ar: "أنت مدير عمليات مسؤول عن تحسين سير العمل.", en: "You are an operations manager improving workflow." },
      question: { ar: "إذا كان هناك انخفاض في الإنتاجية، ما هو الإجراء الأول؟", en: "If there's a drop in productivity, what's the first step?" },
      options: [{ ar: "تحليل البيانات لمعرفة السبب الرئيسي", en: "Analyze data to find the root cause" }, { ar: "زيادة عدد الموظفين لتحسين الأداء", en: "Increase staff to improve performance" }, { ar: "تغيير الأساليب دون تحليل الأسباب", en: "Change methods without analyzing causes" }, { ar: "ترك الأمور كما هي وانتظار تحسن الأوضاع", en: "Leave things as they are and wait for improvement" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    { id: "b_ops2", type: "open", path: "business",
      jobContext: { ar: "أنت مدير عمليات.", en: "You are an operations manager." },
      question: { ar: "كيف يمكن تحسين الكفاءة في قسم العمليات؟", en: "How can you improve efficiency in the operations department?" },
      options: [], correctIndex: -1, explanation: { ar: "", en: "" } },
    // NEW challenge/theory
    { id: "b_sales1", type: "practical", path: "business",
      jobContext: { ar: "أنت مسؤول عن تحليل بيانات المبيعات في شركتك.", en: "You are responsible for analyzing sales data at your company." },
      question: { ar: "كيف تقوم بتحليل سبب انخفاض المبيعات؟", en: "How do you analyze the cause of declining sales?" },
      options: [{ ar: "البحث عن الأنماط الشاذة في بيانات المبيعات وتقارير العملاء", en: "Search for anomalies in sales data and customer reports" }, { ar: "تقليل الميزانية التسويقية في الفروع المتأثرة", en: "Reduce marketing budget in affected branches" }, { ar: "تغيير الموظفين في الفروع المتأثرة", en: "Change staff in affected branches" }, { ar: "إغلاق الفروع التي لا تحقق أرباحًا", en: "Close unprofitable branches" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    { id: "b_team1", type: "practical", path: "business",
      jobContext: { ar: "أنت مسؤول عن بناء فريق عمل لمشروع جديد.", en: "You're building a team for a new project." },
      question: { ar: "ما هو أفضل حل للتعامل مع الصراع داخل الفريق؟", en: "What's the best solution for handling team conflict?" },
      options: [{ ar: "تنظيم جلسات تدريبية لتحسين التعاون", en: "Organize training sessions to improve cooperation" }, { ar: "تخصيص المهام بشكل أكثر تحديدًا لكل عضو", en: "Assign tasks more specifically to each member" }, { ar: "إبقاء الأمور كما هي دون تدخل", en: "Leave things as they are without intervention" }, { ar: "إبعاد الأعضاء الذين لا يتعاونون", en: "Remove non-cooperative members" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    { id: "b_accounting1", type: "theory", path: "business",
      question: { ar: "ما هي المحاسبة المالية؟", en: "What is financial accounting?" },
      options: [{ ar: "دراسة الأنظمة القانونية", en: "Study of legal systems" }, { ar: "إعداد التقارير المالية وتحليل الأداء المالي", en: "Preparing financial reports and analyzing financial performance" }, { ar: "دراسة قضايا الشركات", en: "Study of corporate cases" }, { ar: "تعلم التكنولوجيا لحساب الأرباح", en: "Learning technology to calculate profits" }], correctIndex: 1, explanation: { ar: "", en: "" } },
    { id: "b_strategic1", type: "theory", path: "business",
      question: { ar: "ما هو مفهوم الإدارة الاستراتيجية؟", en: "What is the concept of strategic management?" },
      options: [{ ar: "تنظيم الموارد", en: "Organizing resources" }, { ar: "وضع الخطط لتحقيق الأهداف طويلة المدى", en: "Setting plans to achieve long-term goals" }, { ar: "الإنتاج فقط", en: "Production only" }, { ar: "تحديد الموردين", en: "Identifying suppliers" }], correctIndex: 1, explanation: { ar: "", en: "" } },
    // NEW: Expressive open-ended questions for deeper analysis
    { id: "b_expr1", type: "open", path: "business",
      question: { ar: "لو كان لديك مبلغ 100,000 ريال لتبدأ مشروعك الخاص، ما هو المشروع الذي ستختاره؟ ولماذا تعتقد أنه سينجح في السوق السعودي؟", en: "If you had 100,000 SAR to start your own business, what would you choose? Why do you think it would succeed in the Saudi market?" },
      options: [], correctIndex: -1, explanation: { ar: "", en: "" } },
    { id: "b_expr2", type: "open", path: "business",
      question: { ar: "اذكر موقفاً قُدت فيه مجموعة من الأشخاص (في المدرسة أو خارجها). ما التحديات التي واجهتها وكيف تغلبت عليها؟ وماذا تعلمت عن القيادة؟", en: "Describe a situation where you led a group (in school or outside). What challenges did you face and how did you overcome them? What did you learn about leadership?" },
      options: [], correctIndex: -1, explanation: { ar: "", en: "" } },
    { id: "b_expr3", type: "open", path: "business",
      question: { ar: "إذا كنت مديراً لشركة ناشئة وبدأت الشركة تخسر عملاءها، ما هي الخطوات التي ستتخذها لإنقاذ الشركة؟ فكّر بشكل إبداعي.", en: "If you were managing a startup that's losing customers, what steps would you take to save it? Think creatively." },
      options: [], correctIndex: -1, explanation: { ar: "", en: "" } },
    { id: "b_expr4", type: "open", path: "business",
      question: { ar: "ما رأيك في رؤية 2030 من الناحية الاقتصادية؟ وكيف يمكن لشاب سعودي متخصص في إدارة الأعمال أن يساهم في تحقيقها؟", en: "What's your opinion on Vision 2030 economically? How can a young Saudi business graduate contribute to achieving it?" },
      options: [], correctIndex: -1, explanation: { ar: "", en: "" } },
  ],
  shariah: [
    // Original theory (8)
    { id: "sh1", type: "theory", path: "shariah", question: { ar: "القواعد الفقهية: أي منها تعني أن الأصل في الأشياء الطهارة حتى يثبت العكس؟", en: "Which legal maxim means things are presumed pure until proven otherwise?" }, options: [{ ar: "اليقين لا يزول بالشك", en: "Certainty is not overruled by doubt" }, { ar: "المشقة تجلب التيسير", en: "Hardship brings ease" }, { ar: "الضرر يزال", en: "Harm must be eliminated" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    { id: "sh2", type: "theory", path: "shariah", question: { ar: "ما هو السند في علم الحديث؟", en: "What is the 'Sanad' in Hadith science?" }, options: [{ ar: "متن الحديث", en: "Text of the Hadith" }, { ar: "سلسلة الرواة الموصلة للمتن", en: "Chain of narrators" }, { ar: "شرح الحديث", en: "Explanation of the Hadith" }], correctIndex: 1, explanation: { ar: "", en: "" } },
    { id: "sh3", type: "theory", path: "shariah", question: { ar: "أي من التالي يعتبر من المصادر \"التبعية\" للتشريع الإسلامي؟", en: "Which is a 'secondary' source of Islamic legislation?" }, options: [{ ar: "القرآن الكريم", en: "The Holy Quran" }, { ar: "السنة النبوية", en: "Prophetic Sunnah" }, { ar: "القياس", en: "Analogy (Qiyas)" }], correctIndex: 2, explanation: { ar: "", en: "" } },
    { id: "sh4", type: "theory", path: "shariah", question: { ar: "نظام الحكم في المملكة العربية السعودية يستمد سلطته من:", en: "Saudi Arabia's governance derives its authority from:" }, options: [{ ar: "الأنظمة الدولية", en: "International systems" }, { ar: "كتاب الله وسنة رسوله", en: "The Book of Allah and Sunnah" }, { ar: "الأعراف القبلية", en: "Tribal customs" }], correctIndex: 1, explanation: { ar: "", en: "" } },
    { id: "sh5", type: "theory", path: "shariah", question: { ar: "ما هو الفرق بين \"القضاء\" و \"الفتوى\"؟", en: "What is the difference between 'judiciary' and 'fatwa'?" }, options: [{ ar: "القضاء ملزم والفتوى غير ملزمة", en: "Judiciary is binding, fatwa is not" }, { ar: "الفتوى ملزمة والقضاء لا", en: "Fatwa is binding, judiciary is not" }, { ar: "كلاهما غير ملزم", en: "Neither is binding" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    { id: "sh6", type: "theory", path: "shariah", question: { ar: "الورثة الذين لهم نصيب مقدر في الشرع يسمون:", en: "Heirs with a fixed share in Shari'ah are called:" }, options: [{ ar: "العصبة", en: "Agnates" }, { ar: "أصحاب الفروض", en: "Fixed-share heirs" }, { ar: "ذوي الأرحام", en: "Relatives" }], correctIndex: 1, explanation: { ar: "", en: "" } },
    { id: "sh7", type: "theory", path: "shariah", question: { ar: "\"التعزير\" في الشريعة الإسلامية هو عقوبة:", en: "'Ta'zir' in Islamic Shari'ah is a punishment that is:" }, options: [{ ar: "مقدرة شرعاً", en: "Fixed by Shari'ah" }, { ar: "يترك تقديرها للقاضي", en: "Left to the judge's discretion" }, { ar: "لا عقوبة فيها", en: "No punishment" }], correctIndex: 1, explanation: { ar: "", en: "" } },
    { id: "sh8", type: "theory", path: "shariah", question: { ar: "الجهة المسؤولة عن توثيق العقود والوكالات في المملكة هي:", en: "The authority for documenting contracts in Saudi Arabia is:" }, options: [{ ar: "وزارة الصحة", en: "Ministry of Health" }, { ar: "كتابة العدل", en: "Notary Public" }, { ar: "هيئة الرياضة", en: "Sports Authority" }], correctIndex: 1, explanation: { ar: "", en: "" } },
    // Original interest (6)
    { id: "sh9", type: "interest", path: "shariah", question: { ar: "هل تستمتع بقراءة الكتب التاريخية والبحث في أصول القوانين؟", en: "Do you enjoy reading historical books and researching the origins of laws?" }, options: [{ ar: "نعم", en: "Yes" }, { ar: "أحياناً", en: "Sometimes" }, { ar: "لا", en: "No" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    { id: "sh10", type: "interest", path: "shariah", question: { ar: "هل تجد لديك القدرة على التحدث أمام الجمهور وإقناعهم بالحجج؟", en: "Can you speak publicly and convince with arguments?" }, options: [{ ar: "نعم", en: "Yes" }, { ar: "أحياناً", en: "Sometimes" }, { ar: "لا", en: "No" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    { id: "sh11", type: "interest", path: "shariah", question: { ar: "هل تميل إلى تحليل النصوص الأدبية والشرعية واستخراج الأحكام منها؟", en: "Do you tend to analyze texts and extract rulings?" }, options: [{ ar: "نعم", en: "Yes" }, { ar: "أحياناً", en: "Sometimes" }, { ar: "لا", en: "No" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    { id: "sh12", type: "interest", path: "shariah", question: { ar: "هل تشعر بالشغف عند الدفاع عن حقوق الآخرين وتحقيق العدالة؟", en: "Do you feel passionate about defending rights and achieving justice?" }, options: [{ ar: "نعم", en: "Yes" }, { ar: "أحياناً", en: "Sometimes" }, { ar: "لا", en: "No" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    { id: "sh13", type: "interest", path: "shariah", question: { ar: "هل تفضل دراسة المواد النظرية على المواد العلمية؟", en: "Do you prefer theoretical subjects over scientific ones?" }, options: [{ ar: "نعم", en: "Yes" }, { ar: "لا", en: "No" }, { ar: "كلاهما", en: "Both" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    { id: "sh14", type: "interest", path: "shariah", question: { ar: "هل لديك اهتمام بمتابعة القضايا الحقوقية والمحاكمات؟", en: "Are you interested in following legal cases and trials?" }, options: [{ ar: "نعم", en: "Yes" }, { ar: "لا", en: "No" }, { ar: "أحياناً", en: "Sometimes" }], correctIndex: 0, explanation: { ar: "", en: "" } },

    // NEW: Practical/Professional
    { id: "sh_scholar1", type: "practical", path: "shariah",
      jobContext: { ar: "أنت فقيه شرعي مكلف بتقديم الاستشارات الدينية.", en: "You are an Islamic scholar providing religious consultations." },
      question: { ar: "إذا كنت تواجه مسألة شرعية تتعلق بالزواج المؤقت، كيف تحدد حكمها؟", en: "If facing a Shari'ah question about temporary marriage, how do you determine its ruling?" },
      options: [{ ar: "الزواج المؤقت محرم في جميع الحالات", en: "Temporary marriage is forbidden in all cases" }, { ar: "الزواج المؤقت مباح في حالات معينة مع شروط", en: "Temporary marriage is permissible in certain cases with conditions" }, { ar: "الزواج المؤقت مسموح بشرط رضا الطرفين فقط", en: "Permissible only with consent of both parties" }, { ar: "الزواج المؤقت جائز لتخفيف الضغط الاجتماعي", en: "Permissible to relieve social pressure" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    { id: "sh_scholar2", type: "open", path: "shariah",
      jobContext: { ar: "أنت فقيه شرعي.", en: "You are an Islamic scholar." },
      question: { ar: "كيف يمكنك استخدام النصوص الشرعية لتقديم استشارة حول قضية الزواج المؤقت في المجتمع المعاصر؟", en: "How can you use religious texts to advise on temporary marriage in modern society?" },
      options: [], correctIndex: -1, explanation: { ar: "", en: "" } },
    { id: "sh_legal1", type: "practical", path: "shariah",
      jobContext: { ar: "أنت مستشار قانوني تقدم استشارات قانونية.", en: "You are a legal consultant providing legal advice." },
      question: { ar: "إذا طلب منك شخص استشارة بشأن العقوبات في القضايا الجنائية، ما هو الإجراء؟", en: "If asked for advice on criminal penalties, what's the procedure?" },
      options: [{ ar: "تقديم استشارة بناءً على الأنظمة القانونية الحالية فقط", en: "Advise based on current legal systems only" }, { ar: "دراسة السوابق القضائية لتقديم استشارة دقيقة", en: "Study legal precedents for accurate advice" }, { ar: "التأكيد على أن العقوبات خفيفة ولا داعي للقلق", en: "Assure penalties are light, no need to worry" }, { ar: "لا أستطيع تقديم استشارة لأن القوانين تتغير", en: "Cannot advise because laws change" }], correctIndex: 1, explanation: { ar: "", en: "" } },
    { id: "sh_legal2", type: "open", path: "shariah",
      jobContext: { ar: "أنت مستشار قانوني.", en: "You are a legal consultant." },
      question: { ar: "إذا كان لديك عميل متهم بجريمة مالية، ما هي الإجراءات القانونية التي ستتخذها؟", en: "If you have a client accused of financial crime, what legal steps would you take?" },
      options: [], correctIndex: -1, explanation: { ar: "", en: "" } },
    { id: "sh_defense1", type: "practical", path: "shariah",
      jobContext: { ar: "أنت محامي دفاع مختص في تمثيل العملاء.", en: "You are a defense lawyer representing clients." },
      question: { ar: "إذا تم اتهام شخص بجريمة سرقة، ما هو الإجراء الأول؟", en: "If someone is accused of theft, what's the first step?" },
      options: [{ ar: "تقديم دفاع قوي باستخدام الأدلة والشهادات", en: "Present strong defense using evidence and testimonies" }, { ar: "الاعتراف بالذنب والبحث عن التخفيف", en: "Plead guilty and seek leniency" }, { ar: "محاولة التوصل إلى اتفاق تسوية مع النيابة", en: "Try to reach a settlement with prosecution" }, { ar: "تقديم التفاصيل الشخصية للتخفيف", en: "Present personal details for leniency" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    { id: "sh_defense2", type: "open", path: "shariah",
      jobContext: { ar: "أنت محامي دفاع.", en: "You are a defense lawyer." },
      question: { ar: "كيف يمكنك الدفاع عن شخص متهم بجريمة سرقة وتقديم الدليل على براءته؟", en: "How can you defend someone accused of theft and prove their innocence?" },
      options: [], correctIndex: -1, explanation: { ar: "", en: "" } },
    { id: "sh_judge1", type: "practical", path: "shariah",
      jobContext: { ar: "أنت قاضي شرعي مسؤول عن الحكم في القضايا الشرعية.", en: "You are a Sharia judge ruling on religious cases." },
      question: { ar: "إذا كانت هناك قضية نفقة بين الزوجين، ما هو الحكم الشرعي؟", en: "If there's an alimony case between spouses, what's the Shari'ah ruling?" },
      options: [{ ar: "الزوج ملزم بدفع النفقة وفقًا للقدرة المالية", en: "Husband must pay according to financial ability" }, { ar: "الزوجة ملزمة بدفع النفقة إذا كان لديها دخل", en: "Wife must pay if she has income" }, { ar: "نفقة غير مستحقة إذا كانت الزوجة تعمل", en: "No alimony if wife works" }, { ar: "لا يجب على الزوج دفع النفقة إذا كان هناك خلاف", en: "Husband needn't pay if there's disagreement" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    { id: "sh_judge2", type: "open", path: "shariah",
      jobContext: { ar: "أنت قاضي شرعي.", en: "You are a Sharia judge." },
      question: { ar: "كيف يمكنك التعامل مع قضية نفقة بين الزوجين وفقًا للشريعة الإسلامية؟", en: "How would you handle an alimony case between spouses according to Islamic law?" },
      options: [], correctIndex: -1, explanation: { ar: "", en: "" } },
    { id: "sh_consultant1", type: "practical", path: "shariah",
      jobContext: { ar: "أنت محامي مختص في الاستشارات القانونية الشرعية.", en: "You are a Sharia legal consultant." },
      question: { ar: "إذا كان لديك عميل يرغب في إتمام عقد زواج وفقًا للشرع، ما هي الخطوات؟", en: "If a client wants to complete a marriage contract per Shari'ah, what are the steps?" },
      options: [{ ar: "تحديد المهر والشروط التي يوافق عليها الطرفان", en: "Define dowry and conditions agreed by both parties" }, { ar: "إنهاء العقد دون تحديد المهر", en: "Complete contract without defining dowry" }, { ar: "إجراء الموافقة الشفهية على العقد", en: "Verbal approval of the contract" }, { ar: "البدء في الزواج دون أي إجراءات رسمية", en: "Start marriage without formal procedures" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    { id: "sh_consultant2", type: "open", path: "shariah",
      jobContext: { ar: "أنت محامي استشارات شرعية.", en: "You are a Sharia legal consultant." },
      question: { ar: "إذا طلب منك عميل استشارة قانونية شرعية بشأن العقود التجارية بناءً على التمويل الإسلامي، كيف يمكن تقديم استشارة شرعية؟", en: "If a client asks for Sharia legal advice on commercial contracts based on Islamic finance, how would you provide advice?" },
      options: [], correctIndex: -1, explanation: { ar: "", en: "" } },
    // NEW challenge/theory
    { id: "sh_prayer1", type: "practical", path: "shariah",
      jobContext: { ar: "لديك نص شرعي يتناقض مع واقع حديث متعلق بأوقات الصلاة.", en: "You have a religious text conflicting with modern reality regarding prayer times." },
      question: { ar: "هل صلاة العصر تُؤدى في الوقت الضيق عند التعارض مع مسؤوليات العمل؟", en: "Should Asr prayer be performed in limited time when conflicting with work responsibilities?" },
      options: [{ ar: "نعم، يجوز تأجيلها مع الذهاب للعمل", en: "Yes, it can be delayed for work" }, { ar: "لا، يجب أداء الصلاة في وقتها المحدد", en: "No, prayer must be performed on time" }, { ar: "يجوز أداء الصلاة في أي وقت من اليوم", en: "Prayer can be performed anytime" }, { ar: "نعم، يمكن أداء الصلاة في المساء", en: "Yes, prayer can be done in the evening" }], correctIndex: 1, explanation: { ar: "", en: "" } },
    { id: "sh_labor1", type: "practical", path: "shariah",
      jobContext: { ar: "تقدم موظف بشكوى ضد صاحب العمل بسبب التسريح التعسفي.", en: "An employee filed a complaint against the employer for unfair dismissal." },
      question: { ar: "إذا تم تسريح العامل دون سبب قانوني، ما هو الحق الذي يملكه وفقًا للقانون السعودي؟", en: "If a worker is dismissed without legal reason, what right does he have under Saudi law?" },
      options: [{ ar: "العامل يحق له الحصول على تعويض مالي عن مدة الخدمة", en: "Worker has right to financial compensation for service period" }, { ar: "العامل لا يحق له الحصول على أي تعويض", en: "Worker has no right to any compensation" }, { ar: "العامل يحق له العودة للعمل دون تعويض", en: "Worker can return to work without compensation" }, { ar: "العامل يحق له رفع قضية في المحكمة العمالية", en: "Worker has right to file case in labor court" }], correctIndex: 0, explanation: { ar: "", en: "" } },
    { id: "sh_fiqh1", type: "theory", path: "shariah",
      question: { ar: "ما هو مفهوم \"الفقه\"؟", en: "What is the concept of 'Fiqh'?" },
      options: [{ ar: "دراسة القرآن الكريم", en: "Study of the Holy Quran" }, { ar: "تفسير الحديث النبوي", en: "Interpretation of Prophetic Hadith" }, { ar: "فهم الأحكام الشرعية من القرآن والسنة", en: "Understanding legal rulings from Quran and Sunnah" }, { ar: "التفسير اللغوي للأدلة الشرعية", en: "Linguistic interpretation of Shari'ah evidence" }], correctIndex: 2, explanation: { ar: "", en: "" } },
    { id: "sh_usul1", type: "theory", path: "shariah",
      question: { ar: "ما هو الفرق بين الفقه وأصول الفقه؟", en: "What is the difference between Fiqh and Usul al-Fiqh?" },
      options: [{ ar: "الفقه يتعلق بالمعاملات فقط", en: "Fiqh relates to transactions only" }, { ar: "الفقه هو التفسير الشخصي للأدلة", en: "Fiqh is personal interpretation of evidence" }, { ar: "أصول الفقه هي القواعد التي يعتمد عليها الفقهاء لتفسير النصوص الشرعية", en: "Usul al-Fiqh are the rules scholars rely on to interpret religious texts" }, { ar: "الفقه هو تفسير القرآن فقط", en: "Fiqh is interpretation of Quran only" }], correctIndex: 2, explanation: { ar: "", en: "" } },
  ],
};

// Preference questions (cross-path)
export const preferenceQuestions: Question[] = [
  { id: "pref1", type: "interest", path: "health",
    question: { ar: "ما هو النشاط الذي تستمتع به أكثر في يومك؟", en: "What activity do you enjoy most in your day?" },
    options: [{ ar: "مشاهدة فيديوهات تعليمية حول الإسعافات الأولية أو الرعاية الصحية", en: "Watching educational videos about first aid or healthcare" }, { ar: "مشاهدة فيديوهات عن كيفية بناء الأجهزة أو تطوير البرمجيات", en: "Watching videos about building devices or developing software" }, { ar: "تعلم ما يقوله الحديث النبوي في مواضيع مختلفة", en: "Learning what Hadith says about different topics" }, { ar: "التنسيق والتنظيم للأنشطة وإدارة الأمور المختلفة", en: "Coordinating and organizing activities" }], correctIndex: 0, explanation: { ar: "", en: "" } },
  { id: "pref2", type: "interest", path: "shariah",
    question: { ar: "ما هو نوع البيئة التي تجدها أكثر توافقًا معك؟", en: "What type of environment do you find most compatible?" },
    options: [{ ar: "بيئة علمية ودينية", en: "Scientific and religious environment" }, { ar: "بيئة تكنولوجيا وأجهزة", en: "Technology and devices environment" }, { ar: "بيئة طبية وصحية", en: "Medical and health environment" }, { ar: "بيئة ريادية للأعمال", en: "Business entrepreneurial environment" }], correctIndex: 0, explanation: { ar: "", en: "" } },
  { id: "pref3", type: "interest", path: "cs",
    question: { ar: "في أي مجال تجد نفسك أكثر إبداعًا؟", en: "In which field do you find yourself most creative?" },
    options: [{ ar: "في حل المشكلات التقنية والبرمجية", en: "Solving technical and programming problems" }, { ar: "التفاعل مع الناس وتقديم المساعدة الصحية", en: "Interacting with people and providing health assistance" }, { ar: "في تنظيم الأعمال والتخطيط الاستراتيجي", en: "Organizing business and strategic planning" }, { ar: "في تفسير وتدريس المواد الدينية", en: "Interpreting and teaching religious materials" }], correctIndex: 0, explanation: { ar: "", en: "" } },
  { id: "pref4", type: "interest", path: "business",
    question: { ar: "أي نوع من الأعمال تجد نفسك فيه؟", en: "What type of work do you find yourself in?" },
    options: [{ ar: "عمل يعتمد على تحليل المشكلات وتقديم استشارات دينية أو شرعية", en: "Work based on analyzing problems and providing religious advice" }, { ar: "عمل يعتمد على تشخيص وعلاج المشكلات الصحية", en: "Work based on diagnosing and treating health problems" }, { ar: "عمل قائم على القيادة والتنظيم", en: "Work based on leadership and organization" }, { ar: "عمل قائم على البرمجة وحل المشكلات التقنية", en: "Work based on programming and solving technical problems" }], correctIndex: 2, explanation: { ar: "", en: "" } },
];

// Helper: pick N random items from array
function pickRandom<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(n, shuffled.length));
}

// Get questions for a specific pathway exam with equal distribution across question types
// 20 MCQ total: equal parts from theory, interest, and practical sections
export function getPathwayExamQuestions(path: string, count: number = 18): Question[] {
  const pathQuestions = questions[path] || [];
  const theory = pathQuestions.filter(q => q.type === "theory");
  const interest = pathQuestions.filter(q => q.type === "interest");
  const practical = pathQuestions.filter(q => q.type === "practical");

  // Equal distribution across the 3 types
  const perType = Math.floor(count / 3);
  const remainder = count - perType * 3;

  const selected = [
    ...pickRandom(theory, perType + (remainder > 0 ? 1 : 0)),
    ...pickRandom(interest, perType + (remainder > 1 ? 1 : 0)),
    ...pickRandom(practical, perType),
  ];

  // Group by type: theory first, then interest, then practical (no shuffle)
  return selected;
}

// Get all open-ended questions for a pathway
export function getOpenEndedQuestions(path?: string): Question[] {
  if (path) {
    return (questions[path] || []).filter(q => q.type === "open");
  }
  return Object.values(questions).flat().filter(q => q.type === "open");
}

// Helper to get random questions for the general exam with equal parts from each pathway
// 38 MCQ + 2 open-ended (added by AI) = 40 total
// Equal parts from each of the 4 pathways, plus preference questions
export function getGeneralExamQuestions(count: number = 38): Question[] {
  const paths = ["cs", "health", "business", "shariah"];
  // Reserve spots for preference questions (4 total)
  const prefCount = Math.min(preferenceQuestions.length, 4);
  const pathCount = count - prefCount; // questions from pathways
  const perPath = Math.floor(pathCount / paths.length);
  const remainder = pathCount - perPath * paths.length;

  const selected: Question[] = [];
  paths.forEach((path, i) => {
    const pathQs = (questions[path] || []).filter(q => q.type !== "open");
    const n = perPath + (i < remainder ? 1 : 0);
    
    // Within each path, try to get equal parts from theory, interest, practical
    const theory = pathQs.filter(q => q.type === "theory");
    const interest = pathQs.filter(q => q.type === "interest");
    const practical = pathQs.filter(q => q.type === "practical");
    
    const perSubType = Math.floor(n / 3);
    const subRemainder = n - perSubType * 3;
    
    const pathSelected = [
      ...pickRandom(theory, perSubType + (subRemainder > 0 ? 1 : 0)),
      ...pickRandom(interest, perSubType + (subRemainder > 1 ? 1 : 0)),
      ...pickRandom(practical, perSubType),
    ];
    
    selected.push(...pathSelected.slice(0, n));
  });

  // Add preference questions to interest group
  const prefQs = pickRandom(preferenceQuestions, prefCount);

  // Group by type: theory first, then interest (+ preference), then practical
  const theoryGroup = selected.filter(q => q.type === "theory");
  const interestGroup = [...selected.filter(q => q.type === "interest"), ...prefQs];
  const practicalGroup = selected.filter(q => q.type === "practical");

  return [...theoryGroup, ...interestGroup, ...practicalGroup];
}
