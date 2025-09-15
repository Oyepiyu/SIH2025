// Simple test script to verify Smart Audio Guide functionality
// Run this from the backend directory with: node test-smart-audio.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './src/config/database.js';

dotenv.config();

const testSmartAudioGuide = async () => {
  console.log('🧪 Testing Smart Audio Guide functionality...\n');
  
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Database connected');
    
    // Import models
    const Monastery = (await import('./src/models/Monastery.js')).default;
    const AudioGuide = (await import('./src/models/AudioGuide.js')).default;
    
    // Test 1: Check if monasteries exist
    const monasteryCount = await Monastery.countDocuments({});
    console.log(`📊 Found ${monasteryCount} monasteries in database`);
    
    // Test 2: Check if audio guides exist  
    const audioGuideCount = await AudioGuide.countDocuments({});
    console.log(`🎧 Found ${audioGuideCount} audio guides in database`);
    
    // Test 3: Test geospatial query (mock user location in Gangtok)
    const gangtokLat = 27.3389;
    const gangtokLng = 88.6065;
    
    const nearbyMonasteries = await Monastery.find({
      "location.coordinates": {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [gangtokLng, gangtokLat]
          },
          $maxDistance: 50000 // 50km radius
        }
      }
    }).limit(3);
    
    console.log(`🗺️  Found ${nearbyMonasteries.length} monasteries near Gangtok:`);
    nearbyMonasteries.forEach((monastery, index) => {
      console.log(`   ${index + 1}. ${monastery.name}`);
    });
    
    console.log('\n✅ Smart Audio Guide backend is ready!');
    console.log('📱 You can now test the frontend features:');
    console.log('   • Image Upload: Upload monastery photos for recognition');
    console.log('   • Location Audio: Share location for nearby audio guides');
    console.log('   • Sample Audio: Uses /audio/rumtek-sample.mp3');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

testSmartAudioGuide();