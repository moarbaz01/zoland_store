import mongoose from "mongoose";

export const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("DB Connected");
  } catch (error) {
    console.log("DB Error", error);
  }
};

dbConnect();