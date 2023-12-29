import { IUserDocument } from "./interfaces/user.interface";

export { };
declare module 'express-session' {
  interface SessionData { user: IUserDocument& { _id: Types.ObjectId; }, ip: string }
}