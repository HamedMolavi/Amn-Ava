import mongoose, { Document } from "mongoose";

export interface IContact extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  ownerId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  createdAt: number;
};