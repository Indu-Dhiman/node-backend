import { loginUser,createUser } from "../controllers/user/user";
import { Router } from "express";

const router = Router();

router.post("/signup", createUser);

router.post("/login", loginUser);



export default router;
