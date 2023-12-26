import { Router } from "express";
import { userValidation } from "../helpers/user";
import { authorize } from "../middleware/authorize";
import { UserRole } from "../types/user";
import userManagementController from "../controllers/admin/userManagement/userManagement.controller";

export const userManagementRouter = (router: Router) => {
  router.post(
    "/user/register",
    userValidation,
    userManagementController.register
  );
  router.post("/user/login", userManagementController.login);
  router.get("/user/getAn/:id", userManagementController.getAnUser);
  router.put("/user/update/:id", userManagementController.updateUser);
  router.get(
    "/admin/user-management/get-all-user",
    authorize([UserRole.ADMIN]),
    userManagementController.getAllUser
  );
  router.delete(
    "/user/delete/:id",
    authorize([UserRole.ADMIN]),
    userManagementController.deleteUser
  );
};
