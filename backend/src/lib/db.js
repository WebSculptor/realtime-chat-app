import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("[DATABASE CONNECTION SUCCESS ✅]");
  } catch (err) {
    console.log("[DATABASE CONNECTION ERROR ❌]", err);
  }
};
