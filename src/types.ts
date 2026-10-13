export type PortalType = 'jobindex' | 'jobnet' | 'jobbank' | 'jobdanmark' | 'linkedin' | 'freehire';

export interface JobCard {
  id: string;
  portal: PortalType;
  title: string;
  company: string;
  location: string;
  date: string;
  url: string;
  snippet?: string;
  tags?: string[];
  workType?: 'onsite' | 'hybrid' | 'remote';
  employmentType?: string;
  deadline?: string;
  fitScore?: number;
}

export interface CandidateLanguage {
  language: string;
  level: string; // e.g. "Native", "Fluent / C2", "Professional / C1", "Conversational / B2"
  isNative?: boolean;
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  field: string;
  keyTopics?: string;
}

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location: string;
  period: string;
  responsibilities: string[];
  achievements?: string[];
}

export interface CandidateProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  commuteConstraints: string;
  employmentStatus: string;
  linkedinUrl: string;
  githubUrl: string;
  summary: string;
  targetTitles: string[];
  minSalaryDkk: number;
  workPreference: 'remote' | 'hybrid' | 'onsite' | 'any';
  cvLanguage: 'English' | 'Danish';
  languages: CandidateLanguage[];
  education: EducationItem[];
  experience: ExperienceItem[];
  technicalSkills: {
    languages: string[];
    frameworks: string[];
    cloudAndDevOps: string[];
    tools: string[];
  };
  domainExpertise: string[];
  behavioralTraits: string[];
}

export type ApplicationStatus = 'saved' | 'tailoring' | 'applied' | 'interviewing' | 'offer' | 'rejected' | 'archived';

export interface Application {
  id: string;
  jobId?: string;
  jobTitle: string;
  company: string;
  location: string;
  portal: PortalType | 'direct';
  url: string;
  status: ApplicationStatus;
  fitScore?: number;
  salaryMin?: number;
  salaryMax?: number;
  salaryBenchmarkIndex?: number;
  appliedDate?: string;
  deadline?: string;
  interviewDate?: string;
  followUpDate?: string;
  notes?: string;
  contactPerson?: string;
  coverLetterDraft?: string;
  cvTailoringNotes?: string;
  updatedAt: string;
}

export interface SalaryCategoryData {
  count?: number;
  index?: number | string;
}

export interface SalaryCompanyRecord {
  company: string;
  city?: string;
  categories: Record<string, SalaryCategoryData>;
}

export interface SalaryLookupResult {
  score: number;
  company: string;
  city?: string;
  categories: Record<string, SalaryCategoryData>;
  diffFromBaseline?: number;
}

export interface SkillMatchAnalysis {
  matchedSkills: string[];
  missingSkills: string[];
  bonusSkills: string[];
}

export interface JobEvaluation {
  jobTitle: string;
  company: string;
  overallScore: number; // 0-100
  rating: 'Exceptional Match' | 'Strong Fit' | 'Moderate Fit' | 'Stretch Opportunity' | 'Unfavorable';
  skillsMatch: SkillMatchAnalysis;
  languageGate: {
    passed: boolean;
    required: string[];
    candidatePossesses: string[];
    message: string;
  };
  experienceMatch: {
    score: number;
    notes: string;
  };
  commuteMatch: {
    score: number;
    notes: string;
  };
  pros: string[];
  cons: string[];
  recommendation: 'Priority Apply' | 'Consider Applying' | 'Upskill First' | 'Skip';
  salaryInsight?: string;
}

export interface ReviewerFeedback {
  category: 'ATS Compatibility' | 'Impact & Metrics' | 'Cliché Removal' | 'Tone & Forward Framing' | 'Length & Formatting';
  status: 'passed' | 'warning' | 'needs_revision';
  message: string;
  suggestion?: string;
}

export interface DraftedApplication {
  coverLetterMarkdown: string;
  coverLetterLatex: string;
  tailoredCvBullets: Array<{ role: string; bullet: string; relevance: string }>;
  cvLatexSnippet: string;
  reviewerCritique: {
    overallScore: number;
    passedAts: boolean;
    feedbacks: ReviewerFeedback[];
  };
}

export interface InterviewQuestion {
  question: string;
  type: 'behavioral' | 'technical' | 'situational' | 'culture';
  suggestedStarAnswer: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  talkingTips: string[];
}

export interface InterviewPrepPackage {
  role: string;
  company: string;
  behavioralQuestions: InterviewQuestion[];
  technicalQuestions: InterviewQuestion[];
  smartQuestionsToAsk: string[];
  companyBackgroundTalkingPoints: string[];
  upskillRoadmap: Array<{ skill: string; priority: 'High' | 'Medium'; recommendation: string }>;
}
