import { Router, Request, Response, NextFunction } from "express";
import { readByIdMiddleware, readMiddleware } from "../../db/mongo/read.database";
import { deleteByIdMiddleware } from "../../db/mongo/delete.database";
import Contact from "../../db/mongo/models/contact";
import mongoose from "mongoose";
import { createMiddleware } from "../../db/mongo/create.database";
import User from "../../db/mongo/models/user";
import { ApiError } from "../../types/classes/error.class";

//create router for add to server
const router: Router = Router();

router.post("",
  async (req, res, next) => {
    let user = await User.findOne({ username: req.body.username }).exec();
    if (!user) return next(new ApiError(404, "No valid username: " + req.body.username));
    req.body.userId = user?._id;
    req.body.ownerId = req.user._id;
    next();
  },
  createMiddleware(["userId", "ownerId"], Contact)
)

router.get("/:id",
  readMiddleware(Contact, (search) => { return { ownerId: search } }, { searchFromParams: (params) => params.id, populate: true })
);

router.delete("/:id",
  deleteByIdMiddleware(Contact)
);

export default router;
