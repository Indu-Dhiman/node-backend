import accessControl from "../middleware/access-control";
import getMenuLits from "../controllers/menurole";
import { Router } from "express";

const router = Router();

router.use(accessControl)
router.get("/get-menu-list", getMenuLits);


export default router;
