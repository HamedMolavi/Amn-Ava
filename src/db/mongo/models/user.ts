import mongoose, { Schema } from "mongoose";
import { genSaltSync, compareSync, hashSync } from "bcrypt";
import { IUserDocument, IUserModel } from "../../../types/interfaces/user.interface";

//for encrypt password
const SALT_FACTOR = 10;
//create user model with schema for save in DB
const UserSchema: Schema<IUserDocument> = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: { type: Number, default: Date.now },
  },
  {
    collection: "User",
    toJSON: {
      transform(_doc, ret) {
        delete ret["password"];
        return ret;
      },
    }
  }
);

//compare password
UserSchema.methods.checkPassword = function (password: string) {
  let user = this;
  return compareSync(password + user.username, user.password);
};

UserSchema.methods.setPassword = function (password: string, username: string) {
  const salt = genSaltSync(SALT_FACTOR);
  const result = hashSync(password + username, salt);
  return result
};

UserSchema.pre("save", function (done: Function) {
  try {
    const user = this;
    if (!user.isModified("password")) return done();
    user.password = user.setPassword(user.password, user.username);
    done();
  } catch (err) {
    done(err);
  };
});
UserSchema.pre('updateOne', async function (done) {
  const doc = await this.model.findOne(this.getQuery());
  const updatingFileds: { [key: string]: string } = Object(this.getUpdate());
  if (!updatingFileds.hasOwnProperty("password")) return done(); // password didn't updated
  doc.password = doc.setPassword(doc.password, doc.username);
  done()
})
// Compile model from schema
const User = mongoose.model<IUserDocument, IUserModel>("User", UserSchema);
export default User;
