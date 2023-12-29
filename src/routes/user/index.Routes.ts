import { Router } from "express";


import usersRoutes from "./users.Routes";

const router: Router = Router();

//add rotes
router.use("/users", usersRoutes);


export default router;
