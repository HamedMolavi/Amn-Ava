import mongoose, { Schema } from "mongoose";
import { IBundle } from "../../../types/interfaces/bundle.interface";

const BundleSchema: Schema<IBundle> = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    identityKey: { type: String, required: true },
    registrationId: { type: Number, required: true },
    preKeys: { type: [{ "keyId": Number, "publicKey": String }], default: [] },
    signedPreKey: { type: { "keyId": Number, "publicKey": String, "signature": String }, default: undefined }
  },
  {
    collection: "Bundle",
    toJSON: {
      transform(_doc, ret) {
        delete ret["__v"]
        return ret
      }
    }
  }
);

// Compile model from schema
const Bundle = mongoose.model<IBundle>("Bundle", BundleSchema);
export default Bundle;
