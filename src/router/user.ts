import { loginUser,createUser, updateUserProfile } from "../controllers/user/user";
import { Router } from "express";

const router = Router();

router.post("/signup", createUser);

router.post("/login", loginUser);
router.post("/update-user-profile", updateUserProfile);



export default router;
