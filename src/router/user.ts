import accessControl from "../middleware/access-control";
import { loginUser,createUser, updateUserProfile, forgotPassword, resetPassword,getUsers, deleteUser } from "../controllers/user/user";
import { Router } from "express";
import typeValidationMiddleware from "../middleware/typeValidation";
import User from "../models/user";

const router = Router();

router.post("/signup", typeValidationMiddleware(User), createUser);
router.post("/login", typeValidationMiddleware(User), loginUser);
router.post("/update-user-profile", updateUserProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.use(accessControl)
router.use(typeValidationMiddleware(User))

router.get("/get-users", getUsers);
router.delete("/delete-user/:id",deleteUser)


export default router;
