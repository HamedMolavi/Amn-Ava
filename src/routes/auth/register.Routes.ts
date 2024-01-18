import { Router, Request, Response, NextFunction } from "express";
import User from "../../db/mongo/models/user";
import { IUser, UserPasswordRequirements } from "../../types/interfaces/user.interface";
import { dtoValidationMiddleware } from "../../validation/dto";
import { CreateUserBody, UpdateUserBody } from "../../validation/dto/user.dto";
import { existCheck } from "../../validation/db";
import { passwordValidator } from "../../validation/password";
import { createMiddleware } from "../../db/mongo/create.database";

//create router for add to server
const router: Router = Router();


//add route for register new user
router.post("",
  dtoValidationMiddleware(CreateUserBody, { skipMissingProperties: false, detailedMassage: process.env["NODE_ENV"] === "development" ? true : false, info: "please fill all fields" }),
  existCheck(User, { $or: [{ username: "username" }, { phone_number: "phone_number" }] }, "User or Phone number already exists!"),
  //verify password strength
  passwordValidator(UserPasswordRequirements),
  createMiddleware(["username", "password", "phone_number", "firstName", "lastName"], User),
);

export default router;