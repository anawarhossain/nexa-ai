import mongoose from "mongoose";
import { env } from "./env";

let isConnected = false;

export async function connectDB(): Promise<typeof mongoose> {
  if (isConnected) return mongoose;

  try {
    await mongoose.connect(env.MONGO_URI);
    isConnected = true;
    console.log(`✅ MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
    return mongoose;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
}

/**
 * Better Auth এর mongodbAdapter কে raw MongoClient/Db দরকার হয়।
 * Mongoose কানেকশন থেকেই সেই client বের করে দেওয়া হচ্ছে,
 * আলাদা করে দ্বিতীয় কানেকশন খোলার দরকার নেই।
 */
export function getMongoClient() {
  if (!isConnected) {
    throw new Error("❌ getMongoClient() called before connectDB(). Call connectDB() first.");
  }
  return mongoose.connection.getClient();
}
