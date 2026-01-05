import mongoose from 'mongoose';

const connectDb = async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI not defined! Check your .env file");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDb;
