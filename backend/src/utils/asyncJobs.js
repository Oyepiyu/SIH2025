// Very small in-memory async job simulation (e.g., for translation jobs)
const jobs = new Map();

export const createJob = (type, payload) => {
  const id = `${type}_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
  jobs.set(id, { id, type, status: 'queued', createdAt: Date.now(), payload });
  // Simulate async completion
  setTimeout(() => {
    const job = jobs.get(id);
    if (job) {
      job.status = 'completed';
      job.result = { translatedText: `Translated(${payload.targetLang}): Lorem ipsum placeholder.` };
      jobs.set(id, job);
    }
  }, 1200);
  return jobs.get(id);
};

export const getJob = (id) => jobs.get(id) || null;
