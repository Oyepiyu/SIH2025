import Joi from 'joi';

// Monastery validation schema
export const validateMonastery = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().trim().min(2).max(100),
    description: Joi.string().required().min(10).max(2000),
    shortDescription: Joi.string().required().min(10).max(200),
    location: Joi.object({
      coordinates: Joi.array().items(Joi.number()).length(2).required(),
      address: Joi.string().allow(''),
      district: Joi.string().allow(''),
      state: Joi.string().default('Sikkim')
    }).required(),
    images: Joi.array().items(
      Joi.object({
        url: Joi.string().uri(),
        caption: Joi.string().allow(''),
        isMain: Joi.boolean().default(false)
      })
    ),
    history: Joi.object({
      foundedYear: Joi.number().integer().min(1).max(new Date().getFullYear()),
      founder: Joi.string().allow(''),
      historicalSignificance: Joi.string().allow('')
    }),
    architecture: Joi.object({
      style: Joi.string().allow(''),
      features: Joi.array().items(Joi.string()),
      materials: Joi.array().items(Joi.string())
    }),
    spiritualSignificance: Joi.object({
      sect: Joi.string().allow(''),
      mainDeity: Joi.string().allow(''),
      festivals: Joi.array().items(Joi.string()),
      rituals: Joi.array().items(Joi.string())
    }),
    visitInfo: Joi.object({
      openingHours: Joi.object({
        monday: Joi.string().allow(''),
        tuesday: Joi.string().allow(''),
        wednesday: Joi.string().allow(''),
        thursday: Joi.string().allow(''),
        friday: Joi.string().allow(''),
        saturday: Joi.string().allow(''),
        sunday: Joi.string().allow('')
      }),
      entryFee: Joi.object({
        indian: Joi.number().min(0),
        foreign: Joi.number().min(0),
        currency: Joi.string().default('INR')
      }),
      bestTimeToVisit: Joi.string().allow(''),
      accessibility: Joi.string().allow('')
    }),
    amenities: Joi.array().items(Joi.string()),
    tags: Joi.array().items(Joi.string()),
    status: Joi.string().valid('active', 'inactive', 'under_construction').default('active')
  });

  return schema.validate(data);
};

// Contact form validation
export const validateContact = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().trim().min(2).max(50),
    email: Joi.string().required().email(),
    message: Joi.string().required().min(10).max(1000),
    subject: Joi.string().allow('').max(100),
    phone: Joi.string().allow('').pattern(/^[0-9\-\+\s\(\)]+$/),
    category: Joi.string().valid('general', 'technical', 'feedback', 'complaint', 'suggestion').default('general')
  });

  return schema.validate(data);
};

// User registration validation
export const validateUser = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().trim().min(2).max(50),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6).max(50),
    role: Joi.string().valid('user', 'guide', 'admin').default('user')
  });

  return schema.validate(data);
};

// Audio guide validation
export const validateAudioGuide = (data) => {
  const schema = Joi.object({
    title: Joi.string().required().trim().min(5).max(100),
    description: Joi.string().allow('').max(500),
    monastery: Joi.string().pattern(/^[0-9a-fA-F]{24}$/), // MongoDB ObjectId
    language: Joi.string().required().default('en'),
    category: Joi.string().valid('general', 'history', 'architecture', 'spiritual', 'location-based').default('general'),
    audioFile: Joi.object({
      url: Joi.string().uri(),
      duration: Joi.number().positive(),
      fileSize: Joi.number().positive(),
      format: Joi.string()
    }),
    transcript: Joi.string().allow(''),
    location: Joi.object({
      coordinates: Joi.array().items(Joi.number()).length(2),
      radius: Joi.number().positive()
    }),
    tags: Joi.array().items(Joi.string())
  });

  return schema.validate(data);
};

// Virtual tour validation
export const validateVirtualTour = (data) => {
  const schema = Joi.object({
    monastery: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/),
    title: Joi.string().required().trim().min(5).max(100),
    description: Joi.string().allow('').max(500),
    defaultScene: Joi.string().required(),
    duration: Joi.number().positive(),
    difficulty: Joi.string().valid('easy', 'medium', 'hard').default('easy'),
    scenes: Joi.array().items(
      Joi.object({
        id: Joi.string().required(),
        title: Joi.string().allow(''),
        image: Joi.string().uri(),
        info: Joi.string().allow(''),
        position: Joi.object({
          x: Joi.number(),
          y: Joi.number(),
          z: Joi.number()
        }),
        hotspots: Joi.array().items(
          Joi.object({
            id: Joi.string(),
            icon: Joi.string(),
            position: Joi.string(),
            scale: Joi.string(),
            target: Joi.string(),
            tooltip: Joi.string().allow('')
          })
        )
      })
    ).min(1)
  });

  return schema.validate(data);
};