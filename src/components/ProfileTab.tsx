import React, { useState } from 'react';
import {
  User,
  Save,
  Check,
  Plus,
  Trash2,
  Globe,
  Briefcase,
  GraduationCap,
  Cpu,
  Layers,
} from 'lucide-react';
import { CandidateProfile, ExperienceItem, CandidateLanguage } from '../types.js';

interface ProfileTabProps {
  profile: CandidateProfile | null;
  onUpdateProfile: (profile: CandidateProfile) => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ profile, onUpdateProfile }) => {
  if (!profile) return null;

  const [formData, setFormData] = useState<CandidateProfile>(profile);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync if prop changes externally
  React.useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        onUpdateProfile(formData);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (err) {
      console.error('Failed to save profile:', err);
    }
  };

  const handleAddLanguage = () => {
    const updated: CandidateLanguage[] = [
      ...formData.languages,
      { language: 'New Language', level: 'Professional (C1)', isNative: false },
    ];
    setFormData({ ...formData, languages: updated });
  };

  const handleRemoveLanguage = (idx: number) => {
    const updated = formData.languages.filter((_, i) => i !== idx);
    setFormData({ ...formData, languages: updated });
  };

  const handleAddExperience = () => {
    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      title: 'Senior Software Engineer',
      company: 'Tech Company',
      location: 'København',
      period: '2023 - Present',
      responsibilities: ['Architected key microservices and user interfaces.'],
      achievements: ['Increased system performance by 30%.'],
    };
    setFormData({ ...formData, experience: [newExp, ...formData.experience] });
  };

  const handleRemoveExperience = (id: string) => {
    setFormData({
      ...formData,
      experience: formData.experience.filter((e) => e.id !== id),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center">
            <User className="w-5 h-5 mr-2 text-indigo-400" />
            Candidate Profile (Single Source of Truth)
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            This profile fuels all match scoring, language gating, CV tailoring, and interview generation workflows.
          </p>
        </div>

        <button
          onClick={() => handleSave()}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold flex items-center space-x-2 transition shadow-sm self-start sm:self-auto"
        >
          {saveSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Saved Successfully</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Profile</span>
            </>
          )}
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Identity & Preferences (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Identity Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3.5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
              <User className="w-4 h-4 mr-1.5 text-indigo-400" /> Identity & Contact
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2 rounded focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2 rounded focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2 rounded focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Base Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2 rounded focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Commute & Travel Boundaries</label>
                <input
                  type="text"
                  value={formData.commuteConstraints}
                  onChange={(e) => setFormData({ ...formData, commuteConstraints: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2 rounded focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">LinkedIn Profile</label>
                  <input
                    type="text"
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2 rounded focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">GitHub Profile</label>
                  <input
                    type="text"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2 rounded focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Executive Summary / Bio</label>
                <textarea
                  rows={3}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2 rounded focus:outline-none focus:border-indigo-500 text-xs leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Preferences Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3.5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
              <Briefcase className="w-4 h-4 mr-1.5 text-indigo-400" /> Target Criteria
            </h3>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Min Target Salary (DKK/mo)</label>
                  <input
                    type="number"
                    value={formData.minSalaryDkk}
                    onChange={(e) => setFormData({ ...formData, minSalaryDkk: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2 rounded focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Work Arrangement</label>
                  <select
                    value={formData.workPreference}
                    onChange={(e) => setFormData({ ...formData, workPreference: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2 rounded focus:outline-none focus:border-indigo-500 capitalize"
                  >
                    <option value="hybrid">Hybrid</option>
                    <option value="remote">Full Remote</option>
                    <option value="onsite">On-site</option>
                    <option value="any">Flexible / Any</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Target Role Titles (Comma-separated)</label>
                <input
                  type="text"
                  value={formData.targetTitles.join(', ')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      targetTitles: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2 rounded focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Languages Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
                <Globe className="w-4 h-4 mr-1.5 text-indigo-400" /> Languages (Language Gate)
              </h3>
              <button
                onClick={handleAddLanguage}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="space-y-2">
              {formData.languages.map((lang, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-xs">
                  <input
                    type="text"
                    value={lang.language}
                    onChange={(e) => {
                      const updated = [...formData.languages];
                      updated[idx].language = e.target.value;
                      setFormData({ ...formData, languages: updated });
                    }}
                    placeholder="Language"
                    className="w-1/3 bg-slate-800 border border-slate-700 text-slate-100 p-1.5 rounded focus:outline-none"
                  />
                  <input
                    type="text"
                    value={lang.level}
                    onChange={(e) => {
                      const updated = [...formData.languages];
                      updated[idx].level = e.target.value;
                      setFormData({ ...formData, languages: updated });
                    }}
                    placeholder="Level (e.g. Native / C2)"
                    className="flex-1 bg-slate-800 border border-slate-700 text-slate-100 p-1.5 rounded focus:outline-none"
                  />
                  <button
                    onClick={() => handleRemoveLanguage(idx)}
                    className="p-1.5 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Skills, Experience, Education (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Technical Skills Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
              <Cpu className="w-4 h-4 mr-1.5 text-indigo-400" /> Technical Skills Catalog
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Programming Languages</label>
                <input
                  type="text"
                  value={formData.technicalSkills.languages.join(', ')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      technicalSkills: {
                        ...formData.technicalSkills,
                        languages: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      },
                    })
                  }
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2 rounded focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Frameworks & Libraries</label>
                <input
                  type="text"
                  value={formData.technicalSkills.frameworks.join(', ')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      technicalSkills: {
                        ...formData.technicalSkills,
                        frameworks: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      },
                    })
                  }
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2 rounded focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Cloud, Infrastructure & Containers</label>
                <input
                  type="text"
                  value={formData.technicalSkills.cloudAndDevOps.join(', ')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      technicalSkills: {
                        ...formData.technicalSkills,
                        cloudAndDevOps: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      },
                    })
                  }
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2 rounded focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Databases, Message Queues & Tools</label>
                <input
                  type="text"
                  value={formData.technicalSkills.tools.join(', ')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      technicalSkills: {
                        ...formData.technicalSkills,
                        tools: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      },
                    })
                  }
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2 rounded focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Experience History */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
                <Briefcase className="w-4 h-4 mr-1.5 text-indigo-400" /> Professional Experience
              </h3>
              <button
                onClick={handleAddExperience}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Role</span>
              </button>
            </div>

            <div className="space-y-4">
              {formData.experience.map((exp, idx) => (
                <div
                  key={exp.id}
                  className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 text-xs space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="grid grid-cols-2 gap-2 flex-1 mr-3">
                      <input
                        type="text"
                        placeholder="Job Title"
                        value={exp.title}
                        onChange={(e) => {
                          const updated = [...formData.experience];
                          updated[idx].title = e.target.value;
                          setFormData({ ...formData, experience: updated });
                        }}
                        className="bg-slate-800 border border-slate-700 text-white font-semibold p-1.5 rounded focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Company"
                        value={exp.company}
                        onChange={(e) => {
                          const updated = [...formData.experience];
                          updated[idx].company = e.target.value;
                          setFormData({ ...formData, experience: updated });
                        }}
                        className="bg-slate-800 border border-slate-700 text-slate-300 p-1.5 rounded focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveExperience(exp.id)}
                      className="p-1 text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Period (e.g. 2021 - Present)"
                      value={exp.period}
                      onChange={(e) => {
                        const updated = [...formData.experience];
                        updated[idx].period = e.target.value;
                        setFormData({ ...formData, experience: updated });
                      }}
                      className="bg-slate-800 border border-slate-700 text-slate-300 p-1.5 rounded focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={exp.location}
                      onChange={(e) => {
                        const updated = [...formData.experience];
                        updated[idx].location = e.target.value;
                        setFormData({ ...formData, experience: updated });
                      }}
                      className="bg-slate-800 border border-slate-700 text-slate-300 p-1.5 rounded focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Key Responsibilities (One per line)</label>
                    <textarea
                      rows={2}
                      value={exp.responsibilities.join('\n')}
                      onChange={(e) => {
                        const updated = [...formData.experience];
                        updated[idx].responsibilities = e.target.value.split('\n').filter(Boolean);
                        setFormData({ ...formData, experience: updated });
                      }}
                      className="w-full bg-slate-800 border border-slate-700 text-slate-200 p-2 rounded focus:outline-none font-sans"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
