import mongoose from 'mongoose';

const manuscriptSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  images: [{
    url: String,
    page: Number,
    caption: String
  }],
  originalLanguage: {
    type: String,
    required: true
  },
  availableLanguages: [String],
  translations: [{
    language: String,
    text: String,
    translatedBy: String,
    translationDate: Date,
    confidence: Number // AI translation confidence score
  }],
  monastery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Monastery'
  },
  metadata: {
    author: String,
    approximateDate: String,
    script: String, // Tibetan, Lepcha, Devanagari, etc.
    material: String, // Palm leaf, paper, etc.
    condition: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor', 'critical']
    },
    pages: Number,
    dimensions: {
      width: Number,
      height: Number,
      unit: {
        type: String,
        default: 'cm'
      }
    }
  },
  digitization: {
    scanDate: Date,
    scannedBy: String,
    resolution: String, // DPI
    fileFormat: String,
    fileSize: Number // in bytes
  },
  category: {
    type: String,
    enum: ['religious', 'historical', 'literary', 'medicinal', 'administrative', 'other'],
    default: 'religious'
  },
  tags: [String],
  isPublic: {
    type: Boolean,
    default: true
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Text search index
manuscriptSchema.index({
  title: 'text',
  description: 'text',
  'translations.text': 'text',
  tags: 'text'
});

export default mongoose.model('Manuscript', manuscriptSchema);