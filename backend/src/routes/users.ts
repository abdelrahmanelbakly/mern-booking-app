import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";

const router = express.Router();

// Endpoint for user registration
router.post(
  "/register",
  [
    // Validate user input
    check("firstName", "First name is required").isString(),
    check("lastName", "Last name is required").isString(),
    check("email", "Valid email is required").isEmail(),
    check(
      "password",
      "Password with 6 or more characters is required"
    ).isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req); // Get validation results
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // Return validation errors
    }
    try {
      let user = await User.findOne({ email: req.body.email }); // Check if user already exists
      if (user) {
        return res.status(400).json({ message: "User already exists" }); // Return error if user exists
      }
      // Create a new user using request data and save to the database
      user = new User(req.body);
      await user.save();
      // Create authentication token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "1d",
        }
      );
      // Set authentication cookie with JWT token
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      });
      // Send successful response with descriptive message
      return res.status(200).send({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).send({ message: "Something went wrong" }); // Notify about server error
    }
  }
);

export default router;
