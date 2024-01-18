import { Router, Request, Response, NextFunction } from "express";
import User from "../../db/mongo/models/user";
import { UserPasswordRequirements } from "../../types/interfaces/user.interface";
import { dtoValidationMiddleware } from "../../validation/dto";
import { ResetPasswordBody } from "../../validation/dto/login.dto";
import { passwordValidator } from "../../validation/password";
import { updateByIdMiddleware } from "../../db/mongo/update.database";

//create router for add to server
const router: Router = Router();

router.patch("/:id",
  dtoValidationMiddleware(ResetPasswordBody, { skipMissingProperties: true, detailedMassage: process.env["NODE_ENV"] === "development" ? true : false, info: "please fill all fields" }),
  passwordValidator(UserPasswordRequirements),
  updateByIdMiddleware(User)
);

export default router;