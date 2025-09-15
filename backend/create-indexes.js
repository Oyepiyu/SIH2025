// Create geospatial index for monasteries
// Run this script to set up the required indexes

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './src/config/database.js';

dotenv.config();

const createIndexes = async () => {
  try {
    await connectDB();
    console.log('✅ Connected to database');
    
    const db = mongoose.connection.db;
    const collection = db.collection('monasteries');
    
    // Create 2dsphere index on location.coordinates
    await collection.createIndex({ "location.coordinates": "2dsphere" });
    console.log('✅ Created 2dsphere index on location.coordinates');
    
    // List all indexes to verify
    const indexes = await collection.indexes();
    console.log('📋 Current indexes:');
    indexes.forEach(index => {
      console.log('  -', JSON.stringify(index.key));
    });
    
    console.log('\n🎉 Geospatial indexes created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating indexes:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

createIndexes();