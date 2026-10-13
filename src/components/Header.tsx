import React from 'react';
import {
  Search,
  CheckCircle2,
  Kanban,
  FileText,
  BadgeDollarSign,
  User,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { CandidateProfile, Application } from '../types.js';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile: CandidateProfile | null;
  applications: Application[];
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  profile,
  applications,
}) => {
  const activeAppsCount = applications.filter(
    (a) => a.status === 'applied' || a.status === 'interviewing' || a.status === 'tailoring'
  ).length;
  const interviewingCount = applications.filter((a) => a.status === 'interviewing').length;

  const navItems = [
    { id: 'search', label: 'Job Portals', icon: Search },
    { id: 'evaluate', label: 'Fit Scorer', icon: CheckCircle2 },
    { id: 'pipeline', label: 'Applications', icon: Kanban, badge: activeAppsCount },
    { id: 'drafter', label: 'CV & Cover Letter', icon: FileText },
    { id: 'salary', label: 'Salary Benchmarks', icon: BadgeDollarSign },
    { id: 'interview', label: 'Interview & Prep', icon: GraduationCap },
    { id: 'profile', label: 'Candidate Profile', icon: User },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Mascot */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('search')}>
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center shadow-inner">
              <img
                src="/assets/mascot/pip_flight_loop.gif"
                alt="Pip the courier bird"
                className="w-9 h-9 object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white flex items-center">
                  AI Job Search <span className="ml-1.5 text-xs px-2 py-0.5 rounded font-mono font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">GUI</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans">
                {profile ? `${profile.name} • ${profile.location}` : 'The job search that runs on your machine'}
              </p>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="hidden lg:flex items-center space-x-3 text-xs bg-slate-800/60 border border-slate-700/60 px-3 py-1.5 rounded-lg">
            <span className="flex items-center text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
              {interviewingCount} Interview{interviewingCount === 1 ? '' : 's'}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">
              {applications.length} Total Tracked
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-indigo-400 font-medium flex items-center">
              <Sparkles className="w-3 h-3 mr-1" />
              Danish & EU Portals
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/80">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-xs font-semibold ${
                      isActive ? 'bg-indigo-900 text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
