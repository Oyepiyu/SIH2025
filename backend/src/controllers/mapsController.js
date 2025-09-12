import mapPoints from '../data/mapPoints.js';

export const getMapPoints = (req, res) => {
  res.json(mapPoints);
};
