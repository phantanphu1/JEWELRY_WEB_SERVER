import { Router } from "express";
import userController from "../controllers/user.controller";
import { userValidation } from "../helpers/user";
import { UserRole } from "../types/user";
import { authorize } from "../middleware/authorize";
import { verifyToken } from "../middleware/checkCodeOtp";

export const userRouter = (router: Router) => {
    // router.post("/user/register",verifyToken, userValidation, userController.register);
    router.post("/user/register", userValidation, userController.register);
    router.post("/user/login", userController.login);
    router.get("/user/getAn/:id", userController.getAnUser);
    router.put("/user/update/:id", userController.updateUser);
    router.get("/user/getAll", userController.getAllUser);
    router.delete("/user/delete/:id", authorize([UserRole.ADMIN]), userController.deleteUser);

};
