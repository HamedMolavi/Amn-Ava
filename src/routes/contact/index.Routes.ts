import { Router, Request, Response, NextFunction } from "express";
import { readByIdMiddleware, readMiddleware } from "../../db/mongo/read.database";
import { deleteByIdMiddleware } from "../../db/mongo/delete.database";
import Contact from "../../db/mongo/models/contact";
import mongoose from "mongoose";

//create router for add to server
const router: Router = Router();

router.get("/:id",
  readMiddleware(Contact, (search) => { return { ownerId: new mongoose.Schema.Types.ObjectId(search) } }, { searchFromParams: (params) => params.id, })
);

router.delete("/:id",
  deleteByIdMiddleware(Contact)
);

export default router;
