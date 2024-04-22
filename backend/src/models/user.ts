import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Define the structure of a user document
export interface UserType {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Define the schema for the user collection
const userSchema = new mongoose.Schema<UserType>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});

// Middleware to encrypt the password before saving it to the database
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// Create and export the User model based on the user schema
const User = mongoose.model<UserType>("User", userSchema);

export default User;
