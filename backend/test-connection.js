import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
    try {
        console.log('🔗 Testing MongoDB connection...');
        console.log('📋 Connection URI:', process.env.MONGODB_URI?.replace(/:[^:@]*@/, ':***@')); // Hide password
        
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected Successfully!');
        
        // Test database access
        const db = mongoose.connection.db;
        console.log('📊 Database Name:', db.databaseName);
        
        // Test insert
        console.log('📝 Testing document insertion...');
        const testCollection = db.collection('test');
        const insertResult = await testCollection.insertOne({
            name: 'Test Document',
            timestamp: new Date(),
            test: true
        });
        
        console.log('✅ Test document inserted:', insertResult.insertedId);
        
        // Clean up test document
        await testCollection.deleteOne({ _id: insertResult.insertedId });
        console.log('🧹 Test document cleaned up');
        
        // List collections
        const collections = await db.listCollections().toArray();
        console.log('📁 Existing collections:', collections.map(c => c.name));
        
        // Check data in collections
        for (const collection of collections) {
            if (collection.name !== 'test') {
                const count = await db.collection(collection.name).countDocuments();
                console.log(`📊 Collection '${collection.name}': ${count} documents`);
                
                if (count > 0) {
                    const sample = await db.collection(collection.name).findOne();
                    console.log(`📄 Sample document from '${collection.name}':`, JSON.stringify(sample, null, 2));
                }
            }
        }
        
        await mongoose.disconnect();
        console.log('✅ Connection test completed successfully!');
        
    } catch (error) {
        console.error('❌ Connection test failed:');
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        console.error('Error stack:', error.stack);
    }
}

testConnection();