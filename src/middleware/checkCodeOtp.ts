import { Request, Response, NextFunction } from "express";
import { errorFunction } from "../utils/errorFunction";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cookie = req.cookies;
    const otp = req.body.codeOtp;

    if (!otp)
      return res
        .status(403)
        .json(errorFunction(true, 403, "Chưa nhận được mã OTP !"));

    if (!cookie.CodeRegister) {
      return res
        .status(403)
        .json(errorFunction(true, 403, "Mã OTP đã hết hạn !"));
    } else {
      const decode = jwt.verify(
        cookie.CodeRegister,
        String(process.env.TOKEN_SECRET)
      );

      const { code } = decode as any;

      if (Number(code) === Number(otp)) {
        next();
      } else {
        res
          .status(404)
          .json(errorFunction(true, 404, "Mã OTP không chính xác !"));
      }
    }
  } catch (error) {
    res.status(400).json({
      error: error,
      message: "Bad request",
    });
  }
};
