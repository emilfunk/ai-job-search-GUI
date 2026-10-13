import fs from 'fs';
import path from 'path';
import { Application } from '../types.js';

const APPS_FILE = path.resolve(process.cwd(), 'data', 'applications.json');

const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app-1',
    jobId: 'ji-892101',
    jobTitle: 'Senior Fullstack Software Engineer',
    company: 'Novo Nordisk A/S',
    location: 'Bagsværd, Region Hovedstaden',
    portal: 'jobindex',
    url: 'https://www.jobindex.dk/jobannonce/r892101',
    status: 'interviewing',
    fitScore: 92,
    salaryMin: 68000,
    salaryMax: 78000,
    salaryBenchmarkIndex: 114.2,
    appliedDate: '2026-10-02',
    interviewDate: '2026-10-14',
    followUpDate: '2026-10-15',
    contactPerson: 'Søren Møller (Engineering Manager)',
    notes: 'Completed initial phone screening with recruiter. First technical interview scheduled with Tech Lead for Tuesday at 10:00. Focus on React architecture & GraphQL.',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'app-2',
    jobId: 'ji-892244',
    jobTitle: 'AI / Machine Learning Engineer',
    company: 'Pleo Technologies ApS',
    location: 'København K, Denmark',
    portal: 'jobindex',
    url: 'https://www.jobindex.dk/jobannonce/r892244',
    status: 'tailoring',
    fitScore: 88,
    salaryMin: 70000,
    salaryMax: 82000,
    salaryBenchmarkIndex: 118.6,
    appliedDate: undefined,
    deadline: '2026-11-01',
    notes: 'Drafted custom cover letter highlighting document categorization pipeline in Python & PyTorch. Need to review ATS check.',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'app-3',
    jobId: 'jn-584988',
    jobTitle: 'Data Platform Engineer',
    company: 'Ørsted A/S',
    location: 'Gentofte, Denmark',
    portal: 'jobnet',
    url: 'https://jobnet.dk/CV/FindJob/Details/584988',
    status: 'applied',
    fitScore: 81,
    salaryMin: 65000,
    salaryMax: 72000,
    salaryBenchmarkIndex: 109.8,
    appliedDate: '2026-10-06',
    deadline: '2026-11-10',
    followUpDate: '2026-10-20',
    notes: 'Submitted via Ørsted workday portal. Tailored CV bullets focused on scalable distributed telemetry and SQL.',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'app-4',
    jobId: 'li-920140',
    jobTitle: 'Senior Software Engineer - Developer Platform',
    company: 'Unity Technologies ApS',
    location: 'København / Remote',
    portal: 'linkedin',
    url: 'https://www.linkedin.com/jobs/view/920140',
    status: 'saved',
    fitScore: 85,
    salaryMin: 72000,
    salaryMax: 85000,
    salaryBenchmarkIndex: 123.4,
    deadline: '2026-11-25',
    notes: 'Exciting developer platform tooling role. High Danish salary benchmark index (+23% above median). Ready for fit evaluation.',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'app-5',
    jobId: 'fh-77102',
    jobTitle: 'Freelance Frontend Consultant',
    company: 'LEGO Group (Contract)',
    location: 'Billund / Remote',
    portal: 'freehire',
    url: 'https://freehire.dk/project/77102',
    status: 'offer',
    fitScore: 90,
    salaryMin: 95000,
    salaryMax: 110000,
    salaryBenchmarkIndex: 110.5,
    appliedDate: '2026-09-24',
    interviewDate: '2026-10-04',
    notes: 'Contract offer received for 6-month engagement at DKK 950/hr. Reviewing contract terms and IP clauses before signing.',
    updatedAt: new Date().toISOString(),
  },
];

export function getApplications(): Application[] {
  try {
    if (fs.existsSync(APPS_FILE)) {
      const data = fs.readFileSync(APPS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn('Error reading applications file, using defaults:', err);
  }
  return INITIAL_APPLICATIONS;
}

export function saveApplications(apps: Application[]): void {
  const dir = path.dirname(APPS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(APPS_FILE, JSON.stringify(apps, null, 2), 'utf-8');
}
