import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/database.js';

// Import models
import Monastery from '../models/Monastery.js';
import VirtualTour from '../models/VirtualTour.js';
import AudioGuide from '../models/AudioGuide.js';
import Manuscript from '../models/Manuscript.js';

dotenv.config();

const sampleMonasteries = [
  {
    name: "Rumtek Monastery",
    description: "Rumtek Monastery is a gompa located in the Indian state of Sikkim near the capital Gangtok. It is the seat-in-exile of the Gyalwang Karmapa, inaugurated in 1966 by the 16th Karmapa. Built in the 1960s, it is also known as the Dharmachakra Centre.",
    shortDescription: "Known as the Dharma Chakra Centre, one of the largest monasteries in Sikkim.",
    location: {
      coordinates: [88.6115, 27.3256],
      address: "Rumtek, Sikkim",
      district: "East Sikkim",
      state: "Sikkim"
    },
    images: [
      {
        url: "/rumtek-assets/rumtek1.jpg",
        caption: "Main entrance of Rumtek Monastery",
        isMain: true
      },
      {
        url: "/rumtek-assets/rumtek2.jpg",
        caption: "Prayer hall interior"
      }
    ],
    history: {
      foundedYear: 1966,
      founder: "16th Karmapa",
      historicalSignificance: "Seat-in-exile of the Gyalwang Karmapa"
    },
    architecture: {
      style: "Tibetan",
      features: ["Golden stupa", "Prayer wheels", "Intricate murals", "Traditional Tibetan architecture"],
      materials: ["Stone", "Wood", "Gold plating"]
    },
    spiritualSignificance: {
      sect: "Kagyu",
      mainDeity: "Buddha",
      festivals: ["Losar", "Buddha Purnima", "Cham Dance Festival"],
      rituals: ["Daily prayers", "Butter lamp offerings", "Chanting sessions"]
    },
    visitInfo: {
      openingHours: {
        monday: "6:00 AM - 6:00 PM",
        tuesday: "6:00 AM - 6:00 PM",
        wednesday: "6:00 AM - 6:00 PM",
        thursday: "6:00 AM - 6:00 PM",
        friday: "6:00 AM - 6:00 PM",
        saturday: "6:00 AM - 6:00 PM",
        sunday: "6:00 AM - 6:00 PM"
      },
      entryFee: {
        indian: 0,
        foreign: 0,
        currency: "INR"
      },
      bestTimeToVisit: "March to June and September to December",
      accessibility: "Moderate - some stairs and uneven paths"
    },
    amenities: ["parking", "restrooms", "guides", "photography", "gift_shop"],
    virtualTourAvailable: true,
    audioGuideAvailable: true,
    rating: {
      average: 4.7,
      count: 156
    },
    tags: ["Buddhism", "Tibetan", "Kagyu", "Historical", "Cultural", "Pilgrimage"],
    status: "active"
  },
  {
    name: "Pemayangtse Monastery",
    description: "Pemayangtse Monastery is a Buddhist monastery in Pelling in the northeastern Indian state of Sikkim, intended for monks of pure Tibetan lineage. It was built for the Nyingma order of Tibetan Buddhism.",
    shortDescription: "A 300-year-old monastery overlooking the majestic Kanchenjunga ranges.",
    location: {
      coordinates: [88.2394, 27.3171],
      address: "Pelling, West Sikkim",
      district: "West Sikkim",
      state: "Sikkim"
    },
    images: [
      {
        url: "/assets/monastery2.jpg",
        caption: "Pemayangtse Monastery with mountain backdrop",
        isMain: true
      }
    ],
    history: {
      foundedYear: 1705,
      founder: "Lama Lhatsun Chempo",
      historicalSignificance: "One of the oldest and premier monasteries of Sikkim"
    },
    spiritualSignificance: {
      sect: "Nyingma",
      mainDeity: "Guru Padmasambhava",
      festivals: ["Cham Dance", "Pang Lhabsol"]
    },
    virtualTourAvailable: false,
    audioGuideAvailable: false,
    rating: {
      average: 4.5,
      count: 89
    },
    tags: ["Buddhism", "Nyingma", "Historical", "Mountain_view", "Ancient"],
    status: "active"
  },
  {
    name: "Tashiding Monastery",
    description: "Tashiding Monastery is a Buddhist monastery of the Nyingma sect of Tibetan Buddhism in Western Sikkim, India. The monastery is located on top of the heart-shaped hill rising between the Rathong chu and the Rangeet River.",
    shortDescription: "Famed for its holy water ceremony and peaceful surroundings atop a hill.",
    location: {
      coordinates: [88.2813, 27.2885],
      address: "Tashiding, West Sikkim",
      district: "West Sikkim",
      state: "Sikkim"
    },
    images: [
      {
        url: "/assets/monastery3.jpg",
        caption: "Tashiding Monastery on hilltop",
        isMain: true
      }
    ],
    history: {
      foundedYear: 1717,
      founder: "Ngadak Sempa Chempo",
      historicalSignificance: "Sacred site for Bhumchu holy water ceremony"
    },
    spiritualSignificance: {
      sect: "Nyingma",
      mainDeity: "Guru Padmasambhava",
      festivals: ["Bhumchu", "Losar"],
      rituals: ["Holy water ceremony", "Prayer flag ceremonies"]
    },
    virtualTourAvailable: false,
    audioGuideAvailable: true,
    rating: {
      average: 4.3,
      count: 67
    },
    tags: ["Buddhism", "Nyingma", "Holy_water", "Pilgrimage", "Sacred"],
    status: "active"
  }
];

