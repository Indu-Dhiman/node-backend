import getMenuLits from "../controllers/menurole";
import { Router } from "express";

const router = Router();

router.get("/get-menu-list", getMenuLits);


export default router;
