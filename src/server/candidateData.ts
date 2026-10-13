import fs from 'fs';
import path from 'path';
import { CandidateProfile } from '../types.js';

const PROFILE_FILE = path.resolve(process.cwd(), 'data', 'candidate_profile.json');

export const DEFAULT_PROFILE: CandidateProfile = {
  name: 'Alex Jensen',
  email: 'alex.jensen@example.dk',
  phone: '+45 28 91 40 22',
  location: 'København, Denmark',
  commuteConstraints: 'Greater Copenhagen, up to 45 min commute, or remote/hybrid',
  employmentStatus: 'Actively searching for Senior / Lead Fullstack & AI Software roles',
  linkedinUrl: 'https://www.linkedin.com/in/alex-jensen-dev',
  githubUrl: 'https://github.com/alex-jensen-dev',
  summary: 'Experienced Senior Software Engineer with 7+ years developing modern web applications, distributed APIs, and integrating ML/LLM pipelines. Proven record leading architectural modernization and shipping high-throughput user interfaces.',
  targetTitles: [
    'Senior Fullstack Engineer',
    'AI / ML Software Engineer',
    'Lead Frontend Engineer',
    'Software Architect',
    'Tech Lead',
  ],
  minSalaryDkk: 62000,
  workPreference: 'hybrid',
  cvLanguage: 'English',
  languages: [
    { language: 'English', level: 'Full Professional / Fluent (C2)', isNative: false },
    { language: 'Danish', level: 'Native / Fluent (C2)', isNative: true },
    { language: 'German', level: 'Conversational (B1)', isNative: false },
  ],
  education: [
    {
      degree: 'M.Sc. in Computer Science',
      institution: 'IT University of Copenhagen (ITU)',
      period: '2017 - 2019',
      field: 'Software Engineering & Distributed Systems',
      keyTopics: 'Distributed Algorithms, Web Architecture, Cloud Computing, Machine Learning',
    },
    {
      degree: 'B.Sc. in Software Development',
      institution: 'Technical University of Denmark (DTU)',
      period: '2014 - 2017',
      field: 'Computer Systems Engineering',
      keyTopics: 'Algorithms, Data Structures, Object-Oriented Systems, Database Engineering',
    },
  ],
  experience: [
    {
      id: 'exp-1',
      title: 'Senior Software Engineer',
      company: 'Nordic Digital Solutions',
      location: 'København',
      period: '2021 - Present',
      responsibilities: [
        'Architected high-scale customer web platforms in React, Next.js, and TypeScript serving 150k+ daily users.',
        'Engineered microservices backend in Node.js/Go with Kafka event messaging and PostgreSQL.',
        'Integrated Gemini & OpenAI LLM workflows for automated document extraction and classification.',
        'Mentored 6 junior/mid engineers and established standardized TypeScript coding guidelines.',
      ],
      achievements: [
        'Decreased core web vitals LCP by 42% through SSR optimization and asset caching.',
        'Spearheaded transition from legacy monolith to modular microfrontends with 99.95% uptime.',
      ],
    },
    {
      id: 'exp-2',
      title: 'Fullstack Software Developer',
      company: 'Copenhagen FinTech Labs',
      location: 'København',
      period: '2019 - 2021',
      responsibilities: [
        'Built secure PSD2 banking API integrations and responsive dashboard interfaces.',
        'Automated CI/CD pipelines with GitHub Actions, Docker containers, and Kubernetes deployment.',
        'Designed real-time transactional alert engine using WebSockets and Redis cache.',
      ],
      achievements: [
        'Passed strict compliance security audit with zero high-severity findings.',
      ],
    },
  ],
  technicalSkills: {
    languages: ['TypeScript', 'JavaScript', 'Python', 'Go', 'SQL', 'HTML/CSS'],
    frameworks: ['React', 'Next.js', 'Node.js', 'Express', 'TailwindCSS', 'FastAPI', 'PyTorch'],
    cloudAndDevOps: ['Docker', 'Kubernetes', 'AWS', 'Google Cloud', 'GitHub Actions', 'Terraform'],
    tools: ['Git', 'PostgreSQL', 'Redis', 'Kafka', 'GraphQL', 'REST', 'Vite', 'Jest', 'Vitest'],
  },
  domainExpertise: [
    'Fullstack Web Architecture',
    'AI & LLM Integration Workflows',
    'FinTech & Regulated Systems',
    'Developer Tooling & Design Systems',
    'API Design & Performance Tuning',
  ],
  behavioralTraits: [
    'Pragmatic technical leadership',
    'Clear cross-functional communication',
    'Forward-looking initiative and curiosity',
    'Structured problem decomposition',
  ],
};

export function getProfile(): CandidateProfile {
  try {
    if (fs.existsSync(PROFILE_FILE)) {
      const content = fs.readFileSync(PROFILE_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.warn('Error reading candidate profile, using defaults:', err);
  }
  return DEFAULT_PROFILE;
}

export function saveProfile(profile: CandidateProfile): void {
  const dir = path.dirname(PROFILE_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(PROFILE_FILE, JSON.stringify(profile, null, 2), 'utf-8');
}
