import mongoose from 'mongoose';
import dns from 'dns';

// Use Google Public DNS to resolve MongoDB Atlas SRV records
// (fixes ECONNREFUSED on networks that block SRV DNS lookups)
dns.setServers(['8.8.8.8', '8.8.4.4']);

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    throw new Error('Please define the MONGO_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 10000,  // 10s timeout instead of 30s default
            connectTimeoutMS: 10000,
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
