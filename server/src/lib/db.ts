import dns from 'dns';
import mongoose from 'mongoose';
import { env } from '../config/env';

dns.setServers(['8.8.8.8', '8.8.4.4']);

export async function connectDB() {
    try {
        await mongoose.connect(env.MONGODB_URI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        throw err;
    }
}
