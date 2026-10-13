import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { searchPortals } from './src/server/portals.js';
import { getProfile, saveProfile } from './src/server/candidateData.js';
import { evaluateJob } from './src/server/evaluator.js';
import { getApplications, saveApplications } from './src/server/applicationsData.js';
import { searchCompanySalary, loadSalaryData, saveSalaryData } from './src/server/salaryLookup.js';
import { draftApplication } from './src/server/drafter.js';
import { generateInterviewPrep } from './src/server/interviewCoach.js';
import { Application, PortalType } from './src/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Static assets (like assets/mascot)
app.use('/assets', express.static(path.resolve(__dirname, 'assets')));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Portals Job Search
app.get('/api/portals/search', async (req, res) => {
  try {
    const query = (req.query.q as string) || '';
    const portal = (req.query.portal as PortalType | 'all') || 'all';
    const location = (req.query.location as string) || '';
    const sort = (req.query.sort as 'score' | 'date') || 'score';
    const page = parseInt((req.query.page as string) || '1', 10);

    const result = await searchPortals({
      query,
      portal,
      location,
      sort,
      page,
    });

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error searching portals' });
  }
});

// Candidate Profile
app.get('/api/profile', (req, res) => {
  try {
    const profile = getProfile();
    res.json(profile);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/profile', (req, res) => {
  try {
    const profile = req.body;
    saveProfile(profile);
    res.json({ success: true, profile });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Job Evaluation
app.post('/api/evaluate', (req, res) => {
  try {
    const { job, profile } = req.body;
    const currentProfile = profile || getProfile();
    const evaluation = evaluateJob(job, currentProfile);
    res.json(evaluation);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Applications Tracker CRUD
app.get('/api/applications', (req, res) => {
  try {
    const apps = getApplications();
    res.json(apps);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/applications', (req, res) => {
  try {
    const appData = req.body as Application;
    const apps = getApplications();
    const existingIndex = apps.findIndex((a) => a.id === appData.id);

    if (existingIndex >= 0) {
      apps[existingIndex] = { ...appData, updatedAt: new Date().toISOString() };
    } else {
      apps.unshift({
        ...appData,
        id: appData.id || `app-${Date.now()}`,
        updatedAt: new Date().toISOString(),
      });
    }

    saveApplications(apps);
    res.json({ success: true, applications: apps });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/applications/:id', (req, res) => {
  try {
    const id = req.params.id;
    const apps = getApplications();
    const filtered = apps.filter((a) => a.id !== id);
    saveApplications(filtered);
    res.json({ success: true, applications: filtered });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Salary Benchmarks
app.get('/api/salary/lookup', (req, res) => {
  try {
    const query = (req.query.q as string) || '';
    const city = (req.query.city as string) || undefined;
    const results = searchCompanySalary(query, city);
    res.json(results);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/salary/all', (req, res) => {
  try {
    const data = loadSalaryData();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/salary/save', (req, res) => {
  try {
    const data = req.body;
    saveSalaryData(data);
    res.json({ success: true, count: data.companies?.length || 0 });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Tailoring & Drafting
app.post('/api/tailor', (req, res) => {
  try {
    const { job, profile, tone } = req.body;
    const currentProfile = profile || getProfile();
    const result = draftApplication(job, currentProfile, tone);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Interview & Upskilling
app.post('/api/interview', (req, res) => {
  try {
    const { role, company, profile } = req.body;
    const currentProfile = profile || getProfile();
    const result = generateInterviewPrep(role || 'Senior Software Engineer', company || 'Target Company', currentProfile);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Server boot with Vite middleware
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Job Search GUI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
