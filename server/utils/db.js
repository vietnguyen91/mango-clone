import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    const { connection } = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mango-clone');

    isConnected = connection.readyState === 1;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

export default connectDB;