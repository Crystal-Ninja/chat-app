import express from "express";
import dotenv from"dotenv";
import {connectDB} from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./route/auth.routes.js";
import messageRoutes from "./route/message.routes.js";
import { app,server } from "./lib/socket.js";

dotenv.config();
const PORT=5001;

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))
app.use(express.json({  limit: '50mb'}))
app.use(cookieParser())
app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);

server.listen(PORT,()=>{
    console.log("server running on PORT:"+PORT);
    connectDB("mongodb+srv://crystalninja0123:gPMZYaF0FEAnGTlB@cluster0.n7fhbie.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(()=>{
        console.log("connection succesfull")
    }).catch(()=>{
        console.log("couldn't establish connection to db")
    })
})

