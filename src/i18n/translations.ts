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
      subtitle: "اكتشف أربعة مسارات رئيسية مصممة خصيصاً لتتوافق مع المناهج السعودية",
      health: {
        title: "العلوم الصحية والحياتية",
        description: "محاكاة رعاية طبية وإسعافات أولية مع تقييم فوري لقراراتك",
        skills: ["التشخيص", "الإسعافات الأولية", "التحليل الطبي"],
      },
      cs: {
        title: "علوم الحاسب والهندسة",
        description: "تحديات برمجية وتصميم أنظمة مع تقييم مهاراتك التقنية",
        skills: ["البرمجة", "تصميم الأنظمة", "حل المشكلات"],
      },
      business: {
        title: "إدارة الأعمال",
        description: "محاكاة إدارة مشاريع وتفاوض مع تحليل استراتيجي لقراراتك",
        skills: ["التفاوض", "إدارة المشاريع", "التخطيط"],
      },
      shariah: {
        title: "الشريعة والدراسات الإسلامية",
        description: "تحليل قضايا شرعية وإصدار فتاوى مع تقييم منهجك الفقهي",
        skills: ["الفقه", "تحليل القضايا", "الاستدلال"],
      },
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
      subtitle: "Explore four main paths designed to align with the Saudi curriculum",
      health: {
        title: "Health & Life Sciences",
        description: "Medical care and first aid simulations with real-time decision assessment",
        skills: ["Diagnosis", "First Aid", "Medical Analysis"],
      },
      cs: {
        title: "Computer Science & Engineering",
        description: "Programming challenges and system design with technical skill evaluation",
        skills: ["Programming", "System Design", "Problem Solving"],
      },
      business: {
        title: "Business Administration",
        description: "Project management and negotiation simulations with strategic analysis",
        skills: ["Negotiation", "Project Management", "Planning"],
      },
      shariah: {
        title: "Shari'ah & Islamic Studies",
        description: "Legal case analysis and fatwa simulations with jurisprudential assessment",
        skills: ["Jurisprudence", "Case Analysis", "Reasoning"],
      },
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
