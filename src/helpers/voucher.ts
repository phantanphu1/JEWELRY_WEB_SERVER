import { IVoucher } from "../types/voucher";
import joi from "joi";
import { Request, Response, NextFunction } from "express";
import { errorFunction } from "../utils/errorFunction";

const validation = joi.object<IVoucher>({
  codeVoucher: joi.string(),
  title: joi.string().required(),
  price: joi.number().min(10000).required(),
  startDate: joi.number().required(),
  endDate: joi.number().required(),
  public: joi.boolean(),
  productId: joi.string().required(),
});

export const voucherValidation = async (
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