const sampleVirtualTour = {
  title: "Virtual Rumtek Monastery Experience",
  description: "Explore the magnificent Rumtek Monastery through immersive 360-degree virtual tour",
  scenes: [
    {
      id: "rumtek-entrance",
      title: "Rumtek Monastery Entrance",
      image: "/rumtek-assets/rumtek1.jpg",
      info: "Welcome to the entrance of Rumtek Monastery, one of the most important monasteries in Sikkim.",
      hotspots: [
        {
          id: "to-hall",
          icon: "/rumtek-assets/arrow-forward.svg",
          position: "2 1 -3",
          scale: "0.7 0.7 0.7",
          target: "rumtek-hall",
          tooltip: "Enter Main Hall"
        },
        {
          id: "to-courtyard",
          icon: "/rumtek-assets/arrow-forward.svg",
          position: "-2 1 -3",
          scale: "0.7 0.7 0.7",
          target: "rumtek-courtyard",
          tooltip: "Visit Courtyard"
        }
      ]
    },
    {
      id: "rumtek-hall",
      title: "Main Prayer Hall",
      image: "/rumtek-assets/rumtek2.jpg",
      info: "The main prayer hall of Rumtek Monastery is adorned with intricate murals and statues.",
      hotspots: [
        {
          id: "back-to-entrance",
          icon: "/rumtek-assets/arrow-forward.svg",
          position: "0 1 3",
          scale: "0.7 0.7 0.7",
          target: "rumtek-entrance",
          tooltip: "Back to Entrance"
        }
      ]
    },
    {
      id: "rumtek-courtyard",
      title: "Monastery Courtyard",
      image: "/rumtek-assets/rumtek3.jpg",
      info: "The courtyard of Rumtek Monastery is where festivals and gatherings are held.",
      hotspots: [
        {
          id: "back-to-entrance",
          icon: "/rumtek-assets/arrow-forward.svg",
          position: "1 1 2",
          scale: "0.7 0.7 0.7",
          target: "rumtek-entrance",
          tooltip: "Back to Entrance"
        }
      ]
    }
  ],
  defaultScene: "rumtek-entrance",
  isActive: true,
  duration: 15,
  difficulty: "easy"
};

const sampleAudioGuides = [
  {
    title: "History of Rumtek Monastery",
    description: "Learn about the fascinating history and spiritual significance of Rumtek Monastery",
    audioFile: {
      url: "/assets/rumtek2.mp3",
      duration: 180,
      fileSize: 2048000,
      format: "mp3"
    },
    transcript: "Welcome to Rumtek Monastery, also known as the Dharmachakra Centre...",
    language: "en",
    category: "history",
    isActive: true,
    tags: ["history", "buddhism", "tibet", "sikkim"]
  },
  {
    title: "रुमटेक मठ का इतिहास",
    description: "रुमटेक मठ के मनमोहक इतिहास और आध्यात्मिक महत्व के बारे में जानें",
    audioFile: {
      url: "/assets/rumtek_hindi.mp3",
      duration: 190,
      fileSize: 2150000,
      format: "mp3"
    },
    transcript: "रुमटेक मठ में आपका स्वागत है, जिसे धर्मचक्र केंद्र के नाम से भी जाना जाता है...",
    language: "hi",
    category: "history",
    isActive: true,
    tags: ["इतिहास", "बौद्ध धर्म", "तिब्बत", "सिक्किम"]
  }
];

