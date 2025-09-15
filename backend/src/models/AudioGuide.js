import mongoose from 'mongoose';

const audioGuideSchema = new mongoose.Schema({
  monastery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Monastery'
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  audioFile: {
    url: String,
    duration: Number, // in seconds
    fileSize: Number, // in bytes
    format: String // mp3, wav, etc.
  },
  transcript: String,
  language: {
    type: String,
    required: true,
    default: 'en'
  },
  category: {
    type: String,
    enum: ['general', 'history', 'architecture', 'spiritual', 'location-based'],
    default: 'general'
  },
  location: {
    coordinates: [Number], // for location-based audio
    radius: Number // activation radius in meters
  },
  triggers: [{
    type: {
      type: String,
      enum: ['location', 'image_recognition', 'qr_code', 'manual'],
      default: 'manual'
    },
    value: String,
    threshold: Number
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  playCount: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  tags: [String]
}, {
  timestamps: true
});

// Text search index
audioGuideSchema.index({
  title: 'text',
  description: 'text',
  transcript: 'text',
  tags: 'text'
});

export default mongoose.model('AudioGuide', audioGuideSchema);