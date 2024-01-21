import { Router } from "express";
import { dtoValidationMiddleware } from "../../validation/dto";
import { readByIdMiddleware, readMiddleware } from "../../db/mongo/read.database";
import { deleteByIdMiddleware } from "../../db/mongo/delete.database";
import Chat from "../../db/mongo/models/chat";
import { existCheck } from "../../validation/db";
import { createMiddleware } from "../../db/mongo/create.database";
import Message from "../../db/mongo/models/message";

//create router for add to server
const router: Router = Router();

router.post("",
  // dtoValidationMiddleware(CreateMessageBody, { skipMissingProperties: false, detailedMassage: process.env["NODE_ENV"] === "development" ? true : false, info: "please fill all fields" }),
  createMiddleware(["msg", "chatId", "senderId"], Message),
);

router.get("",
  readMiddleware(Message, (search) => { return { msg: search } })
);

router.delete("/:id",
  deleteByIdMiddleware(Message)
);

export default router;
