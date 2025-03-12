import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI! as string;

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable");
}

// Global variable to track connection status
let isConnected: boolean = false;

export const dbConnect = async () => {
  if (isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(MONGO_URI, {
      bufferCommands: false, // Prevents command queuing in Mongoose
    });

    isConnected = db.connections[0].readyState === 1;
    console.log("DB Connected Successfully");
  } catch (error) {
    console.error("DB Connection Error:", error);
    throw new Error("Failed to connect to database");
  }
};
