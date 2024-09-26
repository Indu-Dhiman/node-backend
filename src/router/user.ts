import { loginUser,createUser, updateUserProfile, forgotPassword, resetPassword,getUsers, deleteUser } from "../controllers/user/user";
import { Router } from "express";

const router = Router();

router.post("/signup", createUser);

router.post("/login", loginUser);
router.post("/update-user-profile", updateUserProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/get-users", getUsers);
router.delete("/delete-user/:id",deleteUser)


export default router;
