import places from '../data/places.js';
import tours from '../data/tours.js';
import audioGuides from '../data/audioGuides.js';
import manuscripts from '../data/manuscripts.js';

const limitResult = (arr, limit = 10) => arr.slice(0, limit);

export const searchAll = (req, res) => {
  const { q = '', type = 'all' } = req.query;
  const term = q.toLowerCase();
  if (!term) return res.json({ query: q, results: [] });

  const match = (text) => text.toLowerCase().includes(term);
  const result = {};

  if (type === 'all' || type === 'places') {
    result.places = limitResult(places.filter(p => match(p.name) || match(p.description)));
  }
  if (type === 'all' || type === 'tours') {
    result.tours = limitResult(tours.filter(t => match(t.title)));
  }
    if (type === 'all' || type === 'audio') {
    result.audioGuides = limitResult(audioGuides.filter(a => match(a.title) || match(a.language)));
  }
  if (type === 'all' || type === 'manuscripts') {
    result.manuscripts = limitResult(manuscripts.filter(m => match(m.title) || match(m.summary)));
  }
  res.json({ query: q, type, results: result });
};
