import { IUser, UserRole } from "./../types/user";
import joi from "joi";
import { Request, Response, NextFunction } from "express";
import { errorFunction } from "../utils/errorFunction";

const validation = joi.object<IUser>({
  userName: joi.string().required().min(5).max(50),
  email: joi.string().required().email(),
  password: joi.string().min(6).max(20).required(),
  address: joi.string(),
  avt: joi.string(),
  numberPhone: joi.string(),
  gender: joi.string(),
  role: joi.string()// Giá trị mặc định là "guest"
});

export const userValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = validation.validate(req.body);
  if (error) {
    res.status(406);
    return res.json(
      errorFunction(true, 406, `Error in data: ${error.message}`)
    );
  } else {
    next();
  }
};
