import React, { createContext, useContext, useState } from "react";

/* ── Translation Strings ────────────────────────────────────────────── */
export const translations = {
  en: {
    // Chat
    chatTitle: "University Assistant",
    chatSubtitle: "Ask me anything",
    chatPlaceholder: "Type your message...",
    chatSend: "Send",
    chatClose: "Close chat",
    chatOpen: "Open chat",
    chatGreeting: "Hello! 👋 I'm your University Assistant. I can help you with admissions, courses, registration, grades, and more. How can I assist you today?",
    chatUnknown: "I'm not sure about that. Please contact the registrar's office or visit the university help center for more information.",
    chatLanguage: "Language",
    chatFooter: "University AI Assistant • Powered by Alex University",
    chatAdmission: "Admission info",
    chatCourses: "Course registration",
    chatFees: "Tuition fees",
    chatGrades: "My grades",

    // User Roles
    registrarAuthority: "REGISTRAR AUTHORITY",
    adminAuthority: "ADMINISTRATOR",

    // Dashboard common & Tabs
    overview: "Overview",
    students: "Students",
    colleges: "Colleges",
    courses: "Courses",
    transcripts: "Transcripts",
    curriculumApproval: "Curriculum Approval",
    schedules: "Schedules",
    applications: "Applications",
    pendingIds: "Pending IDs",
    idRequests: "ID Requests",
    departments: "Departments",
    finance: "Finance",
    admissionsPosts: "Admissions Posts",
    newsFeed: "News Feed",
    analytics: "Analytics",
    liveIntelligence: "Live Intelligence",
    noIntelligence: "No intelligence reports currently.",
    loading: "Loading...",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    view: "View",
    submit: "Submit",
    search: "Search",
    add: "Add",
    close: "Close",
    confirm: "Confirm",
    back: "Back",
    next: "Next",
    yes: "Yes",
    no: "No",
    home: "Home",
    admissions: "Admissions",
    trackApplication: "Track Application",
    academicPrograms: "Academic Programs",
    portalLogin: "Portal Login",
    applyNow: "Apply Now",
    aboutUs: "About Us",
    universityName: "ALEX UNIVERSITY",
    provisioning: "Provisioning",
    otpManagement: "Access Keys",
    security: "Cyber Security",
    users: "Identity Central",
    news: "News & Dispatches",
    system: "Core Control",
    health: "Infrastructure Pulse",
    audit: "Audit Intelligence",
    reports: "Intelligence Reports",
    passwordResets: "Protocol Recovery",
    dashboard: "Dashboard",
    signOut: "Sign Out",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    notifications: "Notifications",
    faculty: "Faculty",
    research: "Research",
    announcements: "Announcements",
    settings: "Settings",
    totalDepts: "Total Departments",
    facultyMembers: "Faculty Members",
    enrolledStudents: "Enrolled Students",
    activeCourses: "Active Courses",
    researchProjects: "Research Projects",
    avgGPA: "Average GPA",
    adminCore: "ADMIN CORE",
    operational: "Operational",
    terminateSession: "Terminate Session",
    collegeAdminDashboard: "COLLEGE ADMIN PANEL",
    academicReports: "Academic Reports",
    collegeFaculty: "College Faculty",
    initializeDept: "Initialize Department",
    deptGrowthMatrix: "Department Growth Matrix",
    analyticsHub: "Analytics Hub",
    globalIntelligence: "Global Intelligence",
    viewAllProtocols: "View All Protocols",
    deptFullName: "Department Full Name",
    deptCode: "Dept Code",
    hexColor: "Hex Color",
    facultyGroup: "Faculty Group",
    adminOtpCode: "Admin OTP Code",
    finalizeProtocol: "Finalize Protocol",
    academicCalendar: "Academic Calendar",
    budgetOverview: "Budget Overview",
    facultyPerformance: "Faculty Performance",
    totalStudents: "Total Students",
    researchRate: "Research Rate",
    stable: "Stable",
    deptInitialized: "Initialize Department",
    deptParams: "Specify department parameters and provide an authorized Admin OTP code.",
    authorization: "AUTHORIZATION",
    creationRequires: "Creation requires high-level administrative clearance (DEPARTMENT_CREATE).",
    welcomeDean: "Welcome, Dean",
    governing: "Governing",
  },

  am: {
    // Chat
    chatTitle: "የዩኒቨርሲቲ ረዳት",
    chatSubtitle: "ምንም ጠይቁኝ",
    chatPlaceholder: "መልዕክትዎን ያስገቡ...",
    chatSend: "ላክ",
    chatClose: "ውይይትን ዝጋ",
    chatOpen: "ውይይት ክፈት",
    chatGreeting: "ሰላም! 👋 እኔ የዩኒቨርሲቲ ረዳት ነኝ። ስለ ምዝገባ፣ ኮርሶች፣ ደረጃዎች እና ሌሎች ጉዳዮች ልረዳዎ እችላለሁ። እንዴት ልረዳዎ?",
    chatUnknown: "ይህን ጉዳይ በደንብ አላውቅም። ለበለጠ መረጃ ሬጂስትራር ቢሮ ያዙ ወይም የዩኒቨርሲቲ የእርዳታ ማዕከልን ይጎብኙ።",
    chatLanguage: "ቋንቋ",
    chatFooter: "የዩኒቨርሲቲ AI ረዳት • በአሌክስ ዩኒቨርሲቲ የተጎላበተ",
    chatAdmission: "ስለ ምዝገባ",
    chatCourses: "የኮርስ ምዝገባ",
    chatFees: "የክፍያ መረጃ",
    chatGrades: "የኔ ውጤቶች",
    chatOpen: "ረዳት ክፈት",
    chatClose: "ረዳት ዝጋ",

    // General
    loading: "በመጫን ላይ...",
    save: "አስቀምጥ",
    cancel: "ሰርዝ",
    delete: "ሰርዝ",
    edit: "አርም",
    view: "ይመልከቱ",
    submit: "አስገባ",
    search: "ፈልግ",
    add: "ጨምር",
    close: "ዝጋ",
    confirm: "አረጋግጥ",
    back: "ተመለስ",
    next: "ቀጣይ",
    yes: "አዎ",
    no: "አይ",

    // Dashboard common
    overview: "አጠቃላይ እይታ",
    departments: "ክፍሎች",
    faculty: "መምህራን",
    students: "ተማሪዎች",
    courses: "ኮርሶች",
    research: "ምርምር",
    announcements: "ማስታወቂያዎች",
    settings: "ቅንብሮች",
    signOut: "ዉጣ",
    darkMode: "ጨለማ ሁኔታ",
    lightMode: "ብርሃን ሁኔታ",
    notifications: "ማሳወቂያዎች",

    // Stats
    totalDepts: "ጠቅላላ ክፍሎች",
    facultyMembers: "የፋኩልቲ አባላት",
    enrolledStudents: "የተመዘገቡ ተማሪዎች",
    activeCourses: "ንቁ ኮርሶች",
    researchProjects: "የምርምር ፕሮጀክቶች",
    avgGPA: "አማካይ GPA",

    // Navbar
    home: "መነሻ",
    admissions: "መግቢያ",
    trackApplication: "ማመልከቻ ይከታተሉ",
    academicPrograms: "የትምህርት ፕሮግራሞች",
    portalLogin: "ወደ ፖርታል ግባ",
    applyNow: "አሁን ያመልክቱ",
    aboutUs: "ስለ እኛ",
    universityName: "አሌክስ ዩኒቨርሲቲ",

    // User Roles
    registrarAuthority: "የሬጅስትራር ባለስልጣን",
    adminAuthority: "አስተዳዳሪ",

    // Registrar Dashboard
    overview: "አጠቃላይ እይታ",
    students: "ተማሪዎች",
    colleges: "ኮሌጆች",
    courses: "ኮርሶች",
    transcripts: "ትራንስክሪፕቶች",
    curriculumApproval: "የስርዓተ ትምህርት ማረጋገጫ",
    schedules: "መርሐግብር",
    applications: "ማመልከቻዎች",
    pendingIds: "በሂደት ላይ ያሉ መታወቂያዎች",
    idRequests: "የመታወቂያ ጥያቆዎች",
    departments: "ክፍሎች",
    finance: "ፋይናንስ",
    admissionsPosts: "የመግቢያ መግለጫዎች",
    newsFeed: "ዜና መጋቢ",
    analytics: "ትንታኔ",
    liveIntelligence: "ቀጥታ መረጃ",
    noIntelligence: "በአሁኑ ጊዜ ምንም የሪፖርት መረጃ የለም።",

    // Admin Dashboard
    adminCore: "አስተዳደር ማእከል",
    operational: "ዝግጁ",
    terminateSession: "ክፍለ-ጊዜውን አቋርጥ",

    // Tabs
    provisioning: "ማዘጋጀት",
    otpManagement: "የመግቢያ ቁልፎች",
    security: "የሳይበር ደህንነት",
    users: "የማንነት ማእከል",
    news: "ዜና እና መልእክቶች",
    system: "ዋና ቁጥጥር",
    health: "የመሰረተ ልማት ምት",
    audit: "የኦዲት ብልህነት",
    reports: "የመረጃ ሪፖርቶች",
    passwordResets: "የፕሮቶኮል መልሶ ማግኛ",
    dashboard: "ዳሽቦርድ",
    collegeAdminDashboard: "የኮሌጅ አስተዳደር ፓነል",
    academicReports: "የትምህርት ሪፖርቶች",
    collegeFaculty: "የኮሌጅ ፋኩልቲ",
    initializeDept: "ክፍልን ያስጀምሩ",
    deptGrowthMatrix: "የክፍል እድገት ማትሪክስ",
    analyticsHub: "የትንታኔ ማዕከል",
    globalIntelligence: "ዓለም አቀፍ መረጃ",
    viewAllProtocols: "ሁሉንም ፕሮቶኮሎች ይመልከቱ",
    deptFullName: "የክፍሉ ሙሉ ስም",
    deptCode: "የክፍል ኮድ",
    hexColor: "የቀለም ኮድ",
    facultyGroup: "የፋኩልቲ ቡድን",
    adminOtpCode: "የአስተዳዳሪ OTP ኮድ",
    finalizeProtocol: "ፕሮቶኮሉን ያጠናቅቁ",
    academicCalendar: "የትምህርት የቀን መቁጠሪያ",
    budgetOverview: "የበጀት አጠቃላይ እይታ",
    facultyPerformance: "የፋኩልቲ አፈጻጸም",
    totalStudents: "ጠቅላላ ተማሪዎች",
    researchRate: "የምርምር መጠን",
    stable: "የተረጋጋ",
    deptInitialized: "ክፍልን ያስጀምሩ",
    deptParams: "የክፍል ግቤቶችን ይግለጹ እና የተፈቀደ የአስተዳዳሪ የOTP ኮድ ይስጡ።",
    authorization: "ፈቃድ",
    creationRequires: "መፍጠር ከፍተኛ ደረጃ የአስተዳደር ፍቃድ ያስፈልገዋል (DEPARTMENT_CREATE)።",
    welcomeDean: "እንኳን ደህና መጡ ዲን",
    governing: "በማስተዳደር ላይ",
  },
};

