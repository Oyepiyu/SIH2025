import mongoose from 'mongoose';

const monasterySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true,
    maxLength: 200
  },
  location: {
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      index: '2dsphere'
    },
    address: String,
    district: String,
    state: {
      type: String,
      default: 'Sikkim'
    }
  },
  images: [{
    url: String,
    caption: String,
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  history: {
    foundedYear: Number,
    founder: String,
    historicalSignificance: String
  },
  architecture: {
    style: String,
    features: [String],
    materials: [String]
  },
  spiritualSignificance: {
    sect: String, // Kagyu, Nyingma, etc.
    mainDeity: String,
    festivals: [String],
    rituals: [String]
  },
  visitInfo: {
    openingHours: {
      monday: String,
      tuesday: String,
      wednesday: String,
      thursday: String,
      friday: String,
      saturday: String,
      sunday: String
    },
    entryFee: {
      indian: Number,
      foreign: Number,
      currency: {
        type: String,
        default: 'INR'
      }
    },
    bestTimeToVisit: String,
    accessibility: String
  },
  amenities: [String], // ['parking', 'restrooms', 'guides', 'photography']
  virtualTourAvailable: {
    type: Boolean,
    default: false
  },
  audioGuideAvailable: {
    type: Boolean,
    default: false
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
  tags: [String],
  status: {
    type: String,
    enum: ['active', 'inactive', 'under_construction'],
    default: 'active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Text search index
monasterySchema.index({
  name: 'text',
  description: 'text',
  shortDescription: 'text',
  tags: 'text'
});

// Virtual for main image
monasterySchema.virtual('mainImage').get(function() {
  if (!this.images || !Array.isArray(this.images) || this.images.length === 0) {
    return null;
  }
  const mainImg = this.images.find(img => img.isMain);
  return mainImg ? mainImg.url : (this.images[0] ? this.images[0].url : null);
});

// Ensure virtual fields are serialized
monasterySchema.set('toJSON', { virtuals: true });

export default mongoose.model('Monastery', monasterySchema);