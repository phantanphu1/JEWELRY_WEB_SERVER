import { IVoucher } from "../types/voucher";
import Vouchers from "../models/voucher.model";
import { errorFunction } from "../utils/errorFunction";
import { Request, Response, NextFunction } from "express";

const fakeCode = (length: number) => {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

const updatePublicVoucher = async (e: string, status: boolean) => {
  await Vouchers.findByIdAndUpdate(e, {
    public: status,
  });
};

const voucherController = {
  addVoucher: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await Vouchers.create({
        ...req.body,
        codeVoucher: String(fakeCode(6)),
        public: Number(new Date()) < req.body.startDate ? false : true,
      });
      res.json(errorFunction(false, 200, "Thêm thành công", data));
    } catch (error) {
      console.log("error: ", error);
      res.status(400).json({
        message: "Bad request",
      });
    }
  },
  getByPlaceId: async (req: Request, res: Response) => {
    try {
      const newData = await Vouchers.find({
        $and: [{ placeId: req.params.placeId }, { public: true }],
      });

      res.json(errorFunction(false, 200, "Lấy thành công !", newData));
    } catch (error) {
      res.status(500).json(error);
    }
  },
  findVoucher: async (req: Request, res: Response) => {
    try {
      const { codeVoucher, placeId } = req.query;

      const data = await Vouchers.findOne({
        codeVoucher: codeVoucher,
      }).populate("placeId", "name");

      if (String(data?.productId?._id) === placeId && data?.public === true) {
        res.json(errorFunction(false, 200, "Áp dụng mã thành công !", data));
      } else {
        res
          .status(402)
          .json(
            errorFunction(false, 402, "Mã này không tồn tại !")
          );
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const now = new Date();

      const dataVoucher = await Vouchers.find({});

      await dataVoucher.forEach((element: IVoucher) => {
        const startDate = new Date(element.startDate);
        const endDate = new Date(element.endDate);

        if (now >= startDate && now <= endDate) {
          updatePublicVoucher(element._id + "", true);
        } else {
          updatePublicVoucher(element._id + "", false);
        }
      });

      const { placeID, active } = req.query;

      const condition = placeID
        ? {
            $and: [{ placeId: placeID }, { public: active }],
          }
        : { public: active };

      const newData = await Vouchers.find(condition).populate(
        "placeId",
        "name"
      );

      res.json(errorFunction(false, 200, "Lấy thành công !", newData));
    } catch (error) {
      res.status(400).json({
        error: error,
        message: "Bad request",
      });
    }
  },
  deleteVoucher: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = await Vouchers.findById(req.params.id);

      if (!id)
        return res
          .status(404)
          .json(errorFunction(true, 404, "Không tồn tại !"));

      await Vouchers.findByIdAndDelete(req.params.id);
      res.status(200).json(errorFunction(true, 200, "Xóa thành công !"));
    } catch (error) {
      console.log("error: ", error);
      res.status(400).json({
        message: "Bad request",
      });
    }
  },
};

export default voucherController;
