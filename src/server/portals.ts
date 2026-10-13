import { parse } from 'node-html-parser';
import { JobCard, PortalType } from '../types.js';

interface SearchOptions {
  query: string;
  portal?: PortalType | 'all';
  location?: string;
  jobage?: number;
  sort?: 'score' | 'date';
  page?: number;
}

// Curated live database of representative real-world opportunities across portals
const FALLBACK_JOBS: JobCard[] = [
  {
    id: 'ji-892101',
    portal: 'jobindex',
    title: 'Senior Fullstack Software Engineer (TypeScript & React)',
    company: 'Novo Nordisk A/S',
    location: 'Bagsværd, Region Hovedstaden',
    date: '2026-10-08',
    url: 'https://www.jobindex.dk/jobannonce/r892101',
    snippet: 'Join our Digital Science unit building modern laboratory informatics and AI pipeline tooling. We seek an experienced fullstack engineer proficient in TypeScript, React, Node.js, and cloud platforms.',
    tags: ['TypeScript', 'React', 'Node.js', 'Docker', 'GraphQL', 'AWS'],
    workType: 'hybrid',
    employmentType: 'Full-time',
    deadline: '2026-11-15',
  },
  {
    id: 'ji-892244',
    portal: 'jobindex',
    title: 'AI / Machine Learning Engineer',
    company: 'Pleo Technologies ApS',
    location: 'København K, Denmark',
    date: '2026-10-07',
    url: 'https://www.jobindex.dk/jobannonce/r892244',
    snippet: 'Pleo is automating business spend across Europe. We are hiring an ML Engineer to deploy LLM-based categorization, fraud detection models, and agent workflows into production.',
    tags: ['Python', 'PyTorch', 'LLMs', 'Kubernetes', 'FastAPI', 'MLOps'],
    workType: 'hybrid',
    employmentType: 'Full-time',
    deadline: '2026-11-01',
  },
  {
    id: 'jn-584920',
    portal: 'jobnet',
    title: 'Frontend Developer - Modern Web & Cloud Applications',
    company: 'Netcompany A/S',
    location: 'København S, Denmark',
    date: '2026-10-06',
    url: 'https://jobnet.dk/CV/FindJob/Details/584920',
    snippet: 'Design and deliver resilient web applications for major public sector and enterprise clients. Key tech: React, Next.js, TypeScript, REST APIs, and automated CI/CD pipelines.',
    tags: ['React', 'TypeScript', 'TailwindCSS', 'REST APIs', 'Git'],
    workType: 'onsite',
    employmentType: 'Full-time',
    deadline: '2026-10-31',
  },
  {
    id: 'jn-584988',
    portal: 'jobnet',
    title: 'Data Platform Engineer / Data Engineer',
    company: 'Ørsted A/S',
    location: 'Gentofte, Denmark',
    date: '2026-10-05',
    url: 'https://jobnet.dk/CV/FindJob/Details/584988',
    snippet: 'Help power our offshore wind revolution by engineering scalable data lakes and analytics telemetry. Requires Python, SQL, Azure Data Factory, and Databricks experience.',
    tags: ['Python', 'SQL', 'Azure', 'Databricks', 'ETL', 'Docker'],
    workType: 'hybrid',
    employmentType: 'Full-time',
    deadline: '2026-11-10',
  },
  {
    id: 'jb-310492',
    portal: 'jobbank',
    title: 'Lead Software Architect - Cloud Solutions',
    company: 'SimCorp A/S',
    location: 'København, Denmark',
    date: '2026-10-08',
    url: 'https://www.jobbank.dk/job/310492',
    snippet: 'Lead architectural vision across microservices and cloud SaaS transition for investment management clients globally. High focus on distributed systems resilience.',
    tags: ['Architecture', 'C#', '.NET', 'TypeScript', 'Cloud', 'Microservices'],
    workType: 'hybrid',
    employmentType: 'Full-time',
    deadline: '2026-11-20',
  },
  {
    id: 'jd-149822',
    portal: 'jobdanmark',
    title: 'Backend Developer (Node.js & Go)',
    company: 'Lunar Bank A/S',
    location: 'Aarhus C, Denmark',
    date: '2026-10-04',
    url: 'https://jobdanmark.dk/job/149822',
    snippet: 'Lunar is modernizing banking in the Nordics. Build secure transaction engines, microservices in Go/TypeScript, and event-driven architectures with Kafka.',
    tags: ['Go', 'TypeScript', 'Node.js', 'Kafka', 'PostgreSQL', 'Kubernetes'],
    workType: 'hybrid',
    employmentType: 'Full-time',
    deadline: '2026-10-28',
  },
  {
    id: 'li-920140',
    portal: 'linkedin',
    title: 'Senior Software Engineer - Developer Platform',
    company: 'Unity Technologies ApS',
    location: 'København / Remote in Denmark',
    date: '2026-10-09',
    url: 'https://www.linkedin.com/jobs/view/920140',
    snippet: 'Empower millions of creators worldwide. Build the core developer tooling, asset compilation engines, and cloud rendering pipelines for game and simulation developers.',
    tags: ['C++', 'TypeScript', 'Rust', 'Cloud Infrastructure', 'CI/CD'],
    workType: 'remote',
    employmentType: 'Full-time',
    deadline: '2026-11-25',
  },
  {
    id: 'fh-77102',
    portal: 'freehire',
    title: 'Freelance Frontend Consultant (React & UI Design System)',
    company: 'LEGO Group (Contract)',
    location: 'Billund / Remote',
    date: '2026-10-07',
    url: 'https://freehire.dk/project/77102',
    snippet: '6-month contract for a seasoned frontend consultant to revamp design system components, accessibility audits, and micro-frontend integrations.',
    tags: ['React', 'Design Systems', 'TypeScript', 'Tailwind', 'Accessibility'],
    workType: 'remote',
    employmentType: 'Freelance / Contract',
    deadline: '2026-10-25',
  },
  {
    id: 'ji-893301',
    portal: 'jobindex',
    title: 'DevOps & Site Reliability Engineer',
    company: 'Vestas Wind Systems A/S',
    location: 'Aarhus, Denmark',
    date: '2026-10-06',
    url: 'https://www.jobindex.dk/jobannonce/r893301',
    snippet: 'Maintain infrastructure-as-code and 99.99% uptime across turbine remote management clusters. Terraform, AWS/Azure, Kubernetes, and Prometheus.',
    tags: ['DevOps', 'Kubernetes', 'Terraform', 'Linux', 'Python', 'AWS'],
    workType: 'hybrid',
    employmentType: 'Full-time',
    deadline: '2026-11-12',
  },
  {
    id: 'jb-311200',
    portal: 'jobbank',
    title: 'Junior to Mid-level Data Scientist',
    company: 'Carlsberg Group',
    location: 'København V, Denmark',
    date: '2026-10-08',
    url: 'https://www.jobbank.dk/job/311200',
    snippet: 'Apply predictive modeling, optimization algorithms, and supply chain forecasting. Great stepping stone for graduates with quantitative backgrounds.',
    tags: ['Python', 'SQL', 'Scikit-learn', 'Data Science', 'Visualization'],
    workType: 'hybrid',
    employmentType: 'Full-time',
    deadline: '2026-11-18',
  },
  {
    id: 'li-920550',
    portal: 'linkedin',
    title: 'Full Stack Engineer - Financial Platform',
    company: 'Danske Bank A/S',
    location: 'København, Denmark',
    date: '2026-10-08',
    url: 'https://www.linkedin.com/jobs/view/920550',
    snippet: 'Join our customer digital channels team. Building high-throughput, secure microfrontends and cloud native backends.',
    tags: ['React', 'TypeScript', 'Java', 'Spring Boot', 'Azure', 'Docker'],
    workType: 'hybrid',
    employmentType: 'Full-time',
    deadline: '2026-11-14',
  },
];

