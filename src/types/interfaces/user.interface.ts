import mongoose, { Document, Model } from "mongoose";
import { Requirements } from "./password.interface";

//create user type
export interface IUser {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  phoneNumber: string;
  createdDate: Date;
};

export interface IUserDocument extends IUser, Document {
  _id: mongoose.Types.ObjectId;
  setPassword: (password: string, username: string) => string;
  checkPassword: (password: string) => Promise<boolean>;
  generateAuthSession: (is_remember: boolean) => any;
  toAuthJSON: (is_remember: boolean) => any;
};

export interface IUserModel extends Model<IUserDocument> {
  setPassword: (password: string, username: string) => string;
  checkPassword: (password: string) => Promise<boolean>;
  generateAuthSession: (is_remember: boolean) => any;
  toAuthJSON: (is_remember: boolean) => any;
};

// export interface PasswordRequirements extends Requirements{
//   [re: /[0-9]/, 
//   label: "Includes number"]
// }
export const UserPasswordRequirements: Requirements =  [
  { re: /[0-9]/, label: "Includes number" },
  { re: /[a-z]/, label: "Includes lowercase letter" },
  { re: /[A-Z]/, label: "Includes uppercase letter" },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "Includes special symbol" },
];
