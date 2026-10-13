import React, { useState } from 'react';
import {
  Kanban,
  List,
  Plus,
  Trash2,
  ExternalLink,
  Calendar,
  Building,
  MapPin,
  Clock,
  Download,
  Edit2,
  CheckCircle2,
  X,
  FileText,
  BadgeDollarSign,
  ChevronRight,
} from 'lucide-react';
import { Application, ApplicationStatus, PortalType } from '../types.js';

interface PipelineTabProps {
  applications: Application[];
  onUpdateApplication: (app: Application) => void;
  onDeleteApplication: (id: string) => void;
  onDraftApplication: (jobData: { title: string; company: string; location?: string }) => void;
}

const STAGES: Array<{ id: ApplicationStatus; label: string; color: string; border: string }> = [
  { id: 'saved', label: 'Saved / Reviewing', color: 'bg-slate-500/10 text-slate-300', border: 'border-slate-700' },
  { id: 'tailoring', label: 'Drafting & Tailoring', color: 'bg-amber-500/10 text-amber-300', border: 'border-amber-500/30' },
  { id: 'applied', label: 'Applied', color: 'bg-blue-500/10 text-blue-300', border: 'border-blue-500/30' },
  { id: 'interviewing', label: 'Interviewing', color: 'bg-emerald-500/10 text-emerald-300', border: 'border-emerald-500/30' },
  { id: 'offer', label: 'Offer Received', color: 'bg-purple-500/10 text-purple-300', border: 'border-purple-500/30' },
  { id: 'rejected', label: 'Archived / Rejected', color: 'bg-rose-500/10 text-rose-300', border: 'border-rose-500/30' },
];

