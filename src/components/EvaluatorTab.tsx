import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Globe,
  MapPin,
  RefreshCw,
  PlusCircle,
  FileText,
  BadgeDollarSign,
} from 'lucide-react';
import { CandidateProfile, JobEvaluation, JobCard } from '../types.js';

interface EvaluatorTabProps {
  initialJob?: JobCard | null;
  profile: CandidateProfile | null;
  onDraftApplication: (jobData: { title: string; company: string; location?: string; description?: string }) => void;
  onAddToPipelineWithScore: (jobData: { title: string; company: string; location?: string; url?: string }, score: number) => void;
}

export const EvaluatorTab: React.FC<EvaluatorTabProps> = ({
  initialJob,
  profile,
  onDraftApplication,
  onAddToPipelineWithScore,
}) => {
  const [jobTitle, setJobTitle] = useState(initialJob?.title || 'Senior Fullstack Software Engineer');
  const [company, setCompany] = useState(initialJob?.company || 'Novo Nordisk A/S');
  const [location, setLocation] = useState(initialJob?.location || 'Bagsværd, Region Hovedstaden');
  const [description, setDescription] = useState(
    initialJob?.snippet ||
      `We are looking for a Senior Fullstack Software Engineer to build laboratory informatics platforms and AI pipelines.
Required qualifications:
- Strong experience with TypeScript, React, and Node.js
- Experience with cloud infrastructure (AWS/Azure), Docker, and Kubernetes
- Exposure to Python, PostgreSQL, and GraphQL
- Danish conversational proficiency is an advantage but English is our company working language
- Strong focus on automated testing, CI/CD, and software architecture`
  );

  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<JobEvaluation | null>(null);

  // If initialJob changes, update inputs
  React.useEffect(() => {
    if (initialJob) {
      setJobTitle(initialJob.title);
      setCompany(initialJob.company);
      setLocation(initialJob.location);
      if (initialJob.snippet) {
        setDescription(initialJob.snippet);
      }
    }
  }, [initialJob]);

  const handleEvaluate = async () => {
    if (!jobTitle || !company) return;
    setLoading(true);
    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job: {
            title: jobTitle,
            company,
            location,
            description,
          },
          profile,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setEvaluation(data);
      }
    } catch (err) {
      console.error('Evaluation error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Run evaluation automatically on first load if we have inputs
  React.useEffect(() => {
    if (!evaluation) {
      handleEvaluate();
    }
  }, []);

  const loadPreset = (preset: 'novo' | 'pleo' | 'unity') => {
    if (preset === 'novo') {
      setJobTitle('Senior Fullstack Software Engineer');
      setCompany('Novo Nordisk A/S');
      setLocation('Bagsværd, Region Hovedstaden');
      setDescription(
        'Building next-gen digital laboratory tooling in TypeScript, React, and Node.js. Requires experience in Docker, AWS, PostgreSQL, and GraphQL. English working language, Danish is a plus.'
      );
    } else if (preset === 'pleo') {
      setJobTitle('AI / Machine Learning Engineer');
      setCompany('Pleo Technologies ApS');
      setLocation('København K, Denmark');
      setDescription(
        'Developing intelligent automation algorithms, LLM agents, and expense categorization. Requirements: Python, PyTorch, Kubernetes, FastAPI, REST, and MLOps. English working environment.'
      );
    } else if (preset === 'unity') {
      setJobTitle('Senior Software Engineer - Developer Platform');
      setCompany('Unity Technologies ApS');
      setLocation('København / Remote in Denmark');
      setDescription(
        'Architecting core developer platform infrastructure, build systems, and distributed rendering engines. Tech: C++, TypeScript, Rust, Docker, and CI/CD pipelines.'
      );
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10';
    if (score >= 70) return 'text-indigo-400 border-indigo-500/50 bg-indigo-500/10';
    if (score >= 55) return 'text-amber-400 border-amber-500/50 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/50 bg-rose-500/10';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center">
              <CheckCircle2 className="w-5 h-5 mr-2 text-indigo-400" />
              Job Fit Scorer & Evaluator
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Benchmark any job posting against your single-source candidate profile, skills, languages, and commute gates.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">Presets:</span>
            <button
              onClick={() => loadPreset('novo')}
              className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            >
              Novo Nordisk
            </button>
            <button
              onClick={() => loadPreset('pleo')}
              className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            >
              Pleo
            </button>
            <button
              onClick={() => loadPreset('unity')}
              className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            >
              Unity
            </button>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Job Title</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-slate-100 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Company</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-slate-100 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Location / Work Type</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-slate-100 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Job Description & Required Qualifications
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-slate-100 p-3 rounded-lg text-xs leading-relaxed font-mono focus:outline-none focus:border-indigo-500"
            placeholder="Paste raw job description, requirements list, or responsibilities here..."
          />
        </div>

        <div className="flex justify-end mt-3">
          <button
            onClick={handleEvaluate}
            disabled={loading || !jobTitle || !company}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm rounded-lg flex items-center space-x-2 transition shadow-sm"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Evaluate Fit Rating</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Evaluation Results Card */}
      {evaluation && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
          {/* Top Score Summary Banner */}
          <div className="flex flex-col md:flex-row items-center justify-between p-5 rounded-xl bg-slate-800/40 border border-slate-700/60 gap-4">
            <div className="flex items-center space-x-4">
              <div
                className={`w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center font-bold shadow-inner ${getScoreColor(
                  evaluation.overallScore
                )}`}
              >
                <span className="text-3xl leading-none">{evaluation.overallScore}</span>
                <span className="text-[10px] uppercase font-mono tracking-wider opacity-80 mt-1">/ 100</span>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-white">{evaluation.rating}</span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                      evaluation.recommendation === 'Priority Apply'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : evaluation.recommendation === 'Consider Applying'
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    {evaluation.recommendation}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Targeted role at <strong className="text-slate-200">{evaluation.company}</strong> ({evaluation.jobTitle})
                </p>
                {evaluation.salaryInsight && (
                  <div className="flex items-center text-xs text-emerald-400 font-medium mt-1.5">
                    <BadgeDollarSign className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                    {evaluation.salaryInsight}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-2.5 w-full md:w-auto justify-end">
              <button
                onClick={() =>
                  onDraftApplication({
                    title: jobTitle,
                    company,
                    location,
                    description,
                  })
                }
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition shadow-sm"
              >
                <FileText className="w-4 h-4" />
                <span>Draft CV & Letter</span>
              </button>

              <button
                onClick={() =>
                  onAddToPipelineWithScore(
                    {
                      title: jobTitle,
                      company,
                      location,
                      url: initialJob?.url,
                    },
                    evaluation.overallScore
                  )
                }
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Save to Pipeline</span>
              </button>
            </div>
          </div>

          {/* Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Skills Alignment */}
            <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center mb-3">
                <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-400" />
                Skills Match Analysis
              </h4>

              <div className="space-y-3">
                <div>
                  <span className="text-xs text-slate-400 block mb-1">Matched Technologies:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {evaluation.skillsMatch.matchedSkills.length > 0 ? (
                      evaluation.skillsMatch.matchedSkills.map((s, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded font-medium"
                        >
                          ✓ {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500 italic">None explicitly matched from keywords</span>
                    )}
                  </div>
                </div>

                {evaluation.skillsMatch.missingSkills.length > 0 && (
                  <div>
                    <span className="text-xs text-slate-400 block mb-1">Gaps / Unlisted in Profile:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {evaluation.skillsMatch.missingSkills.map((s, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded"
                        >
                          ! {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {evaluation.skillsMatch.bonusSkills.length > 0 && (
                  <div>
                    <span className="text-xs text-slate-400 block mb-1">Your Bonus Strengths:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {evaluation.skillsMatch.bonusSkills.map((s, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-0.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 rounded"
                        >
                          + {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Language & Commute Gates */}
            <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center mb-2">
                  <Globe className="w-4 h-4 mr-1.5 text-indigo-400" />
                  Language Gate
                </h4>
                <div
                  className={`p-2.5 rounded-lg border text-xs leading-relaxed ${
                    evaluation.languageGate.passed
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  }`}
                >
                  {evaluation.languageGate.message}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center mb-2">
                  <MapPin className="w-4 h-4 mr-1.5 text-indigo-400" />
                  Commute & Location Match
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                  {evaluation.commuteMatch.notes}
                </p>
              </div>
            </div>
          </div>

          {/* Pros & Cons Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center mb-2">
                <ThumbsUp className="w-4 h-4 mr-1.5" />
                Strategic Advantages
              </h4>
              <ul className="space-y-1.5">
                {evaluation.pros.map((pro, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start">
                    <span className="text-emerald-400 mr-2 font-bold">•</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-950/20 border border-amber-500/20 rounded-xl p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center mb-2">
                <ThumbsDown className="w-4 h-4 mr-1.5" />
                Considerations & Risks
              </h4>
              <ul className="space-y-1.5">
                {evaluation.cons.map((con, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start">
                    <span className="text-amber-400 mr-2 font-bold">•</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
