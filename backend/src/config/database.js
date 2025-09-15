import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // Check if MongoDB URI is provided
    if (!process.env.MONGODB_URI) {
      console.log('⚠️  No MongoDB URI found in environment variables');
      console.log('⚠️  Server will run without database connection');
      console.log('⚠️  To enable database: uncomment MONGODB_URI in .env file');
      return null;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`📦 MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.log('⚠️  Server will continue without database connection');
    return null;
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('📦 MongoDB connection closed.');
  process.exit(0);
});