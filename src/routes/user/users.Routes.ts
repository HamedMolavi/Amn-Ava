import { Router, Request, Response, NextFunction } from "express";
import User from "../../db/mongo/models/user";
import { UserPasswordRequirements } from "../../types/interfaces/user.interface";
import { dtoValidationMiddleware } from "../../validation/dto";
import { UpdateUserBody } from "../../validation/dto/user.dto";
import { passwordValidatorMiddleware } from "../../validation/password";
import { readByIdMiddleware, readMiddleware } from "../../db/mongo/read.database";
import { updateByIdMiddleware } from "../../db/mongo/update.database";
import { deleteByIdMiddleware } from "../../db/mongo/delete.database";

//create router for add to server
const router: Router = Router();

//route for get users list
router.get("",
  readMiddleware(User, (search) => { return { username: { $regex: search, $options: "i" } } })
);
//route for get user by id from DB
router.get("/:id",
  readByIdMiddleware(User),
);

//add route for edit user
router.patch("/:id",
  dtoValidationMiddleware(UpdateUserBody, { skipMissingProperties: true, detailedMassage: process.env["NODE_ENV"] === "development" ? true : false, info: "please fill all fields" }),
  updateByIdMiddleware(User, {
    ignore: ["password", "email"],
  })
);

//add route for delete user
router.delete("/:id",
  deleteByIdMiddleware(User)
);

export default router;
