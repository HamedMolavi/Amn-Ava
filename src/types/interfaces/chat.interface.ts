import mongoose, { Document } from "mongoose";

export interface IChat extends Document {
  _id: mongoose.Types.ObjectId;
  type: string;
  user1Id: mongoose.Types.ObjectId;
  user2Id: mongoose.Types.ObjectId;
  createdAt: number
};