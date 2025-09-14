import mongoose from 'mongoose';

const virtualTourSchema = new mongoose.Schema({
  monastery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Monastery',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  scenes: [{
    id: {
      type: String,
      required: true
    },
    title: String,
    image: String, // 360-degree image URL
    info: String,
    position: {
      x: Number,
      y: Number,
      z: Number
    },
    hotspots: [{
      id: String,
      icon: String,
      position: String, // "x y z" format
      scale: String, // "x y z" format
      target: String, // target scene id
      tooltip: String
    }]
  }],
  defaultScene: String,
  isActive: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  duration: Number, // estimated duration in minutes
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy'
  }
}, {
  timestamps: true
});

export default mongoose.model('VirtualTour', virtualTourSchema);