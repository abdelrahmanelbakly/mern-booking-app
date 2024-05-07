// Import required modules
import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import myHotelRoutes from "./routes/my-hotels";

// Connect to MongoDB using the provided connection string from environment variables
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);

//connect to cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
app.use("/api/my-hotels", myHotelRoutes);
//catch all
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

// Start the server and listen on port 7000
app.listen(7000, () => {
  console.log("server is running on localhost 7000");
});
