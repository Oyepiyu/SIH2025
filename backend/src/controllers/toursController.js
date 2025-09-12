import tours from '../data/tours.js';

export const listVirtualTours = (req, res) => {
  res.json(tours);
};

export const getVirtualTour = (req, res) => {
  const tour = tours.find(t => t.id === req.params.id);
  if (!tour) return res.status(404).json({ message: 'Virtual tour not found' });
  res.json(tour);
};
