import placesData from '../data/places.js';
import { v4 as uuid } from 'uuid';

// In-memory mutable copy for create operations
const places = [...placesData];

export const listPlaces = (req, res) => {
  const { category, q } = req.query;
  let filtered = [...places];
  if (category) filtered = filtered.filter(p => p.category === category);
  if (q) {
    const term = q.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term));
  }
  res.json(filtered);
};

export const getPlace = (req, res) => {
  const place = places.find(p => p.id === req.params.id);
  if (!place) return res.status(404).json({ message: 'Place not found' });
  res.json(place);
};

export const createPlace = (req, res) => {
  const { name, category, description, lat, lng } = req.body || {};
  if (!name || !category) return res.status(400).json({ message: 'name and category required' });
  const newPlace = {
    id: uuid(),
    name,
    category,
    shortDescription: description?.slice(0, 100) || '',
    description: description || '',
    images: [],
    location: { lat: Number(lat) || 0, lng: Number(lng) || 0 }
  };
  places.push(newPlace);
  res.status(201).json(newPlace);
};

