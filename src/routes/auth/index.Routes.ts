import { Router } from "express";


import loginRoutes from "./login.Routes";
import registerRoutes from "./register.Routes";
import resetPassword from "./reset.Routes";

const router: Router = Router();

router.use("/login", loginRoutes);
router.use("/register", registerRoutes);
router.use("/reset", resetPassword);

export default router;
