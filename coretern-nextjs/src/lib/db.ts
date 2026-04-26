import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    throw new Error('Please define the MONGO_URI environment variable');
}

let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 15000,
            connectTimeoutMS: 15000,
            family: 4 // Force IPv4 to prevent ENOTFOUND on broken dual-stack networks
        };
        cached.promise = mongoose.connect(MONGO_URI!, opts).then((mongoose) => {
            console.log('MongoDB Connected...');
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        console.error('MongoDB connection failed:', (e as Error).message);
        throw e;
    }

    return cached.conn;
}

export default dbConnect;
