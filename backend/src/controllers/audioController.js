import audioGuides from '../data/audioGuides.js';

export const listAudioGuides = (req, res) => {
  res.json(audioGuides);
};

export const getAudioGuide = (req, res) => {
  const item = audioGuides.find(a => a.id === req.params.id);
  if (!item) return res.status(404).json({ message: 'Audio guide not found' });
  res.json(item);
};
