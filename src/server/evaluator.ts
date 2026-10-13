import { CandidateProfile, JobEvaluation } from '../types.js';
import { searchCompanySalary } from './salaryLookup.js';

const KNOWN_SKILL_KEYWORDS = [
  'TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'Java', 'C#', 'C++',
  'React', 'Next.js', 'Vue', 'Angular', 'Node.js', 'Express', 'FastAPI', 'Django',
  'TailwindCSS', 'CSS', 'HTML', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis',
  'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Terraform', 'CI/CD', 'Git',
  'GraphQL', 'REST', 'Kafka', 'RabbitMQ', 'Microservices', 'PyTorch', 'TensorFlow',
  'Machine Learning', 'LLM', 'AI', 'NLP', 'Prompt Engineering', 'MLOps',
  'Linux', 'Agile', 'Scrum', 'DevOps', 'Databricks', 'Spark', 'SQL'
];

export function evaluateJob(
  job: { title: string; company: string; description?: string; location?: string; snippet?: string },
  profile: CandidateProfile
): JobEvaluation {
  const text = `${job.title} ${job.description || ''} ${job.snippet || ''} ${job.location || ''}`.toLowerCase();

  // Extract skills mentioned in job text
  const detectedSkills = KNOWN_SKILL_KEYWORDS.filter((skill) => {
    const rx = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    return rx.test(text);
  });

  const allCandidateSkills = new Set([
    ...profile.technicalSkills.languages.map((s) => s.toLowerCase()),
    ...profile.technicalSkills.frameworks.map((s) => s.toLowerCase()),
    ...profile.technicalSkills.cloudAndDevOps.map((s) => s.toLowerCase()),
    ...profile.technicalSkills.tools.map((s) => s.toLowerCase()),
    ...profile.domainExpertise.map((s) => s.toLowerCase()),
  ]);

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  detectedSkills.forEach((skill) => {
    if (allCandidateSkills.has(skill.toLowerCase())) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  const bonusSkills = profile.technicalSkills.languages
    .concat(profile.technicalSkills.frameworks)
    .filter((s) => !detectedSkills.map((d) => d.toLowerCase()).includes(s.toLowerCase()))
    .slice(0, 4);

  // Language Gate evaluation
  const requiresDanish = /\b(dansk|danish|flydende på dansk|danish speaking)\b/i.test(text);
  const candidateSpeaksDanish = profile.languages.some(
    (l) => l.language.toLowerCase().includes('danish') && (l.level.toLowerCase().includes('native') || l.level.toLowerCase().includes('fluent') || l.level.toLowerCase().includes('c') || l.level.toLowerCase().includes('b2'))
  );

  let languageGatePassed = true;
  let languageMessage = 'Language requirements met (English / Danish environments accepted).';

  if (requiresDanish) {
    if (candidateSpeaksDanish) {
      languageMessage = 'Language Gate: PASSED. Job explicitly requests Danish proficiency, and candidate holds verified fluency.';
    } else {
      languageGatePassed = false;
      languageMessage = 'Language Gate: CAUTION. Job mandates Danish fluency; candidate profile does not declare professional Danish level.';
    }
  }

  // Title relevance
  const titleLower = job.title.toLowerCase();
  const targetMatch = profile.targetTitles.some((t) => {
    const tokens = t.toLowerCase().split(/\s+/);
    return tokens.filter((tok) => tok.length > 3).some((tok) => titleLower.includes(tok));
  });

  // Calculate scores
  let baseScore = 65;
  if (targetMatch) baseScore += 12;

  const skillCoverage = detectedSkills.length > 0 ? matchedSkills.length / detectedSkills.length : 0.8;
  const skillScoreComponent = Math.round(skillCoverage * 20);

  let overallScore = Math.min(100, Math.max(30, baseScore + skillScoreComponent - missingSkills.length * 2));

  if (!languageGatePassed) {
    overallScore = Math.max(25, overallScore - 20);
  }

  // Rating determination
  let rating: JobEvaluation['rating'];
  if (overallScore >= 85) rating = 'Exceptional Match';
  else if (overallScore >= 72) rating = 'Strong Fit';
  else if (overallScore >= 58) rating = 'Moderate Fit';
  else if (overallScore >= 45) rating = 'Stretch Opportunity';
  else rating = 'Unfavorable';

  // Commute check
  const locLower = (job.location || '').toLowerCase();
  const isCph = locLower.includes('københavn') || locLower.includes('copenhagen') || locLower.includes('hovedstaden') || locLower.includes('bagsværd') || locLower.includes('gentofte');
  const commuteScore = isCph ? 95 : locLower.includes('remote') ? 100 : 60;
  const commuteNotes = isCph
    ? 'Within primary commute perimeter (Greater Copenhagen transit accessible).'
    : locLower.includes('remote')
    ? 'Full remote flexibility matches candidate criteria.'
    : 'Location may require extended travel or hybrid negotiation.';

  // Pros and Cons
  const pros: string[] = [];
  const cons: string[] = [];

  if (matchedSkills.length > 0) {
    pros.push(`Strong overlap on core stack: ${matchedSkills.slice(0, 4).join(', ')}.`);
  }
  if (targetMatch) {
    pros.push(`Role title directly aligns with target trajectory: ${job.title}.`);
  }
  if (isCph) {
    pros.push('Location is within preferred commuter zone.');
  }
  if (detectedSkills.includes('AI') || detectedSkills.includes('LLM') || detectedSkills.includes('Python')) {
    pros.push('High exposure to cutting-edge AI / intelligent automation pipelines.');
  }

  if (missingSkills.length > 0) {
    cons.push(`Posting mentions unfamiliar frameworks: ${missingSkills.slice(0, 3).join(', ')}.`);
  }
  if (!languageGatePassed) {
    cons.push('May require Danish native/C2 conversational fluency for stakeholder interactions.');
  }
  if (cons.length === 0) {
    cons.push('Competitive applicant pool expected due to brand visibility.');
  }

  // Recommendations
  let recommendation: JobEvaluation['recommendation'];
  if (overallScore >= 80 && languageGatePassed) recommendation = 'Priority Apply';
  else if (overallScore >= 65 && languageGatePassed) recommendation = 'Consider Applying';
  else if (missingSkills.length > 2) recommendation = 'Upskill First';
  else recommendation = 'Skip';

  // Salary insight
  const salaryResults = searchCompanySalary(job.company);
  let salaryInsight: string | undefined;
  if (salaryResults.length > 0) {
    const top = salaryResults[0];
    const diff = top.diffFromBaseline;
    const sign = diff && diff >= 0 ? '+' : '';
    salaryInsight = `Benchmark: ${top.company} index is ${sign}${diff}% relative to Danish median tech baseline.`;
  }

  return {
    jobTitle: job.title,
    company: job.company,
    overallScore,
    rating,
    skillsMatch: {
      matchedSkills,
      missingSkills,
      bonusSkills,
    },
    languageGate: {
      passed: languageGatePassed,
      required: requiresDanish ? ['Danish', 'English'] : ['English'],
      candidatePossesses: profile.languages.map((l) => `${l.language} (${l.level})`),
      message: languageMessage,
    },
    experienceMatch: {
      score: Math.min(100, 75 + profile.experience.length * 10),
      notes: `${profile.experience.length} relevant professional roles cataloged with senior achievements.`,
    },
    commuteMatch: {
      score: commuteScore,
      notes: commuteNotes,
    },
    pros,
    cons,
    recommendation,
    salaryInsight,
  };
}
