import mongoose, { Document } from "mongoose";

export interface IChat extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  type: string;
  user1Id: mongoose.Schema.Types.ObjectId;
  user2Id: mongoose.Schema.Types.ObjectId;
  createdAt: number
};