import { model, models, Schema, Document } from "mongoose";

// TypeScript interface for Admin
export interface IAdmin extends Document {
  fullName: string;
  email: string;
  password: string;
}

// Mongoose schema definition
const adminSchema = new Schema<IAdmin>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true, // Automatically trims whitespace
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // Ensures emails are stored in lowercase
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Enforces a minimum password length
    },
  },
  { timestamps: true }
);

// Create or retrieve the existing Mongoose model
const Admin = models?.Admin || model<IAdmin>("Admin", adminSchema);

export default Admin;