export const PipelineTab: React.FC<PipelineTabProps> = ({
  applications,
  onUpdateApplication,
  onDeleteApplication,
  onDraftApplication,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // New Application Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newLocation, setNewLocation] = useState('København, Denmark');
  const [newPortal, setNewPortal] = useState<PortalType | 'direct'>('direct');
  const [newUrl, setNewUrl] = useState('');
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('saved');
  const [newNotes, setNewNotes] = useState('');

  const handleCreateApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCompany) return;

    const newApp: Application = {
      id: `app-${Date.now()}`,
      jobTitle: newTitle,
      company: newCompany,
      location: newLocation,
      portal: newPortal,
      url: newUrl,
      status: newStatus,
      notes: newNotes,
      updatedAt: new Date().toISOString(),
    };

    onUpdateApplication(newApp);
    setIsNewModalOpen(false);
    setNewTitle('');
    setNewCompany('');
    setNewUrl('');
    setNewNotes('');
  };

  const handleStatusChange = (app: Application, newStatus: ApplicationStatus) => {
    onUpdateApplication({
      ...app,
      status: newStatus,
      appliedDate: newStatus === 'applied' && !app.appliedDate ? new Date().toISOString().split('T')[0] : app.appliedDate,
    });
  };

  const handleExportCsv = () => {
    const headers = ['Company', 'Job Title', 'Location', 'Status', 'Portal', 'Applied Date', 'Interview Date', 'Salary Min', 'Salary Max', 'URL', 'Notes'];
    const rows = applications.map((a) => [
      `"${a.company.replace(/"/g, '""')}"`,
      `"${a.jobTitle.replace(/"/g, '""')}"`,
      `"${a.location.replace(/"/g, '""')}"`,
      `"${a.status}"`,
      `"${a.portal}"`,
      `"${a.appliedDate || ''}"`,
      `"${a.interviewDate || ''}"`,
      `"${a.salaryMin || ''}"`,
      `"${a.salaryMax || ''}"`,
      `"${(a.url || '').replace(/"/g, '""')}"`,
      `"${(a.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `job_applications_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center">
            <Kanban className="w-5 h-5 mr-2 text-indigo-400" />
            Application Pipeline
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Track status, interview schedules, follow-up deadlines, and salary negotiation notes.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* View Mode Toggle */}
          <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700/60">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition ${
                viewMode === 'kanban' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Kanban className="w-3.5 h-3.5 inline mr-1" />
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition ${
                viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5 inline mr-1" />
              List
            </button>
          </div>

          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsNewModalOpen(true)}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Application</span>
          </button>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 items-start">
          {STAGES.map((stage) => {
            const stageApps = applications.filter((a) => a.status === stage.id);
            return (
              <div
                key={stage.id}
                className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 min-h-[500px] flex flex-col"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-bold text-slate-200">{stage.label}</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400 text-[10px] font-mono">
                      {stageApps.length}
                    </span>
                  </div>
                </div>

                {/* Cards Container */}
                <div className="space-y-2.5 flex-1 overflow-y-auto">
                  {stageApps.map((app) => (
                    <div
                      key={app.id}
                      className="bg-slate-800/90 border border-slate-700/70 hover:border-indigo-500/50 rounded-lg p-3 text-xs shadow-sm transition space-y-2 group"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className="font-bold text-white text-xs line-clamp-1 group-hover:text-indigo-300">
                          {app.jobTitle}
                        </span>
                        {app.fitScore && (
                          <span className="px-1.5 py-0.2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded text-[10px] font-mono font-semibold">
                            {app.fitScore}%
                          </span>
                        )}
                      </div>

                      <div className="text-slate-300 flex items-center font-medium">
                        <Building className="w-3 h-3 mr-1 text-slate-400" />
                        <span className="truncate">{app.company}</span>
                      </div>

                      <div className="text-slate-400 text-[11px] flex items-center">
                        <MapPin className="w-3 h-3 mr-1 text-slate-500" />
                        <span className="truncate">{app.location}</span>
                      </div>

                      {app.interviewDate && (
                        <div className="flex items-center text-emerald-400 text-[11px] font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                          <Calendar className="w-3 h-3 mr-1" />
                          Interview: {app.interviewDate}
                        </div>
                      )}

                      {app.notes && (
                        <p className="text-slate-400 text-[11px] line-clamp-2 bg-slate-900/60 p-1.5 rounded border border-slate-800">
                          {app.notes}
                        </p>
                      )}

                      {/* Stage Selector Dropdown */}
                      <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app, e.target.value as ApplicationStatus)}
                          className="bg-slate-900 border border-slate-700 text-slate-300 text-[11px] rounded px-1.5 py-1 focus:outline-none"
                        >
                          {STAGES.map((s) => (
                            <option key={s.id} value={s.id}>
                              Move to: {s.label}
                            </option>
                          ))}
                        </select>

                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => setEditingApp(app)}
                            className="p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-700"
                            title="Edit notes and details"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => onDeleteApplication(app.id)}
                            className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-700"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {stageApps.length === 0 && (
                    <div className="h-24 border border-dashed border-slate-800 rounded-lg flex items-center justify-center text-[11px] text-slate-600">
                      Empty stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List / Table View */
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Job Title & Company</th>
                <th className="p-3">Status</th>
                <th className="p-3">Location</th>
                <th className="p-3">Fit</th>
                <th className="p-3">Applied / Interview</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3">
                    <div className="font-semibold text-white text-sm">{app.jobTitle}</div>
                    <div className="text-slate-400 flex items-center mt-0.5">
                      <Building className="w-3 h-3 mr-1 text-slate-500" />
                      {app.company}
                      {app.url && (
                        <a
                          href={app.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-indigo-400 hover:underline inline-flex items-center"
                        >
                          Link <ExternalLink className="w-3 h-3 ml-0.5" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app, e.target.value as ApplicationStatus)}
                      className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded px-2 py-1 font-medium focus:outline-none"
                    >
                      {STAGES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3 text-slate-400">{app.location}</td>
                  <td className="p-3">
                    {app.fitScore ? (
                      <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 font-semibold font-mono text-[11px]">
                        {app.fitScore}%
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="p-3 text-slate-400">
                    {app.interviewDate ? (
                      <span className="text-emerald-400 font-semibold">Int: {app.interviewDate}</span>
                    ) : app.appliedDate ? (
                      <span>Sub: {app.appliedDate}</span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="p-3 text-right space-x-1.5">
                    <button
                      onClick={() =>
                        onDraftApplication({
                          title: app.jobTitle,
                          company: app.company,
                          location: app.location,
                        })
                      }
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs transition"
                    >
                      Draft
                    </button>
                    <button
                      onClick={() => setEditingApp(app)}
                      className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteApplication(app.id)}
                      className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Details Modal */}
      {editingApp && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Edit Tracking Details: {editingApp.company}</h3>
              <button onClick={() => setEditingApp(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Interview Date (if scheduled)</label>
                <input
                  type="date"
                  value={editingApp.interviewDate || ''}
                  onChange={(e) => setEditingApp({ ...editingApp, interviewDate: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2 rounded focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Follow-up Reminder Date</label>
                <input
                  type="date"
                  value={editingApp.followUpDate || ''}
                  onChange={(e) => setEditingApp({ ...editingApp, followUpDate: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2 rounded focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Contact Person / Recruiter</label>
                <input
                  type="text"
                  placeholder="e.g. Mette Hansen, Lead Recruiter"
                  value={editingApp.contactPerson || ''}
                  onChange={(e) => setEditingApp({ ...editingApp, contactPerson: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2 rounded focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Application Notes / Reflections</label>
                <textarea
                  rows={4}
                  value={editingApp.notes || ''}
                  onChange={(e) => setEditingApp({ ...editingApp, notes: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2 rounded focus:outline-none"
                  placeholder="Interview questions asked, salary discussed, follow-up items..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setEditingApp(null)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onUpdateApplication(editingApp);
                  setEditingApp(null);
                }}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold"
              >
                Save Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Application Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateApplication}
            className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-5 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Add Application to Pipeline</h3>
              <button type="button" onClick={() => setIsNewModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lead Fullstack Engineer"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2 rounded focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Danske Bank A/S"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2 rounded focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2 rounded focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Initial Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2 rounded focus:outline-none"
                  >
                    {STAGES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Job Posting URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2 rounded focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Notes</label>
                <textarea
                  rows={2}
                  placeholder="Initial observations or source..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2 rounded focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsNewModalOpen(false)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold"
              >
                Add Application
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
