import mongoose, { Schema } from "mongoose";
import { IPersonnel } from "../../../types/interfaces/personnel.interface";

//create personnel model with schema for save in DB
const PersonnelSchema: Schema<IPersonnel> = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    nationalCode: { type: String, required: true },
    email: { type: String, default: "" },
    phoneNumber: { type: String, required: true },
    job: String,
    createDate: { type: Date, default: Date.now },
  },
  {
    collection: "Personnel",
  }
);


// Compile model from schema
const Personnel = mongoose.model("Personnel", PersonnelSchema);
export default Personnel;
