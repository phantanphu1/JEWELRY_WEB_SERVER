import express from "express";
import { userRouter } from "./user.router";
import { mailerRouter } from "./mailer.router";
import { productRouter } from "./product.router";
import { voucherRouter } from "./voucher.router";
import { userManagementRouter } from "./userManagement.router";

const router = express.Router();
const routes = () => {
  userRouter(router);
  mailerRouter(router);
  productRouter(router);
  voucherRouter(router);
  userManagementRouter(router);
  return router;
};

export default routes;