const sampleManuscripts = [
  {
    title: "Namthar of Lhatsun Chenpo",
    description: "A spiritual biography chronicling the journey of Lhatsun Chenpo and the establishment of Dubdi Monastery.",
    images: [
      {
        url: "/assets/manuscript1.jpg",
        page: 1,
        caption: "Title page of the manuscript"
      }
    ],
    originalLanguage: "bo",
    availableLanguages: ["bo", "en"],
    translations: [
      {
        language: "en",
        text: "The life story of the great master Lhatsun Chenpo, who established Buddhism in Sikkim...",
        translatedBy: "Buddhist Scholar",
        translationDate: new Date(),
        confidence: 0.95
      }
    ],
    metadata: {
      author: "Unknown",
      approximateDate: "17th Century",
      script: "Tibetan",
      material: "Paper",
      condition: "good",
      pages: 45
    },
    category: "religious",
    tags: ["biography", "buddhism", "sikkim", "historical"],
    isPublic: true
  },
  {
    title: "Lepcha Manuscripts Collection",
    description: "Indigenous Rong-script texts capturing folklore, tribal myths, medicinal knowledge, and local governance.",
    images: [
      {
        url: "/assets/manuscript3.jpg",
        page: 1,
        caption: "Traditional Lepcha script"
      }
    ],
    originalLanguage: "lep",
    availableLanguages: ["lep", "en"],
    metadata: {
      author: "Various Lepcha Scholars",
      approximateDate: "18th-19th Century",
      script: "Lepcha",
      material: "Palm leaf",
      condition: "fair",
      pages: 120
    },
    category: "historical",
    tags: ["lepcha", "folklore", "traditional", "indigenous"],
    isPublic: true
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database (if not already connected)
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    
    // Check if data already exists
    const existingMonasteries = await Monastery.countDocuments();
    if (existingMonasteries > 0) {
      console.log('📊 Database already has data, skipping seeding...');
      return { success: true, message: 'Data already exists' };
    }
    
    // Clear existing data (for fresh start)
    await Monastery.deleteMany({});
    await VirtualTour.deleteMany({});
    await AudioGuide.deleteMany({});
    await Manuscript.deleteMany({});
    
    console.log('🗑️  Cleared existing data');
    
    // Insert monasteries
    console.log('🏛️  Inserting monasteries...');
    const monasteries = await Monastery.insertMany(sampleMonasteries);
    console.log(`✅ Created ${monasteries.length} monasteries`);
    
    // Insert virtual tour for Rumtek
    const rumtekMonastery = monasteries.find(m => m.name === 'Rumtek Monastery');
    if (rumtekMonastery) {
      sampleVirtualTour.monastery = rumtekMonastery._id;
      const virtualTour = await VirtualTour.create(sampleVirtualTour);
      console.log('✅ Created virtual tour for Rumtek Monastery');
    }
    
    // Insert audio guides
    console.log('🔊 Inserting audio guides...');
    const audioGuidesWithMonastery = sampleAudioGuides.map(guide => ({
      ...guide,
      monastery: rumtekMonastery._id
    }));
    const audioGuides = await AudioGuide.insertMany(audioGuidesWithMonastery);
    console.log(`✅ Created ${audioGuides.length} audio guides`);
    
    // Insert manuscripts
    console.log('📜 Inserting manuscripts...');
    const manuscriptsWithMonastery = sampleManuscripts.map(manuscript => ({
      ...manuscript,
      monastery: rumtekMonastery._id
    }));
    const manuscripts = await Manuscript.insertMany(manuscriptsWithMonastery);
    console.log(`✅ Created ${manuscripts.length} manuscripts`);
    
    console.log('🎉 Database seeding completed successfully!');
    
    // Display summary
    console.log('\n📊 Seeded Data Summary:');
    console.log(`- Monasteries: ${monasteries.length}`);
    console.log(`- Virtual Tours: 1`);
    console.log(`- Audio Guides: ${audioGuides.length}`);
    console.log(`- Manuscripts: ${manuscripts.length}`);
    
    return { 
      success: true, 
      data: { 
        monasteries: monasteries.length,
        virtualTours: 1,
        audioGuides: audioGuides.length,
        manuscripts: manuscripts.length
      }
    };
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

// Run seeder if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

export default seedDatabase;