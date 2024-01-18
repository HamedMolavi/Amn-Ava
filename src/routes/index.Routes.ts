import { Router } from "express";
import appRoutes from "./user/index.Routes";
import authRoutes from "./auth/index.Routes";

import { passportGate } from "../authentication/authorize.auth";

const router: Router = Router();

//routes in which verification is not needed
router.use("/auth", authRoutes);

//middleware for check and verify token
router.use(passportGate);

//add rotes app
router.use("/api", appRoutes);

export default router;
