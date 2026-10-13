import React, { useState } from 'react';
import {
  Search,
  MapPin,
  ExternalLink,
  CheckCircle,
  PlusCircle,
  Building,
  Calendar,
  Filter,
  RefreshCw,
  Sparkles,
  Layers,
} from 'lucide-react';
import { JobCard, PortalType, Application } from '../types.js';

interface PortalSearchTabProps {
  onSelectForEvaluation: (job: JobCard) => void;
  onAddToPipeline: (job: JobCard) => void;
  applications: Application[];
}

export const PortalSearchTab: React.FC<PortalSearchTabProps> = ({
  onSelectForEvaluation,
  onAddToPipeline,
  applications,
}) => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [selectedPortal, setSelectedPortal] = useState<PortalType | 'all'>('all');
  const [sort, setSort] = useState<'score' | 'date'>('score');
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<JobCard[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [portalStats, setPortalStats] = useState<Record<string, number>>({});

  const portalOptions: Array<{ id: PortalType | 'all'; label: string; desc: string }> = [
    { id: 'all', label: 'All Portals', desc: 'Unified cross-portal search' },
    { id: 'jobindex', label: 'Jobindex.dk', desc: "Denmark's largest job portal" },
    { id: 'jobnet', label: 'Jobnet', desc: 'Danish official employment board' },
    { id: 'jobbank', label: 'Akademikernes Jobbank', desc: 'Academic & graduate specialist roles' },
    { id: 'jobdanmark', label: 'Jobdanmark', desc: 'Regional Danish employment' },
    { id: 'linkedin', label: 'LinkedIn Jobs', desc: 'Global & Danish enterprise listings' },
    { id: 'freehire', label: 'Freehire', desc: 'Freelance & contractor projects' },
  ];

  const quickFilters = ['TypeScript', 'Fullstack', 'AI / ML', 'React', 'Python', 'Remote', 'Kubernetes'];

  const handleSearch = async (overrideQuery?: string) => {
    const q = overrideQuery !== undefined ? overrideQuery : query;
    setLoading(true);
    setHasSearched(true);
    try {
      const params = new URLSearchParams({
        q,
        portal: selectedPortal,
        location,
        sort,
      });
      const res = await fetch(`/api/portals/search?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
        setTotalCount(data.total || 0);
        setPortalStats(data.portalStats || {});
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Perform initial search on component mount if empty
  React.useEffect(() => {
    handleSearch('');
  }, [selectedPortal, sort]);

  const isJobTracked = (jobId: string, url: string) => {
    return applications.some((a) => a.jobId === jobId || a.url === url);
  };

  const getPortalBadgeColor = (portal: PortalType) => {
    switch (portal) {
      case 'jobindex':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'jobnet':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'jobbank':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'jobdanmark':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'linkedin':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      case 'freehire':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Search Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center">
              <Search className="w-5 h-5 mr-2 text-indigo-400" />
              Multi-Portal Job Search
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Scrape and query Danish job boards, LinkedIn, and contractor opportunities simultaneously.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">Sort:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="score">Relevance Match</option>
              <option value="date">Newest Date</option>
            </select>
          </div>
        </div>

        {/* Search Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Keywords (e.g., Software Engineer, React, Fullstack, AI, Data)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full bg-slate-800/80 border border-slate-700 text-slate-100 pl-9 pr-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="md:col-span-4 relative">
            <MapPin className="w-4 h-4 absolute left-3 top-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="City / Region (e.g. København, Aarhus, Remote)..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full bg-slate-800/80 border border-slate-700 text-slate-100 pl-9 pr-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="md:col-span-2">
            <button
              onClick={() => handleSearch()}
              disabled={loading}
              className="w-full h-full min-h-[42px] bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-sm rounded-lg flex items-center justify-center space-x-2 transition shadow-sm"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Filter Tags */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-slate-800/60">
          <span className="text-xs text-slate-400 flex items-center mr-1">
            <Sparkles className="w-3 h-3 mr-1 text-amber-400" /> Quick:
          </span>
          {quickFilters.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setQuery(tag);
                handleSearch(tag);
              }}
              className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition border border-slate-700/60"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Portal Filter Tabs */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
            {portalOptions.map((p) => {
              const isSelected = selectedPortal === p.id;
              const count = p.id === 'all' ? totalCount : portalStats[p.id] || 0;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPortal(p.id)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
                    isSelected
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50'
                      : 'bg-slate-800/40 text-slate-400 border-slate-700/50 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span>{p.label}</span>
                  {count > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 text-[10px]">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-sm text-slate-400 px-1">
        <div>
          Showing <span className="font-semibold text-white">{jobs.length}</span> positions{' '}
          {selectedPortal !== 'all' && `on ${selectedPortal}`}
        </div>
        <div className="text-xs text-slate-500 flex items-center">
          <Layers className="w-3.5 h-3.5 mr-1" />
          Click &ldquo;Evaluate Fit&rdquo; to benchmark candidate requirements
        </div>
      </div>

      {/* Job Cards Grid */}
      {loading ? (
        <div className="py-16 text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-400 mb-3" />
          <p className="text-slate-400 text-sm">Querying job portal search engines...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
          <Search className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-200">No postings found</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
            Try adjusting your search keywords, broadening the location filter, or toggling &ldquo;All Portals&rdquo;.
          </p>
          <button
            onClick={() => {
              setQuery('');
              setLocation('');
              setSelectedPortal('all');
              handleSearch('');
            }}
            className="mt-4 px-4 py-2 bg-slate-800 text-slate-200 text-xs rounded-lg hover:bg-slate-700 transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5">
          {jobs.map((job) => {
            const tracked = isJobTracked(job.id, job.url);
            return (
              <div
                key={job.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition shadow-sm group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span
                        className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${getPortalBadgeColor(
                          job.portal
                        )}`}
                      >
                        {job.portal}
                      </span>
                      {job.workType && (
                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60 capitalize">
                          {job.workType}
                        </span>
                      )}
                      {job.employmentType && (
                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                          {job.employmentType}
                        </span>
                      )}
                      <span className="text-xs text-slate-500 flex items-center ml-auto sm:ml-0">
                        <Calendar className="w-3 h-3 mr-1" />
                        {job.date}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition">
                      {job.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-1">
                      <span className="flex items-center text-slate-300 font-medium">
                        <Building className="w-3.5 h-3.5 mr-1 text-slate-500" />
                        {job.company}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-slate-500" />
                        {job.location}
                      </span>
                      {job.deadline && (
                        <span className="text-amber-400/90 text-xs">
                          Deadline: {job.deadline}
                        </span>
                      )}
                    </div>

                    {job.snippet && (
                      <p className="text-xs text-slate-300/90 mt-2.5 leading-relaxed line-clamp-2">
                        {job.snippet}
                      </p>
                    )}

                    {job.tags && job.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {job.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] px-2 py-0.5 bg-slate-800/80 text-slate-300 rounded border border-slate-700/40"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                    <button
                      onClick={() => onSelectForEvaluation(job)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition shadow-sm whitespace-nowrap"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Evaluate Fit</span>
                    </button>

                    <button
                      onClick={() => onAddToPipeline(job)}
                      disabled={tracked}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition whitespace-nowrap ${
                        tracked
                          ? 'bg-slate-800 text-slate-500 border border-slate-700/40 cursor-default'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                      }`}
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>{tracked ? 'In Pipeline' : 'Track Job'}</span>
                    </button>

                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-400 hover:text-indigo-300 rounded-lg hover:bg-slate-800 transition"
                      title="Open job listing on portal"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
