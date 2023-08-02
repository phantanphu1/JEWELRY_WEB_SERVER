import express from "express";
import { userRouter } from "./user.router";
import { mailerRouter } from "./mailer.router";


const router = express.Router();
const routes = () => {

  userRouter(router)
  mailerRouter(router)
  return router;
};

export default routes;
