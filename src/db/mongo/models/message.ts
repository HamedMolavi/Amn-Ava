import mongoose, { Schema } from "mongoose";
import { IMessage } from "../../../types/interfaces/message.interface";

const MessageSchema: Schema<IMessage> = new Schema(
  {
    msg: { type: String, default: "" },
    chatId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Chat" },
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    sentAt: { type: Number, default: Date.now }
  },
  {
    collection: "Message"
  }
);

// Compile model from schema
const Message = mongoose.model<IMessage>("Message", MessageSchema);
export default Message;
