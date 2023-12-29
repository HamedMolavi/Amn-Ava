import { Router } from "express";
import personnelRoutes from "./personnel.Routes";

const router: Router = Router();

//add rotes
router.use("/personnels", personnelRoutes);


export default router;
