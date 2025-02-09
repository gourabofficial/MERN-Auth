import mongoose from "mongoose";

const connectDB = async () => { 
  try {
    const connectionDB = await mongoose.connect(`${process.env.MONGODB_URI}/Mern-Auth`);
    console.log(`MongoDB connection successful ${connectionDB.connection.host}`);
  } catch (error) {
    console.log("MongoDB connection failed", error.message);
    
  }
}


export default connectDB;
