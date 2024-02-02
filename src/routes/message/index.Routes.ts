import { Router } from "express";
import { dtoValidationMiddleware } from "../../validation/dto";
import { readByIdMiddleware, readMiddleware } from "../../db/mongo/read.database";
import { deleteByIdMiddleware } from "../../db/mongo/delete.database";
import Chat from "../../db/mongo/models/chat";
import { existCheck } from "../../validation/db";
import { createMiddleware } from "../../db/mongo/create.database";
import Message from "../../db/mongo/models/message";
import { ApiError } from "../../types/classes/error.class";

//create router for add to server
const router: Router = Router();

router.post("",
  // dtoValidationMiddleware(CreateMessageBody, { skipMissingProperties: false, detailedMassage: process.env["NODE_ENV"] === "development" ? true : false, info: "please fill all fields" }),
  (req, res, next) => {
    req.body["senderId"] = req.user._id;
    next();
  },
  createMiddleware(["msg", "chatId", "senderId"], Message),
);

router.get("/:id",
  async (req, res, next) => {
    let chat = await Chat.findById(req.params.id).exec();
    if (!!chat?.user1Id && (req.user._id.equals(chat?.user1Id) || req.user._id.equals(chat?.user2Id))) return next();
    return next(new ApiError(401, "No access!"))
  },
  readMiddleware(Message, (search) => ({ chatId: search }), { populate: true, searchFromParams: (params) => params.id })
);

router.delete("/:id",
  deleteByIdMiddleware(Message)
);

export default router;
