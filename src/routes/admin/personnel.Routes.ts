import { Router, Request, Response, NextFunction } from "express";
import { ApiError } from "../../types/classes/error.class";
import url from "url";
import Personnel from "../../db/mongo/models/personnel";
import { dtoValidationMiddleware } from "../../validation/dto";
import { CreatePersonnelBody } from "../../validation/dto/personnel.dto";
import { existCheck } from "../../validation/db";
import { createMiddleware } from "../../db/mongo/create.database";
import { readByIdMiddleware, readMiddleware } from "../../db/mongo/read.database";
import { updateByIdMiddleware } from "../../db/mongo/update.database";
import { deleteByIdMiddleware } from "../../db/mongo/delete.database";

//create router for add to routes file
const router: Router = Router();

//add route for register new personnel
router.post("",
  dtoValidationMiddleware(CreatePersonnelBody, { skipMissingProperties: false, detailedMassage: process.env["NODE_ENV"] === "development" ? true : false, info: "please fill all fields" }),
  existCheck(Personnel, { $or: [{ national_code: "national_code" }, { personnel_code: "personnel_code" }] }, "Personnel already exists!"),
  createMiddleware(["firstName", "lastName", "national_code", "email", "phoneNumber", "job"], Personnel),
);

//route for get personnels list
router.get("",
  readMiddleware(Personnel, (search) => {
    return {
      $or: [
        { firstName: { $regex: search } },
        { lastName: { $regex: search } },
        { nationalCode: { $regex: search } },
        { phoneNumber: { $regex: search } }]
    }
  })
);

//route for get personnel by id from DB
router.get("/:id",
  readByIdMiddleware(Personnel)
);

//add route for edit personnel
router.patch("/:id",
  updateByIdMiddleware(Personnel),
);

//add route for delete personnel
router.delete("/:id",
  deleteByIdMiddleware(Personnel), //also deletes image vector in post remove schema
);

export default router;
