import { Router } from "express";
import adminRoutes from "./admin/index.Routes";
import userRoutes from "./user/index.Routes";
import login from "./auth/login.Routes";

import { passportGate } from "../authentication/authorize.auth";
import accessCheck, { userCanGetHisInfo } from "../authentication/accessCheck.auth";
import { Access } from "../types/enums/access.enum";

const router: Router = Router();

//routes in which verification is not needed
router.use("/auth/login", login);

//middleware for check and verify token
router.use(passportGate);

//add rotes app
router.use("/user", accessCheck(undefined, "user"), userRoutes);
// this allows admin to pass thru, while checks extraFunction for "user" role.
router.use("/admin", accessCheck(Access.Extra, "", { extraFunction: userCanGetHisInfo}), adminRoutes);



export default router;
