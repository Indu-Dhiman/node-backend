import { loginUser,createUser, updateUserProfile, forgotPassword, resetPassword } from "../controllers/user/user";
import { Router } from "express";

const router = Router();

router.post("/signup", createUser);

router.post("/login", loginUser);
router.post("/update-user-profile", updateUserProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);



export default router;
