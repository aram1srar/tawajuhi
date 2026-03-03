export type Locale = "ar" | "en";

const translations = {
  ar: {
    nav: {
      home: "الرئيسية",
      paths: "المسارات المهنية",
      about: "عن توجيهي",
      start: "ابدأ الاختبار",
    },
    hero: {
      title: "اكتشف مسارك المهني",
      subtitle: "مع توجيهي",
      description: "منصة تفاعلية تساعد طلاب الثانوية في المملكة العربية السعودية على اختيار المسار المهني الأنسب من خلال محاكاة واقعية وتقييم ذكي",
      cta: "ابدأ رحلتك",
      secondary: "اعرف المزيد",
    },
    paths: {
      title: "المسارات المهنية",
      subtitle: "اكتشف خمسة مسارات رئيسية مصممة خصيصاً لتتوافق مع المناهج السعودية",
      health: {
        title: "مسار الصحة والحياة",
        description: "يهدف إلى تدريب الطلاب على فهم العلوم الطبية والرعاية الصحية وتأهيلهم للعمل في المجال الطبي",
        skills: ["التواصل مع المرضى", "الإسعافات الأولية", "العمل تحت ضغط", "الاهتمام بالتفاصيل"],
        overview: "مسار الصحة والحياة يهدف إلى تدريب الطلاب على فهم العلوم الطبية والرعاية الصحية. الطلاب في هذا المسار يدرسون مواضيع مثل التمريض، الطب، والرعاية الصحية لتأهيلهم للعمل في المجال الطبي. كما يعزز المسار الوعي الصحي والفهم العميق لوظائف الجسم البشري وأساسيات التشخيص والعلاج.",
        studyPlan: {
          year2: "الرياضيات 2، اللغة الإنجليزية 2، الكيمياء 2، الأحياء 2، الفيزياء 2، التوحيد 1، الكفايات اللغوية 2، التقنية الرقمية 2، مبادئ العلوم الصحية، اللياقة والثقافة الصحية",
          year3: "الرياضيات 3، اللغة الإنجليزية 3، الفيزياء 3، الكيمياء 3، علوم الأرض والفضاء، الفقه 1، الدراسات الأدبية، الرعاية الصحية، الإحصاء، أنظمة جسم الإنسان، المهارات الحياتية، التربية الصحية والبدنية 2، البحث ومصادر المعلومات، مشروع التخرج",
        },
      },
      cs: {
        title: "مسار علوم الحاسب والهندسة",
        description: "يركز على تدريب الطلاب في مجالات التقنية والهندسة وتصميم البرمجيات وتحليل الأنظمة",
        skills: ["البرمجة والتطوير", "التفكير الهندسي", "التحليل المعقد", "الإبداع في التصميم"],
        overview: "يركز مسار علوم الحاسب والهندسة على تدريب الطلاب في مجالات التقنية والهندسة. يتعلم الطلاب كيفية تصميم البرمجيات وتحليل الأنظمة، بالإضافة إلى تطبيق مفاهيم الهندسة في مجال التكنولوجيا. يُعد هذا المسار الأنسب للطلاب الذين لديهم اهتمام بالتقنيات الحديثة ويشمل تطبيقات البرمجة والتصميم الهندسي.",
        studyPlan: {
          year2: "الرياضيات 2، اللغة الإنجليزية 2، الكيمياء 2، الأحياء 2، الفيزياء 2، التوحيد 1، الكفايات اللغوية 2، إنترنت الأشياء، علم البيانات، الهندسة، اللياقة والثقافة الصحية",
          year3: "الرياضيات 3، اللغة الإنجليزية 3، الفيزياء 3، الكيمياء 3، علوم الأرض والفضاء، الفقه 1، الدراسات الأدبية، الذكاء الاصطناعي، الأمن السيبراني، هندسة البرمجيات، التصميم الهندسي، المهارات الحياتية، التربية الصحية والبدنية 2، البحث ومصادر المعلومات، مشروع التخرج",
        },
      },
      business: {
        title: "مسار إدارة الأعمال",
        description: "يركز على توفير معرفة شاملة في إدارة الشركات، التمويل، والتسويق",
        skills: ["القيادة وإدارة الفرق", "التفكير الاستراتيجي", "التواصل والتفاوض", "التحليل المالي"],
        overview: "مسار إدارة الأعمال يركز على توفير معرفة شاملة في مجالات إدارة الشركات، التمويل، والتسويق. يتعلم الطلاب في هذا المسار كيفية إدارة الموارد، إدارة المشاريع، والتخطيط الاستراتيجي. هذا المسار يعد الطلاب للعمل في مجال الأعمال من خلال تعلم مهارات التنظيم والقيادة.",
        studyPlan: {
          year2: "اللغة الإنجليزية 2، صناعة القرار في الأعمال، مقدمة في الأعمال، الإدارة المالية، مبادئ الاقتصاد، التوحيد 1، التفسير 1، الكفايات اللغوية 2، الدراسات اللغوية، التقنية الرقمية 2، التاريخ، الفنون، اللياقة والثقافة الصحية",
          year3: "اللغة الإنجليزية 3، الفقه 1، الدراسات الأدبية، الدراسات النفسية والاجتماعية، الدراسات البلاغية والنقدية، السكرتارية والإدارة المكتبية، مبادئ القانون، تطبيقات في القانون، إدارة الفعاليات، مبادئ الإدارة، تخطيط الحملات التسويقية، الإحصاء، الجغرافيا، المواطنة الرقمية، المهارات الحياتية، التربية الصحية والبدنية 2، البحث ومصادر المعلومات، مشروع التخرج",
        },
      },
      shariah: {
        title: "المسار الشرعي",
        description: "يركز على الدراسات الإسلامية والمواضيع الدينية مثل الفقه والتفسير والحديث",
        skills: ["تفسير النصوص الدينية", "التحليل الفقهي", "الوعي بالثقافة الإسلامية", "الإقناع الشرعي"],
        overview: "يركز المسار الشرعي على الدراسات الإسلامية والمواضيع الدينية مثل الفقه والتفسير والحديث. يتم تدريب الطلاب في هذا المسار على الفقه الإسلامي والقانون الشرعي، كما يشمل فهم المبادئ الدينية وتطبيقاتها في الحياة اليومية.",
        studyPlan: {
          year2: "القرآن الكريم 1، اللغة الإنجليزية 2، التوحيد 1، التوحيد 2، التفسير 1، الحديث 2، علوم القرآن، القراءات 1، القراءات 2، الكفايات اللغوية 2، الدراسات اللغوية، التقنية الرقمية 2، التاريخ، الفنون، اللياقة والثقافة الصحية",
          year3: "القرآن الكريم 2، اللغة الإنجليزية 3، الفقه 1، الفقه 2، أصول الفقه، مصطلح الحديث، الفرائض، التفسير 2، مبادئ القانون، تطبيقات في القانون، الدراسات الأدبية، الدراسات النفسية والاجتماعية، الدراسات البلاغية والنقدية، الجغرافيا، المواطنة الرقمية، المهارات الحياتية، التربية الصحية والبدنية 2، البحث ومصادر المعلومات، مشروع التخرج",
        },
      },
      general: {
        title: "المسار العام",
        description: "مسار شامل يوفر فرصًا متنوعة لتعلم مواد أكاديمية وفنية في مجالات مختلفة",
        skills: ["التفكير النقدي", "إدارة الوقت", "اللغة العربية والرياضيات", "التكيف والتعلم"],
        overview: "المسار العام هو مسار شامل يوفر للطلاب فرصًا متنوعة لتعلم مواد أكاديمية وفنية في مجالات مختلفة، مما يتيح لهم إمكانية التوجه إلى التعليم العالي في مجالات متعددة بعد التخرج. يشمل هذا المسار التعليم الشامل للمفاهيم الأساسية في العلوم الإنسانية، العلوم الطبيعية، الرياضيات، والدراسات الإسلامية. يُعتبر المسار العام مناسبًا للطلاب الذين ليس لديهم توجه أو اهتمامات محددة ويرغبون في دراسة مواد متنوعة قبل اتخاذ القرار النهائي بشأن مسارهم الأكاديمي.",
        studyPlan: {
          year2: "الرياضيات 2، اللغة الإنجليزية 2، الكيمياء 2، الأحياء 2، الفيزياء 2، التوحيد 1، الكفايات اللغوية، التقنية الرقمية 2، التاريخ، الفنون، اللياقة والثقافة الصحية",
          year3: "الرياضيات 3، اللغة الإنجليزية 3، الفيزياء 3، الكيمياء 3، علوم الأرض والفضاء، الفقه 1، الدراسات الأدبية، الدراسات النفسية والاجتماعية، التقنية الرقمية 3، المواطنة الرقمية، الجغرافيا، المهارات الحياتية، التربية الصحية والبدنية 2، البحث ومصادر المعلومات، المجال الاختياري",
        },
      },
    },
    pathDetails: {
      overview: "نبذة عن المسار",
      skills: "المهارات المطلوبة",
      studyPlan: "الخطة الدراسية",
      year2: "السنة الثانية",
      year3: "السنة الثالثة",
      tryTest: "جرّب اختبار المسار",
    },
    features: {
      title: "كيف يعمل توجيهي؟",
      sim: { title: "محاكاة واقعية", desc: "خوض تجارب عملية تحاكي بيئة العمل الحقيقية" },
      theory: { title: "أسئلة نظرية", desc: "اختبار معرفتك بأسئلة متنوعة من المنهج السعودي" },
      ai: { title: "تقييم ذكي", desc: "تحليل أدائك بالذكاء الاصطناعي مع توصيات مخصصة" },
      results: { title: "نتائج شاملة", desc: "تقرير مفصل عن نقاط القوة ومجالات التحسين" },
    },
    footer: {
      tagline: "نحو مستقبل مهني أفضل",
      rights: "جميع الحقوق محفوظة",
    },
  },
  en: {
    nav: {
      home: "Home",
      paths: "Career Paths",
      about: "About",
      start: "Start Test",
    },
    hero: {
      title: "Discover Your Career Path",
      subtitle: "With Tawajohi",
      description: "An interactive platform helping Saudi high school students choose the most suitable career path through real-world simulations and AI-powered assessment",
      cta: "Start Your Journey",
      secondary: "Learn More",
    },
    paths: {
      title: "Career Paths",
      subtitle: "Explore five main paths designed to align with the Saudi curriculum",
      health: {
        title: "Health & Life Path",
        description: "Training students to understand medical sciences and healthcare to prepare them for the medical field",
        skills: ["Patient Communication", "First Aid", "Working Under Pressure", "Attention to Detail"],
        overview: "The Health & Life Path aims to train students in understanding medical sciences and healthcare. Students study topics such as nursing, medicine, and healthcare to prepare them for the medical field. The path also enhances health awareness and deep understanding of human body functions and the basics of diagnosis and treatment.",
        studyPlan: {
          year2: "Math 2, English 2, Chemistry 2, Biology 2, Physics 2, Tawhid 1, Arabic Competencies 2, Digital Technology 2, Health Sciences Principles, Fitness & Health Culture",
          year3: "Math 3, English 3, Physics 3, Chemistry 3, Earth & Space Sciences, Fiqh 1, Literary Studies, Healthcare, Statistics, Human Body Systems, Life Skills, Health & Physical Education 2, Research & Information Sources, Graduation Project",
        },
      },
      cs: {
        title: "Computer Science & Engineering",
        description: "Training students in technology, engineering, software design, and systems analysis",
        skills: ["Programming & Development", "Engineering Thinking", "Complex Analysis", "Creative Design"],
        overview: "The Computer Science & Engineering path focuses on training students in technology and engineering fields. Students learn how to design software and analyze systems, in addition to applying engineering concepts in the field of technology. This path is most suitable for students interested in modern technologies and includes programming and engineering design applications.",
        studyPlan: {
          year2: "Math 2, English 2, Chemistry 2, Biology 2, Physics 2, Tawhid 1, Arabic Competencies 2, IoT, Data Science, Engineering, Fitness & Health Culture",
          year3: "Math 3, English 3, Physics 3, Chemistry 3, Earth & Space Sciences, Fiqh 1, Literary Studies, AI, Cybersecurity, Software Engineering, Engineering Design, Life Skills, Health & Physical Education 2, Research & Information Sources, Graduation Project",
        },
      },
      business: {
        title: "Business Administration",
        description: "Providing comprehensive knowledge in company management, finance, and marketing",
        skills: ["Leadership & Team Management", "Strategic Thinking", "Communication & Negotiation", "Financial Analysis"],
        overview: "The Business Administration path focuses on providing comprehensive knowledge in company management, finance, and marketing. Students learn resource management, project management, and strategic planning. This path prepares students for careers in business through learning organizational and leadership skills.",
        studyPlan: {
          year2: "English 2, Business Decision Making, Introduction to Business, Financial Management, Economics Principles, Tawhid 1, Tafsir 1, Arabic Competencies 2, Language Studies, Digital Technology 2, History, Arts, Fitness & Health Culture",
          year3: "English 3, Fiqh 1, Literary Studies, Psychological & Social Studies, Rhetorical & Critical Studies, Secretarial & Office Management, Law Principles, Law Applications, Event Management, Management Principles, Marketing Campaign Planning, Statistics, Geography, Digital Citizenship, Life Skills, Health & Physical Education 2, Research & Information Sources, Graduation Project",
        },
      },
      shariah: {
        title: "Shari'ah Path",
        description: "Focusing on Islamic studies and religious topics such as Fiqh, Tafsir, and Hadith",
        skills: ["Religious Text Interpretation", "Jurisprudential Analysis", "Islamic Cultural Awareness", "Shari'ah Persuasion"],
        overview: "The Shari'ah Path focuses on Islamic studies and religious topics such as Fiqh, Tafsir, and Hadith. Students are trained in Islamic jurisprudence and Shari'ah law, including understanding religious principles and their applications in daily life.",
        studyPlan: {
          year2: "Quran 1, English 2, Tawhid 1, Tawhid 2, Tafsir 1, Hadith 2, Quran Sciences, Qira'at 1, Qira'at 2, Arabic Competencies 2, Language Studies, Digital Technology 2, History, Arts, Fitness & Health Culture",
          year3: "Quran 2, English 3, Fiqh 1, Fiqh 2, Usul al-Fiqh, Hadith Terminology, Fara'id, Tafsir 2, Law Principles, Law Applications, Literary Studies, Psychological & Social Studies, Rhetorical & Critical Studies, Geography, Digital Citizenship, Life Skills, Health & Physical Education 2, Research & Information Sources, Graduation Project",
        },
      },
      general: {
        title: "General Path",
        description: "A comprehensive path providing diverse opportunities to learn academic and technical subjects across various fields",
        skills: ["Critical Thinking", "Time Management", "Arabic & Mathematics", "Adaptability & Learning"],
        overview: "The General Path is a comprehensive path that provides students with diverse opportunities to learn academic and technical subjects across various fields, enabling them to pursue higher education in multiple areas after graduation. This path includes comprehensive education in the fundamentals of humanities, natural sciences, mathematics, and Islamic studies. The General Path is suitable for students who don't have specific interests and wish to study diverse subjects before making their final academic decision.",
        studyPlan: {
          year2: "Math 2, English 2, Chemistry 2, Biology 2, Physics 2, Tawhid 1, Arabic Competencies, Digital Technology 2, History, Arts, Fitness & Health Culture",
          year3: "Math 3, English 3, Physics 3, Chemistry 3, Earth & Space Sciences, Fiqh 1, Literary Studies, Psychological & Social Studies, Digital Technology 3, Digital Citizenship, Geography, Life Skills, Health & Physical Education 2, Research & Information Sources, Elective",
        },
      },
    },
    pathDetails: {
      overview: "Path Overview",
      skills: "Required Skills",
      studyPlan: "Study Plan",
      year2: "Year 2",
      year3: "Year 3",
      tryTest: "Try Path Test",
    },
    features: {
      title: "How Tawajohi Works",
      sim: { title: "Real Simulations", desc: "Experience practical scenarios that mirror real work environments" },
      theory: { title: "Theory Questions", desc: "Test your knowledge with diverse Saudi curriculum questions" },
      ai: { title: "AI Assessment", desc: "Get AI-powered performance analysis with personalized recommendations" },
      results: { title: "Comprehensive Results", desc: "Detailed report on strengths and areas for improvement" },
    },
    footer: {
      tagline: "Towards a better career future",
      rights: "All rights reserved",
    },
  },
} as const;

export default translations;