/* ── Bot Q&A Knowledge Base ─────────────────────────────────────────── */
export const botKnowledge = {
  en: [
    { keywords: ["admission", "apply", "application", "enroll", "register"], answer: "To apply for admission, visit the home page and click 'Apply Now'. Fill out the application form, upload required documents, and submit. You'll receive a Protocol Reference ID to track your application status." },
    { keywords: ["status", "track", "application status", "check application"], answer: "Go to the home page and click 'Track Application'. Enter your Protocol Reference ID to see the latest update on your application." },
    { keywords: ["course", "courses", "class", "classes", "subject"], answer: "Course registration opens each semester. Log in to your student dashboard and navigate to the Courses tab. Your advisor must first clear you for registration." },
    { keywords: ["tuition", "fee", "payment", "pay", "finance"], answer: "Tuition payments can be made through your student dashboard under the Finance/Payments section. Bank transfer, mobile payment, and in-person payment at the Finance office are accepted." },
    { keywords: ["grade", "grades", "gpa", "transcript", "result"], answer: "Grades are posted in your student dashboard under the Grades tab. For an official transcript, request one through the Registrar's office." },
    { keywords: ["schedule", "timetable", "class schedule", "when is"], answer: "Your class schedule is available in your student dashboard. You can also check the department's course schedule in the Registrar section." },
    { keywords: ["department", "program", "faculty", "college", "major"], answer: "The university has several colleges and departments including Computer Science, Engineering, Business Administration, Arts & Humanities, and Mathematics. Visit the Academic Programs section on the home page for details." },
    { keywords: ["password", "reset", "forgot", "login issue", "can't login"], answer: "Click 'Forgot Password' on the login page to reset your password. A reset link will be sent to your registered email address." },
    { keywords: ["document", "id card", "student id", "identification"], answer: "To request a student ID card, log in to your student dashboard and navigate to the ID section. Fill out the request form and your ID will be processed within 3-5 business days." },
    { keywords: ["research", "grant", "project", "publication"], answer: "Active research projects and grant opportunities are listed in the Faculty College Dashboard under the Research tab. Contact the Research Office for application procedures." },
    { keywords: ["graduation", "graduate", "degree", "certificate", "graduate"], answer: "To apply for graduation, complete all required courses per your program guide and submit a graduation application through the Registrar's office at least one semester before your expected graduation date." },
    { keywords: ["contact", "office", "help", "support", "reach"], answer: "You can reach the Registrar's Office Monday–Friday, 8AM–5PM. For technical support, visit the IT Help Desk or email support@university.edu." },
    { keywords: ["hello", "hi", "hey", "greetings", "good morning", "good afternoon"], answer: "Hello! 👋 Welcome to the University Assistant. I can help with admissions, courses, grades, schedules, and more. What would you like to know?" },
    { keywords: ["thank", "thanks", "thank you"], answer: "You're welcome! Is there anything else I can help you with?" },
  ],
  am: [
    { keywords: ["ምዝገባ", "ማመልከቻ", "ተመዝገብ", "አስገባ", "ተቀበል", "እንዴት ላመልክት", "ማመልከት"], answer: "ለምዝገባ መጀመሪያ ወደ ዋናው ገጽ ሂዱ እና 'አሁን ያመልክቱ' ቁልፍን ጫኑ። ቅፁን ሙሉ፣ የሚያስፈልገውን ሰነድ ያስገቡ እና ያስገቡ። ማመልከቻዎን ለመከታተል የፕሮቶኮል ማጣቀሻ መታወቂያ ይቀበላሉ።" },
    { keywords: ["ሁኔታ", "ተከታተል", "ፕሮቶኮል", "ማጣቀሻ", "ምዝገባ ሁኔታ", "መከታተያ"], answer: "ወደ ዋናው ገጽ ሂዱ እና 'ማመልከቻ ይከታተሉ' የሚለውን ጫኑ። የፕሮቶኮል ማጣቀሻ መታወቂያዎን ያስገቡ።" },
    { keywords: ["ኮርስ", "ትምህርት", "ክፍለ ጊዜ", "ምዝገባ", "ትምህርቶች", "ክፍል"], answer: "የኮርስ ምዝገባ በእያንዳንዱ ሴሚስተር ይከፈታል። ወደ የተማሪ ዳሽቦርድ ይግቡ እና የኮርሶች ትሩን አይቱ።" },
    { keywords: ["ክፍያ", "ትምህርት ቤት ክፍያ", "ቅናሽ", "ፋይናንስ", "ብር", "መክፈል"], answer: "የትምህርት ቤት ክፍያ በተማሪ ዳሽቦርድ ፋይናንስ/ክፍያ ክፍል ሊከፈሉ ይችላሉ። በባንክ ዝውውር፣ በሞባይል ክፍያ ወይም በፋይናንስ ቢሮ ይቀበላሉ።" },
    { keywords: ["ደረጃ", "ውጤት", "GPA", "ትራንስክሪፕት", "ማርክ"], answer: "ደረጃዎች በተማሪ ዳሽቦርድ ደረጃዎች ትሩ ስር ይለጠፋሉ። ኦፊሴላዊ ትራንስክሪፕት ለሬጂስትራር ቢሮ ይጠይቁ።" },
    { keywords: ["ሰሌዳ", "የክፍል ሰሌዳ", "መርሃ ግብር", "ጊዜ"], answer: "የክፍል ሰሌዳዎ በተማሪ ዳሽቦርዎ ውስጥ ይገኛል።" },
    { keywords: ["ክፍል", "ፕሮግራም", "ፋኩልቲ", "ኮሌጅ", "ሜጀር", "ዲፓርትመንት"], answer: "ዩኒቨርሲቲው የኮምፒዩተር ሳይንስ፣ ምህንድስና፣ ቢዝነስ አስተዳደር፣ ሥነ ጥበብ እና ሒሳብ ጨምሮ በርካታ ኮሌጆች አሉት።" },
    { keywords: ["ፓስዎርድ", "ዳግም ያስጀምሩ", "ወደ ሂሳብ ሊገቡ አልቻሉም", "ቁልፍ"], answer: "ፓስዎርዶን ዳግም ለማስጀመር ወደ ግባ ቅጽ ሄዶ 'ፓስዎርድ ረሳሁ' ቁልፍን ጫኑ። አገናኝ ወደ ምዝገባ ኢሜልዎ ይላካል።" },
    { keywords: ["ሰነድ", "መታወቂያ", "የተማሪ መታወቂያ", "ካርድ"], answer: "የተማሪ መታወቂያ ካርድ ለመጠየቅ ወደ ተማሪ ዳሽቦርድ ይግቡ እና መታወቂያ ክፍሉን አይቱ። ጥያቄው ከ3-5 የሥራ ቀናት ውስጥ ይሠራል።" },
    { keywords: ["ምርምር", "ፕሮጀክት", "ሰጠ", "ታትሞ", "ጥናት"], answer: "ንቁ የምርምር ፕሮጀክቶች እና የድጎማ እድሎች በፋኩልቲ ዳሽቦርድ ውስጥ ይገኛሉ። ለማመልከቻ ሥርዓቱ የምርምር ቢሮን ያናጋሩ።" },
    { keywords: ["ምረቃ", "ዲግሪ", "ሰርተፊኬት", "መረቅ"], answer: "ለምረቃ ለማመልከት ሁሉንም አስፈላጊ ኮርሶች ያጠናቅቁ እና ቢያንስ አንድ ሴሚስቴር ቀደም ሲል ይጠይቁ።" },
    { keywords: ["አገናኝ", "ቢሮ", "እርዳታ", "ድጋፍ", "ስልክ"], answer: "የሬጂስትራር ቢሮ ሰኞ-ዓርብ ከጠ 8 ሰዓት – ምሽቱ 5 ሰዓት ይገኛሉ። ለቴክኒካዊ ድጋፍ ወደ IT ቢሮ ይሂዱ ወይም support@university.edu ኢሜል ያድርጉ።" },
    { keywords: ["ሰላም", "ሃሎ", "ምን ዜና", "ጤና ይስጥልኝ", "እንደምን ነህ"], answer: "ሰላም! 👋 ወደ የዩኒቨርሲቲ ረዳት እንኳን ደህና መጡ። ስለ ምዝገባ፣ ኮርሶች፣ ደረጃዎች እና ሌሎች ልረዳዎ እችላለሁ።" },
    { keywords: ["አመሰግናለሁ", "እናመሰግናለን", "ተባረክ"], answer: "እንኳን ደስ ይበልዎ! ሌላ ምን ልረዳዎ?" },
  ],
};

/* ── Context ────────────────────────────────────────────────────────── */
const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");
  const t = (key) => translations[language]?.[key] ?? translations["en"]?.[key] ?? key;

  const getBotResponse = (input) => {
    const lower = input.toLowerCase().trim();
    const kb = botKnowledge[language] || botKnowledge.en;
    for (const item of kb) {
      if (item.keywords.some(kw => lower.includes(kw))) {
        return item.answer;
      }
    }
    return translations[language]?.chatUnknown || translations.en.chatUnknown;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getBotResponse }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
