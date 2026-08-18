export const SITE = {
  company: "ORVIONAR TECH PRIVATE LIMITED",
  brand: "ORVIONAR",
  tagline: "Accelerate Your Future",
  headline: "Learn. Build. Intern. Get Career Ready.",
  phone: "+91 9663472640",
  email: "info@orvionar.in",
  address: [
    "ORVIONAR Tech",
    "H206, 36/5, Hustlehub Tech Park,",
    "Somasundarapalya Main Road,",
    "Adjacent 27th Main Road, ITI Layout, Sector 2,",
    "Haralukunte Village, HSR Layout,",
    "Bengaluru – 560102",
  ],
  mapsQuery:
    "Hustlehub Tech Park, Somasundarapalya Main Road, HSR Layout, Bengaluru 560102",
  linkedin: "https://www.linkedin.com/company/orvionar",
  lms: "https://www.teachmint.com/",
} as const;

/** Configurable via env so the company can update it without a code change. */
export const WHATSAPP_NUMBER: string =
  (import.meta.env["VITE_WHATSAPP_NUMBER"] as string | undefined) || "919663472640";

export const whatsappLink = (message = "Hi ORVIONAR, I'd like to know more about the 3-Month Program.") =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Programs", to: "/programs" },
  { label: "3-Month Program", to: "/three-month-program" },
  { label: "Benefits", to: "/benefits" },
  { label: "Certifications", to: "/certifications" },
  { label: "Student Stories", to: "/student-stories" },
  { label: "FAQ", to: "/faq" },
  { label: "Contact", to: "/contact" },
] as const;

export const PROGRAM_CATEGORIES = [
  "Technology",
  "Data",
  "Business",
  "Design",
  "Management",
  "Core / Engineering",
  "Healthcare",
] as const;

export const CURRENT_YEARS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "Final Year",
  "Graduate",
  "Other",
];

export const SOURCES = [
  "LinkedIn",
  "Instagram",
  "College",
  "Friend",
  "WhatsApp",
  "Google",
  "Other",
];

export const SESSIONS = ["Weekday (6:00 PM – 8:00 PM)", "Weekend (6:00 PM – 8:00 PM)", "Flexible"];

export const MODES = ["Online", "Offline"];

export const APPLICATION_STATUSES = [
  "New",
  "Contacted",
  "Counselling",
  "Documents Pending",
  "Application Approved",
  "Enrolled",
  "Rejected",
];

export const BENEFITS = [
  {
    icon: "Radio",
    title: "Live Interactive Learning",
    text: "Interactive sessions with opportunities to ask questions and clarify doubts.",
  },
  {
    icon: "UserCheck",
    title: "Industry Mentorship",
    text: "Mentorship and guidance focused on practical career skills.",
  },
  {
    icon: "Code2",
    title: "Real-Time Projects",
    text: "Build practical projects instead of learning only through theory.",
  },
  {
    icon: "Briefcase",
    title: "Internship Experience",
    text: "Gain structured training and internship exposure.",
  },
  {
    icon: "TrendingUp",
    title: "Career Development",
    text: "Resume, communication, aptitude, interview and portfolio preparation.",
  },
  {
    icon: "Handshake",
    title: "Placement Assistance",
    text: "Career guidance and placement assistance after the training/internship program.",
  },
] as const;

export const CAREER_SUPPORT = [
  { icon: "FileText", title: "Resume Preparation", text: "Create a stronger professional resume." },
  { icon: "Calculator", title: "Aptitude Preparation", text: "Improve quantitative and logical reasoning skills." },
  { icon: "Users", title: "Group Discussion", text: "Develop confidence and communication." },
  { icon: "MessagesSquare", title: "Mock Interviews", text: "Practice real interview situations." },
  { icon: "Globe", title: "Portfolio Development", text: "Build a professional online presence." },
  { icon: "Handshake", title: "Placement Assistance", text: "Receive career guidance and placement assistance." },
] as const;

export const FAQS = [
  {
    q: "What is the duration of the program?",
    a: "The program is structured as a 3-month journey covering learning, projects/internship and career development.",
  },
  {
    q: "Are the sessions online or offline?",
    a: "The exact mode depends on the selected program/batch. The applicable mode is shown during enrollment.",
  },
  {
    q: "How many classes are conducted per week?",
    a: "The program structure includes four classes per week — two weekday sessions and two weekend sessions.",
  },
  { q: "What are the class timings?", a: "Sessions are scheduled from 6:00 PM to 8:00 PM." },
  {
    q: "Will I work on projects?",
    a: "Yes. The program includes minor and major project work during the project/internship phase.",
  },
  {
    q: "Will I receive certificates?",
    a: "Eligible students may receive applicable course, internship and project completion credentials according to program requirements.",
  },
  {
    q: "Is placement guaranteed?",
    a: "ORVIONAR provides placement assistance and career support, subject to applicable program terms. We do not guarantee placement.",
  },
  {
    q: "Is there a stipend?",
    a: "Where applicable to the selected program and batch, a performance-based stipend may apply. Eligibility and stipend are subject to the program's applicable performance criteria and company terms.",
  },
  {
    q: "How do I apply?",
    a: "Select your domain, complete the admission form and submit your application. Our team will contact you with next steps.",
  },
];
