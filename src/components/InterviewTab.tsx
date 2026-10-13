import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  HelpCircle,
  MessageSquare,
  Compass,
  CheckCircle2,
  TrendingUp,
  RefreshCw,
  Lightbulb,
} from 'lucide-react';
import { CandidateProfile, InterviewPrepPackage } from '../types.js';

interface InterviewTabProps {
  initialJobData?: { title: string; company: string } | null;
  profile: CandidateProfile | null;
}

export const InterviewTab: React.FC<InterviewTabProps> = ({ initialJobData, profile }) => {
  const [role, setRole] = useState(initialJobData?.title || 'Senior Fullstack Software Engineer');
  const [company, setCompany] = useState(initialJobData?.company || 'Novo Nordisk A/S');
  const [loading, setLoading] = useState(false);
  const [prepPackage, setPrepPackage] = useState<InterviewPrepPackage | null>(null);

  React.useEffect(() => {
    if (initialJobData) {
      if (initialJobData.title) setRole(initialJobData.title);
      if (initialJobData.company) setCompany(initialJobData.company);
    }
  }, [initialJobData]);

  const handleGenerate = async () => {
    if (!role || !company) return;
    setLoading(true);
    try {
      const res = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, company, profile }),
      });
      if (res.ok) {
        const data = await res.json();
        setPrepPackage(data);
      }
    } catch (err) {
      console.error('Interview prep generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (!prepPackage) {
      handleGenerate();
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner & Control */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center">
              <GraduationCap className="w-5 h-5 mr-2 text-indigo-400" />
              Interview Prep & Upskilling Coach
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Structured STAR-format answers, technical deep dives, smart questions to ask, and targeted upskill roadmaps.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target Position</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
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
          <div className="flex items-end">
            <button
              onClick={handleGenerate}
              disabled={loading || !role || !company}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm rounded-lg flex items-center justify-center space-x-2 transition shadow-sm"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Prep Package</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Package Contents */}
      {prepPackage && (
        <div className="space-y-6">
          {/* Behavioral STAR Questions */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-white flex items-center">
              <MessageSquare className="w-4 h-4 mr-2 text-indigo-400" />
              Behavioral & Culture Questions (STAR Format)
            </h3>

            <div className="space-y-4">
              {prepPackage.behavioralQuestions.map((q, idx) => (
                <div key={idx} className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-white text-sm leading-snug">
                      Q{idx + 1}: &ldquo;{q.question}&rdquo;
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                      {q.type}
                    </span>
                  </div>

                  {/* STAR Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2 pt-1 text-xs">
                    <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-indigo-400 font-bold block mb-1">Situation</span>
                      <p className="text-slate-300 leading-relaxed text-[11px]">{q.suggestedStarAnswer.situation}</p>
                    </div>
                    <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-indigo-400 font-bold block mb-1">Task</span>
                      <p className="text-slate-300 leading-relaxed text-[11px]">{q.suggestedStarAnswer.task}</p>
                    </div>
                    <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-indigo-400 font-bold block mb-1">Action</span>
                      <p className="text-slate-300 leading-relaxed text-[11px]">{q.suggestedStarAnswer.action}</p>
                    </div>
                    <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-emerald-400 font-bold block mb-1">Result</span>
                      <p className="text-slate-300 leading-relaxed text-[11px]">{q.suggestedStarAnswer.result}</p>
                    </div>
                  </div>

                  {/* Talking Tips */}
                  {q.talkingTips.length > 0 && (
                    <div className="text-[11px] text-slate-400 bg-slate-900/40 p-2 rounded flex items-center space-x-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{q.talkingTips.join(' • ')}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Technical Deep Dives & Questions to Ask */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Technical Questions */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-white flex items-center">
                <Compass className="w-4 h-4 mr-2 text-indigo-400" />
                Technical Architecture Questions
              </h3>

              <div className="space-y-3">
                {prepPackage.technicalQuestions.map((q, idx) => (
                  <div key={idx} className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 text-xs space-y-2">
                    <span className="font-semibold text-white block">
                      &ldquo;{q.question}&rdquo;
                    </span>
                    <p className="text-slate-300 leading-relaxed text-[11px] bg-slate-900/80 p-2.5 rounded border border-slate-800">
                      <strong>Recommended Strategy:</strong> {q.suggestedStarAnswer.action}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Reverse Questions to Ask */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-white flex items-center">
                <HelpCircle className="w-4 h-4 mr-2 text-emerald-400" />
                Smart Questions to Ask the Hiring Team
              </h3>

              <div className="space-y-2.5">
                {prepPackage.smartQuestionsToAsk.map((qText, idx) => (
                  <div key={idx} className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-3 text-xs flex items-start space-x-2.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      {idx + 1}
                    </span>
                    <p className="text-slate-200 leading-relaxed">{qText}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upskilling Roadmap */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-white flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-indigo-400" />
              Targeted Upskilling Roadmap for {role}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {prepPackage.upskillRoadmap.map((item, idx) => (
                <div key={idx} className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{item.skill}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        item.priority === 'High'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}
                    >
                      {item.priority} Priority
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{item.recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
