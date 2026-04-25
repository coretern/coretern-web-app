import mongoose from 'mongoose';
import dns from 'dns';
import { Resolver } from 'dns';

// Force ALL DNS resolution through Google Public DNS
// This fixes ECONNREFUSED on networks that block SRV DNS lookups
const resolver = new Resolver();
resolver.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

// Override the global DNS resolver
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

// Also override dns.resolveSrv to use our custom resolver
const originalResolveSrv = dns.resolveSrv;
dns.resolveSrv = function (hostname: string, callback: any) {
    resolver.resolveSrv(hostname, callback);
} as typeof dns.resolveSrv;

// Override dns.resolveTxt too (used by mongodb+srv)
const originalResolveTxt = dns.resolveTxt;
dns.resolveTxt = function (hostname: string, callback: any) {
    resolver.resolveTxt(hostname, callback);
} as typeof dns.resolveTxt;

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
