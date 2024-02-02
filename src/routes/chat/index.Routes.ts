import { Router } from "express";
import { dtoValidationMiddleware } from "../../validation/dto";
import { readByIdMiddleware, readMiddleware } from "../../db/mongo/read.database";
import { deleteByIdMiddleware } from "../../db/mongo/delete.database";
import Chat from "../../db/mongo/models/chat";
import { existCheck } from "../../validation/db";
import { createMiddleware } from "../../db/mongo/create.database";

//create router for add to server
const router: Router = Router();

router.post("",
  (req, res, next) => {
    req.body["user1Id"] = req.user._id;
    next();
  },
  // dtoValidationMiddleware(CreateChatBody, { skipMissingProperties: false, detailedMassage: process.env["NODE_ENV"] === "development" ? true : false, info: "please fill all fields" }),
  existCheck(Chat, { $and: [{ user1Id: "user1Id" }, { user2Id: "user2Id" }, , { type: "type" }] }, "Chat already exists!"),
  createMiddleware(["user1Id", "user2Id", "type"], Chat),
);

router.get("",
  (req, res, next) => {
    req.body["id"] = req.user._id;
    next();
  },
  readMiddleware(Chat, (search) => ({ $or: [{ user1Id: search }, { user2Id: search }] }), { populate: true, searchFromBody: (body) => body.id })
);

router.delete("/:id",
  deleteByIdMiddleware(Chat)
);

export default router;
