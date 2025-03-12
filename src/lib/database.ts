import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) {
  throw new Error("Please define MONGO_URI in the environment variables");
}

const cached = (global as any).mongoose || { conn: null, promise: null };

export async function dbConnect() {
  if (cached.conn) return cached.conn; // Use existing connection

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_URI, {
        bufferCommands: false, // Prevent query buffering issues
      })
      .then((mongoose) => {
        console.log("MongoDB Connected");
        return mongoose;
      })
      .catch((err) => {
        console.error("MongoDB Connection Error:", err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  (global as any).mongoose = cached; // Store connection globally
  return cached.conn;
}
