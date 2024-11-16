import mongoose from "mongoose";

export const dbConnect = async () => {
  mongoose.connect(process.env.MONGO_URI as string).then(() => {
    console.log("DB Connected");
  }).catch((err) => {
    console.log("DB Connection Error", err);
  });
};
