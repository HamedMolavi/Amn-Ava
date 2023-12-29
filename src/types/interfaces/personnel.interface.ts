import { Document, Schema } from "mongoose";

//define personnel type
export interface IPersonnel extends Document {
  _id: Schema.Types.ObjectId;
  firstName: string;
  lastName: string;
  nationalCode: string;
  email: string;
  phoneNumber: string;
  job: string;
  createDate: Date;
};
