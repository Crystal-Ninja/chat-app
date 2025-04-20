import mongoose from "mongoose";
export const connectDB=async (connectionString) => {
    try {
        console.log("connectionString", connectionString);
        
        const conn =await mongoose.connect(connectionString);
        console.log(`mongoDB connected ${conn.connection.host}`);
    } catch (error) {
        console.log("mongo DB connection error",error);
    }
}