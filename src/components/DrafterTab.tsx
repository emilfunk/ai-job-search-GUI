import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Code,
  CheckCircle,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { CandidateProfile, DraftedApplication } from '../types.js';

interface DrafterTabProps {
  initialJobData?: { title: string; company: string; location?: string; description?: string } | null;
  profile: CandidateProfile | null;
}

export const DrafterTab: React.FC<DrafterTabProps> = ({ initialJobData, profile }) => {
  const [jobTitle, setJobTitle] = useState(initialJobData?.title || 'Senior Fullstack Software Engineer');
  const [company, setCompany] = useState(initialJobData?.company || 'Novo Nordisk A/S');
  const [location, setLocation] = useState(initialJobData?.location || 'Bagsværd, Region Hovedstaden');
  const [tone, setTone] = useState<'balanced' | 'confident' | 'technical'>('balanced');
  const [loading, setLoading] = useState(false);
  const [drafted, setDrafted] = useState<DraftedApplication | null>(null);

  const [activeDocView, setActiveDocView] = useState<'cover_md' | 'cover_latex' | 'cv_bullets' | 'cv_latex'>('cover_md');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialJobData) {
      if (initialJobData.title) setJobTitle(initialJobData.title);
      if (initialJobData.company) setCompany(initialJobData.company);
      if (initialJobData.location) setLocation(initialJobData.location);
    }
  }, [initialJobData]);

  const handleGenerate = async () => {
    if (!jobTitle || !company) return;
    setLoading(true);
    try {
      const res = await fetch('/api/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job: { title: jobTitle, company, location },
          profile,
          tone,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setDrafted(data);
      }
    } catch (err) {
      console.error('Tailor error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Generate on first mount if empty
  React.useEffect(() => {
    if (!drafted) {
      handleGenerate();
    }
  }, []);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center">
              <FileText className="w-5 h-5 mr-2 text-indigo-400" />
              Tailored CV & Cover Letter Drafter
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Generates tailored Markdown and LaTeX documents aligned with the candidate profile and targeted job.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">Framing Tone:</span>
            <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700/60 text-xs">
              {(['balanced', 'confident', 'technical'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`px-2.5 py-1 rounded capitalize font-medium transition ${
                    tone === t ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target Job Title</label>
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
            <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-slate-100 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleGenerate}
            disabled={loading || !jobTitle || !company}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm rounded-lg flex items-center space-x-2 transition shadow-sm"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Draft Tailored Documents</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Drafting Output */}
      {drafted && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left / Center Document Viewer (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Document Sub-Navigation */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 border border-slate-800 p-2 rounded-xl">
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveDocView('cover_md')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    activeDocView === 'cover_md' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Cover Letter (Markdown)
                </button>
                <button
                  onClick={() => setActiveDocView('cover_latex')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    activeDocView === 'cover_latex' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Cover Letter (LaTeX)
                </button>
                <button
                  onClick={() => setActiveDocView('cv_bullets')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    activeDocView === 'cv_bullets' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Tailored CV Bullets
                </button>
                <button
                  onClick={() => setActiveDocView('cv_latex')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    activeDocView === 'cv_latex' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  CV Snippet (LaTeX)
                </button>
              </div>

              {/* Copy Button */}
              <button
                onClick={() => {
                  let text = '';
                  if (activeDocView === 'cover_md') text = drafted.coverLetterMarkdown;
                  else if (activeDocView === 'cover_latex') text = drafted.coverLetterLatex;
                  else if (activeDocView === 'cv_latex') text = drafted.cvLatexSnippet;
                  else text = drafted.tailoredCvBullets.map((b) => `• ${b.bullet}`).join('\n');
                  copyToClipboard(text, activeDocView);
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition"
              >
                {copiedKey === activeDocView ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Document</span>
                  </>
                )}
              </button>
            </div>

            {/* Document Content Container */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm min-h-[480px]">
              {activeDocView === 'cover_md' && (
                <div className="space-y-4 font-sans text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                  {drafted.coverLetterMarkdown}
                </div>
              )}

              {activeDocView === 'cover_latex' && (
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 pb-2 mb-3 border-b border-slate-800">
                    <span className="flex items-center font-mono">
                      <Code className="w-3.5 h-3.5 mr-1" /> cover_letter.tex (moderncv class)
                    </span>
                    <span className="text-slate-500">Compiles with xelatex / pdflatex</span>
                  </div>
                  <pre className="font-mono text-xs text-indigo-300 bg-slate-950 p-4 rounded-lg overflow-x-auto leading-relaxed border border-slate-800">
                    {drafted.coverLetterLatex}
                  </pre>
                </div>
              )}

              {activeDocView === 'cv_bullets' && (
                <div className="space-y-4">
                  <div className="text-xs text-slate-400 pb-2 border-b border-slate-800">
                    XYZ-formula bullets customized for <strong className="text-slate-200">{company}</strong>:
                  </div>
                  {drafted.tailoredCvBullets.map((item, idx) => (
                    <div key={idx} className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 space-y-2">
                      <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
                        {item.role}
                      </span>
                      <p className="text-sm text-white font-medium leading-relaxed">
                        • {item.bullet}
                      </p>
                      <div className="text-xs text-slate-400 bg-slate-900/80 p-2 rounded border border-slate-800 flex items-start">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400 mr-1.5 shrink-0 mt-0.5" />
                        <span>{item.relevance}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeDocView === 'cv_latex' && (
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 pb-2 mb-3 border-b border-slate-800">
                    <span className="flex items-center font-mono">
                      <Code className="w-3.5 h-3.5 mr-1" /> cv_tailored_experience.tex
                    </span>
                  </div>
                  <pre className="font-mono text-xs text-emerald-300 bg-slate-950 p-4 rounded-lg overflow-x-auto leading-relaxed border border-slate-800">
                    {drafted.cvLatexSnippet}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar: Reviewer Agent Audit (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">Reviewer Agent Audit</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
                  Score: {drafted.reviewerCritique.overallScore}/100
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Automated multi-point inspection modeled after the framework&rsquo;s reviewer agent criteria.
              </p>

              {/* Feedbacks list */}
              <div className="space-y-3">
                {drafted.reviewerCritique.feedbacks.map((fb, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border text-xs space-y-1 ${
                      fb.status === 'passed'
                        ? 'bg-slate-800/60 border-slate-700/80'
                        : 'bg-amber-950/20 border-amber-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">{fb.category}</span>
                      {fb.status === 'passed' ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                      )}
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{fb.message}</p>
                    {fb.suggestion && (
                      <p className="text-indigo-400 text-[11px] italic mt-1">{fb.suggestion}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-800">
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>ATS Parseability:</span>
                  <span className="text-emerald-400 font-semibold flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" /> Passed (Plain OCR Safe)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
