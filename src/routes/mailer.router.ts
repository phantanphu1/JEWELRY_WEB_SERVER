import { Router } from "express";
import mailerController from "../controllers/mailer.controller";

export const mailerRouter = (router: Router) => {
  router.post(
    "/email/send-code-register",
    mailerController.sendCodeOtpRegister
  );

  router.post("/email/send-confirm", mailerController.sendEmailConfirm);

  router.post("/email/send-payment", mailerController.sendEmailPayment);

  router.post("/email/send-cancel", mailerController.sendEmailCancel);

  router.post("/email/send-un-lock", mailerController.sendEmailUnLock);

  router.post("/email/send-code", mailerController.sendCodeOtp);
};
