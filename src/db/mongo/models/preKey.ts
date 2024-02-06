// import mongoose, { Schema } from "mongoose";
// import { IPreKey } from "../../../types/interfaces/preKey.interface";

// const PreKeySchema: Schema<IPreKey> = new Schema(
//   {
//     keyId: { type: Number, required: true },
//     publicKey: { type: String, required: true }
//   },
//   {
//     collection: "PreKey",
//     toJSON: {
//       transform(_doc, ret) {
//         delete ret["_id"];
//         delete ret["__v"];
//         return ret;
//       },
//     }
//   }
// );

// // Compile model from schema
// const PreKey = mongoose.model<IPreKey>("PreKey", PreKeySchema);
// export default PreKey;
