import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.js';
import { PortalSearchTab } from './components/PortalSearchTab.js';
import { EvaluatorTab } from './components/EvaluatorTab.js';
import { PipelineTab } from './components/PipelineTab.js';
import { DrafterTab } from './components/DrafterTab.js';
import { SalaryTab } from './components/SalaryTab.js';
import { ProfileTab } from './components/ProfileTab.js';
import { InterviewTab } from './components/InterviewTab.js';
import { CandidateProfile, Application, JobCard } from './types.js';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('search');
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedJobForEval, setSelectedJobForEval] = useState<JobCard | null>(null);
  const [selectedJobForDraft, setSelectedJobForDraft] = useState<{
    title: string;
    company: string;
    location?: string;
    description?: string;
  } | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Initial data loading
  useEffect(() => {
    fetch('/api/profile')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setProfile(data);
      })
      .catch((err) => console.error('Error fetching profile:', err));

    fetch('/api/applications')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setApplications(data);
      })
      .catch((err) => console.error('Error fetching applications:', err));
  }, []);

  const handleSelectForEvaluation = (job: JobCard) => {
    setSelectedJobForEval(job);
    setActiveTab('evaluate');
  };

  const handleAddToPipeline = async (job: JobCard) => {
    const newApp: Application = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      location: job.location,
      portal: job.portal,
      url: job.url,
      status: 'saved',
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newApp),
      });
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || [newApp, ...applications]);
        showToast(`Added ${job.company} to applications pipeline!`);
      }
    } catch (err) {
      console.error('Error adding to pipeline:', err);
    }
  };

  const handleAddToPipelineWithScore = async (
    jobData: { title: string; company: string; location?: string; url?: string },
    score: number
  ) => {
    const newApp: Application = {
      id: `app-${Date.now()}`,
      jobTitle: jobData.title,
      company: jobData.company,
      location: jobData.location || 'Denmark',
      portal: 'direct',
      url: jobData.url || '',
      status: 'saved',
      fitScore: score,
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newApp),
      });
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || [newApp, ...applications]);
        showToast(`Saved ${jobData.company} (${score}% match) to pipeline!`);
      }
    } catch (err) {
      console.error('Error saving with score:', err);
    }
  };

  const handleUpdateApplication = async (app: Application) => {
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(app),
      });
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || applications);
        showToast(`Updated application for ${app.company}`);
      }
    } catch (err) {
      console.error('Error updating application:', err);
    }
  };

  const handleDeleteApplication = async (id: string) => {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || applications.filter((a) => a.id !== id));
        showToast('Application deleted');
      }
    } catch (err) {
      console.error('Error deleting application:', err);
    }
  };

  const handleDraftApplication = (jobData: {
    title: string;
    company: string;
    location?: string;
    description?: string;
  }) => {
    setSelectedJobForDraft(jobData);
    setActiveTab('drafter');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        applications={applications}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'search' && (
          <PortalSearchTab
            onSelectForEvaluation={handleSelectForEvaluation}
            onAddToPipeline={handleAddToPipeline}
            applications={applications}
          />
        )}

        {activeTab === 'evaluate' && (
          <EvaluatorTab
            initialJob={selectedJobForEval}
            profile={profile}
            onDraftApplication={handleDraftApplication}
            onAddToPipelineWithScore={handleAddToPipelineWithScore}
          />
        )}

        {activeTab === 'pipeline' && (
          <PipelineTab
            applications={applications}
            onUpdateApplication={handleUpdateApplication}
            onDeleteApplication={handleDeleteApplication}
            onDraftApplication={handleDraftApplication}
          />
        )}

        {activeTab === 'drafter' && (
          <DrafterTab
            initialJobData={selectedJobForDraft}
            profile={profile}
          />
        )}

        {activeTab === 'salary' && <SalaryTab />}

        {activeTab === 'interview' && (
          <InterviewTab
            initialJobData={selectedJobForDraft || selectedJobForEval}
            profile={profile}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileTab
            profile={profile}
            onUpdateProfile={(updated) => {
              setProfile(updated);
              showToast('Candidate profile updated and saved!');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-300">AI Job Search GUI</span>
            <span>•</span>
            <span>Portals: Jobindex, Jobnet, Akademikernes Jobbank, Jobdanmark, LinkedIn, Freehire</span>
          </div>
          <div className="text-slate-400">
            Danish &amp; International Job Hunting Workflow Framework
          </div>
        </div>
      </footer>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-indigo-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg border border-indigo-400/30 flex items-center space-x-2 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;
