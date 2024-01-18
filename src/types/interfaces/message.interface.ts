import mongoose, { Document } from "mongoose";

export interface IMessage extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  msg: string;
  chatId: mongoose.Schema.Types.ObjectId;
  senderId: mongoose.Schema.Types.ObjectId;
  sentAt: number;
};