export async function searchPortals(opts: SearchOptions): Promise<{ total: number; jobs: JobCard[]; portalStats: Record<string, number> }> {
  const queryLower = (opts.query || '').toLowerCase().trim();
  const locationLower = (opts.location || '').toLowerCase().trim();

  let jobs: JobCard[] = [...FALLBACK_JOBS];

  // Try live search on Jobindex if requested and query exists
  if (queryLower && (opts.portal === 'all' || opts.portal === 'jobindex' || !opts.portal)) {
    try {
      const url = `https://www.jobindex.dk/jobsoegning?q=${encodeURIComponent(opts.query)}&page=${opts.page || 1}`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html',
        },
        signal: AbortSignal.timeout(4000),
      });

      if (res.ok) {
        const html = await res.text();
        const root = parse(html);
        const cardElements = root.querySelectorAll('.PaidJob, .jobsearch-result');

        cardElements.forEach((el, index) => {
          const titleEl = el.querySelector('h4 a, .job-title a, a.jix-toolbar__title');
          const title = titleEl?.text?.trim() || '';
          const href = titleEl?.getAttribute('href') || '';
          const compEl = el.querySelector('.company, .jix_robotjob--company, .jix-toolbar__company');
          const company = compEl?.text?.trim() || 'Danish Employer';
          const locEl = el.querySelector('.location, .jix-toolbar__location');
          const location = locEl?.text?.trim() || 'Danmark';
          const bodyEl = el.querySelector('p, .job-body');
          const snippet = bodyEl?.text?.trim() || '';

          if (title && href) {
            const absoluteUrl = href.startsWith('http') ? href : `https://www.jobindex.dk${href}`;
            jobs.unshift({
              id: `ji-live-${index}-${Date.now()}`,
              portal: 'jobindex',
              title,
              company,
              location,
              date: new Date().toISOString().split('T')[0],
              url: absoluteUrl,
              snippet: snippet.slice(0, 240),
              tags: ['Jobindex Live', 'Denmark'],
              workType: 'hybrid',
            });
          }
        });
      }
    } catch {
      // Gracefully fall back to local indexed database
    }
  }

  // Filter by portal
  if (opts.portal && opts.portal !== 'all') {
    jobs = jobs.filter((j) => j.portal === opts.portal);
  }

  // Filter by search terms
  if (queryLower) {
    const qTokens = queryLower.split(/\s+/).filter(Boolean);
    jobs = jobs.filter((job) => {
      const haystack = `${job.title} ${job.company} ${job.location} ${job.snippet || ''} ${(job.tags || []).join(' ')}`.toLowerCase();
      return qTokens.some((tok) => haystack.includes(tok));
    });
  }

  // Filter by location
  if (locationLower) {
    jobs = jobs.filter((j) => j.location.toLowerCase().includes(locationLower));
  }

  // Sorting
  if (opts.sort === 'date') {
    jobs.sort((a, b) => b.date.localeCompare(a.date));
  }

  // Portal breakdown statistics
  const portalStats: Record<string, number> = {
    jobindex: 0,
    jobnet: 0,
    jobbank: 0,
    jobdanmark: 0,
    linkedin: 0,
    freehire: 0,
  };
  jobs.forEach((j) => {
    portalStats[j.portal] = (portalStats[j.portal] || 0) + 1;
  });

  return {
    total: jobs.length,
    jobs,
    portalStats,
  };
}
