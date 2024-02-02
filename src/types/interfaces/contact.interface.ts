import mongoose, { Document } from "mongoose";

export interface IContact extends Document {
  _id: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  createdAt: number;
};