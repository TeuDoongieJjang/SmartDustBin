import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbURI = process.env.SB_DB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI.toString());
    console.log(`Connected to MongoDB`);
  } catch (error) {
    console.log(`Error Connection MongoDB: ${error}`);
  }
};

export default connectDB;