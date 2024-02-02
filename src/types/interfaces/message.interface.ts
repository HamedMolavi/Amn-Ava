import mongoose, { Document } from "mongoose";

export interface IMessage extends Document {
  _id: mongoose.Types.ObjectId;
  msg: string;
  chatId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  sentAt: number;
};
