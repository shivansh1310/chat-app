import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path"

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import { app, server } from "./lib/socket.js";


dotenv.config();

app

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true, // this just means that authorisation headers/cookies can be sent with the request
}))


app.use("/api/auth", authRoutes); //whenever we hit the auth rout we'd like to hit teh file associated with auth.route
app.use("/api/messages", messageRoutes); 

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req,res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    })
}

server.listen(PORT, () => {
    console.log("Server running on PORT: " + PORT);
    connectDB();
})