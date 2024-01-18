import mongoose, { Schema } from "mongoose";
import { IChat } from "../../../types/interfaces/chat.interface";

const ChatSchema: Schema<IChat> = new Schema(
  {
    type: { type: String, default: "private" },
    user1Id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    user2Id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    createdAt: { type: Number, default: Date.now }
  },
  {
    collection: "Chat"
  }
);

// Compile model from schema
const Chat = mongoose.model<IChat>("Chat", ChatSchema);
export default Chat;
