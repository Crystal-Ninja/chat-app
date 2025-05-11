import express from "express";
import dotenv from"dotenv";
import {connectDB} from "./lib/db.js"
import cookieParser from "cookie-parser"

import authRoutes from "./route/auth.routes.js";
import messageRoutes from "./route/message.routes.js";

dotenv.config();
const PORT=5001;
const app=express();
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRoutes);
app.use("/api/message",messageRoutes);

app.listen(PORT,()=>{
    console.log("server running on PORT:"+PORT);
    connectDB("mongodb+srv://crystalninja0123:gPMZYaF0FEAnGTlB@cluster0.n7fhbie.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
})

