// Import required modules
import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";
import path from "path";

// Connect to MongoDB using the provided connection string from environment variables
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);

// Initialize the Express application
const app = express();

// Middleware setup
app.use(cookieParser());
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse incoming URL-encoded requests
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
); // Enable Cross-Origin Resource Sharing (CORS)
//connect frontend
app.use(express.static(path.join(__dirname, "../../frontend/dist")));
// Define routes
app.use("/api/auth", authRoutes); // Routes for authentication
app.use("/api/users", userRoutes); // Routes for user-related operations

// Start the server and listen on port 7000
app.listen(7000, () => {
  console.log("server is running on localhost 7000");
});
