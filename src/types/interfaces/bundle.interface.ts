import mongoose, { Document } from "mongoose";

export interface IBundle extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  identityKey: string,
  registrationId: number,
  preKeys: Array<{ "keyId": number, "publicKey": string }>, //mongoose.Types.ObjectId
  signedPreKey: { "keyId": number, "publicKey": string, "signature": string }
};