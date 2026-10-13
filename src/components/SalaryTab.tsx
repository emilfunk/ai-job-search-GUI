import React, { useState, useEffect } from 'react';
import {
  BadgeDollarSign,
  Search,
  MapPin,
  Building,
  TrendingUp,
  Info,
  Layers,
  Upload,
  Check,
  RefreshCw,
} from 'lucide-react';
import { SalaryLookupResult, SalaryCompanyRecord } from '../types.js';

export const SalaryTab: React.FC = () => {
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('');
  const [results, setResults] = useState<SalaryLookupResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState<any>(null);
  const [allCompanies, setAllCompanies] = useState<SalaryCompanyRecord[]>([]);

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [rawJsonInput, setRawJsonInput] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const fetchSalaryData = async (searchQuery = query, searchCity = city) => {
    setLoading(true);
    try {
      if (searchQuery.trim() || searchCity.trim()) {
        const params = new URLSearchParams({ q: searchQuery });
        if (searchCity) params.set('city', searchCity);
        const res = await fetch(`/api/salary/lookup?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } else {
        const res = await fetch('/api/salary/all');
        if (res.ok) {
          const data = await res.json();
          setMetadata(data.metadata);
          setAllCompanies(data.companies || []);
          // Map all to results format
          const baseline = data.metadata?.index_baseline ?? 100;
          const mapped: SalaryLookupResult[] = (data.companies || []).map((c: SalaryCompanyRecord) => {
            const allIdx = c.categories?.all_employees?.index;
            const numIdx = typeof allIdx === 'number' ? allIdx : parseFloat(allIdx as string) || undefined;
            const diff = numIdx !== undefined ? Math.round(((numIdx - baseline) / baseline) * 1000) / 10 : undefined;
            return {
              score: 100,
              company: c.company,
              city: c.city,
              categories: c.categories || {},
              diffFromBaseline: diff,
            };
          });
          setResults(mapped);
        }
      }
    } catch (err) {
      console.error('Salary fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaryData();
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    fetchSalaryData(query, city);
  };

  const handleSaveJson = async () => {
    try {
      const parsed = JSON.parse(rawJsonInput);
      const res = await fetch('/api/salary/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      });
      if (res.ok) {
        setImportStatus('Dataset updated successfully!');
        setTimeout(() => {
          setIsImportModalOpen(false);
          setImportStatus(null);
          fetchSalaryData('', '');
        }, 1200);
      }
    } catch (err: any) {
      setImportStatus(`Invalid JSON: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center">
              <BadgeDollarSign className="w-5 h-5 mr-2 text-emerald-400" />
              Danish Salary Benchmark Explorer
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Fuzzy-match company compensation statistics against Danish market index baselines (IDA, Djøf, Prosa).
            </p>
          </div>

          <button
            onClick={() => {
              setRawJsonInput(
                JSON.stringify(
                  {
                    metadata,
                    companies: allCompanies,
                  },
                  null,
                  2
                )
              );
              setIsImportModalOpen(true);
            }}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition self-start md:self-auto"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Edit / Import JSON</span>
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search company (e.g. Novo Nordisk, Danske Bank, Pleo, Lego)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-slate-100 pl-9 pr-3 py-2 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="md:col-span-4 relative">
            <MapPin className="w-4 h-4 absolute left-3 top-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Filter by city (e.g. Bagsværd, København, Aarhus)..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-slate-100 pl-9 pr-3 py-2 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-full min-h-[40px] bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-sm rounded-lg flex items-center justify-center space-x-2 transition"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Lookup</span>}
            </button>
          </div>
        </form>
      </div>

      {/* Baseline Metric Explanation Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-start space-x-3 text-xs text-slate-300">
        <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-white">How Danish salary benchmarking works:</span> In Danish tech and engineering unions (IDA, Prosa), compensation is indexed against private-sector baselines (Index 100 = median market compensation for similar education and experience). An index of <strong>115.0</strong> indicates salaries are approximately <strong>+15.0% higher</strong> than standard industry baselines.
        </div>
      </div>

      {/* Results List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((item, idx) => (
          <div
            key={idx}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 shadow-sm space-y-4 transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center">
                  <Building className="w-4 h-4 mr-1.5 text-slate-400" />
                  {item.company}
                </h3>
                {item.city && (
                  <p className="text-xs text-slate-400 flex items-center mt-0.5">
                    <MapPin className="w-3 h-3 mr-1 text-slate-500" />
                    {item.city}
                  </p>
                )}
              </div>

              {item.diffFromBaseline !== undefined && (
                <div
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono border flex items-center ${
                    item.diffFromBaseline >= 0
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  }`}
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {item.diffFromBaseline >= 0 ? `+${item.diffFromBaseline}%` : `${item.diffFromBaseline}%`}
                </div>
              )}
            </div>

            {/* Categories Table */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <div className="flex justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider pb-1">
                <span>Category</span>
                <div className="flex space-x-6">
                  <span>Count</span>
                  <span>Index</span>
                </div>
              </div>

              {Object.entries(item.categories || {}).map(([catKey, catData], cIdx) => (
                <div
                  key={cIdx}
                  className="flex items-center justify-between text-xs py-1 border-b border-slate-800/40 last:border-b-0"
                >
                  <span className="text-slate-200 capitalize font-medium">
                    {catKey.replace(/_/g, ' ')}
                  </span>
                  <div className="flex items-center space-x-6 text-slate-300 font-mono text-[11px]">
                    <span className="text-slate-400">{catData.count || '—'}</span>
                    <span className="font-semibold text-white">
                      {typeof catData.index === 'number' ? catData.index.toFixed(1) : catData.index || '—'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {results.length === 0 && !loading && (
          <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-sm">
            No matching companies found for &ldquo;{query}&rdquo;. Check spelling or try a partial company name.
          </div>
        )}
      </div>

      {/* JSON Editor Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Edit Salary Benchmark Dataset (JSON)</h3>
              <button onClick={() => setIsImportModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Paste or modify the salary JSON file matching the structure described in <code>tools/README_SALARY_TOOL.md</code>.
            </p>

            <textarea
              rows={14}
              value={rawJsonInput}
              onChange={(e) => setRawJsonInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-emerald-300 font-mono text-xs p-3 rounded-lg focus:outline-none"
            />

            {importStatus && (
              <div className="text-xs font-semibold text-indigo-300 bg-indigo-950/40 p-2 rounded border border-indigo-500/30">
                {importStatus}
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
              >
                Close
              </button>
              <button
                onClick={handleSaveJson}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold"
              >
                Save Dataset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
