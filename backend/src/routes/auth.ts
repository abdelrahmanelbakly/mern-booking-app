import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";

const router = express.Router();

// Endpoint for user login
router.post(
  "/login",
  [
    // Validate user input
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
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email }); // Find user with the provided email
      if (!user) {
        return res.status(400).json({ message: "Invalid Credentials" }); // Return error if user not found
      }
      const isMatch = await bcrypt.compare(password, user.password); // Compare passwords
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid Credentials" }); // Return error if passwords don't match
      }
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
      // Send successful response with the user ID
      res.status(200).json({ userId: user._id });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong!" }); // Notify about server error
    }
  }
);
router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
  res.status(200).send({ userId: req.userId });
});
router.post("/logout", (req: Request, res: Response) => {
  res.cookie("auth_token", "", {
    expires: new Date(0),
  });
  res.send();
});
export default router;
