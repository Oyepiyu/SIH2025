import manuscripts from '../data/manuscripts.js';
import { createJob, getJob } from '../utils/asyncJobs.js';

export const listManuscripts = (req, res) => {
  res.json(manuscripts);
};

export const getManuscript = (req, res) => {
  const item = manuscripts.find(m => m.id === req.params.id);
  if (!item) return res.status(404).json({ message: 'Manuscript not found' });
  res.json(item);
};

// Placeholder upload handler (no file storage implemented yet)
export const uploadManuscriptImage = (req, res) => {
  res.status(201).json({ message: 'Upload endpoint placeholder – integrate storage later.' });
};

export const requestTranslation = (req, res) => {
  const { targetLang = 'en' } = req.body || {};
  if (!targetLang) return res.status(400).json({ message: 'targetLang required' });
  const job = createJob('translate', { targetLang });
  res.status(202).json(job);
};

export const getTranslationJob = (req, res) => {
  const job = getJob(req.params.jobId);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  res.json(job);
};
