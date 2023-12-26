import { IProduct } from "./../types/product";
import joi from "joi";
import { Request, Response, NextFunction } from "express";
import { errorFunction } from "../utils/errorFunction";

const validation = joi.object<IProduct>({
  nameProduct: joi.string().required().min(5).max(50),
  brandProduct: joi.string().required(),
  price: joi.number().min(10000).required(),
  quantity: joi.number().min(5).required(),
  descrisition: joi.string().required(),
  images: joi.array().min(1).max(5).required(),
});

export const productValidation = async (
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
