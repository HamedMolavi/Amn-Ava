import mongoose, { Schema } from "mongoose";
import { IContact } from "../../../types/interfaces/contact.interface";

const ContactSchema: Schema<IContact> = new Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    createdAt: { type: Number, default: Date.now }
  },
  {
    collection: "Contact"
  }
);

// Compile model from schema
const Contact = mongoose.model<IContact>("Contact", ContactSchema);
export default Contact;
