import mongoose from "mongoose";

const connectDB = async()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log(`MongoDB Connected || Host: ${connectionInstance.connection.host}`.green.bold);
    } catch (error) {
        console.log("MongoDB Connection Failed :".red.bold,error);
    }
}

export default connectDB;