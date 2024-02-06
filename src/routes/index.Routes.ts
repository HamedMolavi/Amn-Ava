import { Router } from "express";
import usersRoutes from "./user/index.Routes";
import chatsRoutes from "./chat/index.Routes";
import messagesRoutes from "./message/index.Routes";
import contactsRoutes from "./contact/index.Routes";
import cryptoRoutes from "./auth/crypto.Routes";
import authRoutes from "./auth/index.Routes";

import { passportGate } from "../authentication/authorize.auth";

const router: Router = Router();

//routes in which verification is not needed
router.use("", (req, res, next)=>next());
router.use("/auth", authRoutes);

//middleware for check and verify token
router.use(passportGate);

//add rotes app
router.use("/users", usersRoutes);
router.use("/chats", chatsRoutes);
router.use("/messages", messagesRoutes);
router.use("/contacts", contactsRoutes);
router.use("/bundles", cryptoRoutes);

export default router;
