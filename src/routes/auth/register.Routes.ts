import { Router, Request, Response, NextFunction } from "express";
import User from "../../db/mongo/models/user";
import { IUser, UserPasswordRequirements } from "../../types/interfaces/user.interface";
import { dtoValidationMiddleware } from "../../validation/dto";
import { CreateUserBody, UpdateUserBody } from "../../validation/dto/user.dto";
import { existCheck } from "../../validation/db";
import { passwordValidatorMiddleware } from "../../validation/password";
import { createMiddleware } from "../../db/mongo/create.database";

const router: Router = Router();

//POST /auth/register
router.post("",
  dtoValidationMiddleware(CreateUserBody, { skipMissingProperties: false, detailedMassage: process.env["NODE_ENV"] === "development" ? true : false, info: "please fill all fields" }),
  existCheck(User, { $or: [{ username: "username" }, { email: "email" }] }, "User or Email already exists!"),
  createMiddleware(["username", "password", "email", "firstName", "lastName"], User),
);

export default router;