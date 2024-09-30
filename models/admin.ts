import { Model, Schema, model, Document, models } from "mongoose";

export type AdminT = {
  fullName: string;
  email: string;
  password: string;
};

export type AdminMethods = AdminT & Document;

export type AdminModel = Model<AdminMethods>;

// const adminSchema: Schema<AdminMethods>

const adminSchema: Schema<AdminMethods> = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Admin =
  models?.Admin || model<AdminMethods, AdminModel>("Admin", adminSchema);

export default Admin;
