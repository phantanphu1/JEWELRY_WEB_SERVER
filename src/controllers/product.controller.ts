import { NextFunction, Request, Response } from "express";
import Product from "../models/product.model";
import { errorFunction } from "../utils/errorFunction";
import { IProduct } from "types/product";

const productController = {
  addProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const checkProduct = await Product.findOne({
        nameProduct: req.body.nameProduct,
      });
      if (checkProduct)
        res
          .status(201)
          .json(errorFunction(true, 201, "Đã tồn tại tên sản phẩm"));
      const data = await Product.create(req.body);
      res.json(errorFunction(true, 200, "Thêm thành công", data));
    } catch (error) {
      console.log("error", error);
      res.status(400).json({
        message: "Bad Request",
      });
    }
  },
  getAllProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { pageNumber, limit, nameProduct } = req.query;
      const SkipNumber = (Number(pageNumber) - 1) * Number(limit);

      if (!pageNumber || !limit) {
        return res
          .status(400)
          .json(errorFunction(true, 400, "Truyền thiếu page và limit"));
      }

      let query: any = {};

      let totalPage = 0;

      if (nameProduct) {
        query.nameProduct = {
          $regex: nameProduct,
          // $opition: "i",
        };
      }

      const allProduct = await Product.find(query);

      const result = await Product.find(query)
        .skip(SkipNumber)
        .limit(Number(limit));
      if (allProduct.length) {
        totalPage = Math.ceil(allProduct.length / Number(limit));
      }
      res.json(
        errorFunction(false, 200, "Lấy thành công", {
          totalPage: totalPage,
          total: allProduct.length,
          data: result,
        })
      );
    } catch (error) {
      console.log("err", error);
      res.status(404).json({
        message: "Bad Request",
      });
    }
  },
  getAnProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = await Product.findById(req.params.id);
      if (!id)
        return res.status(404).json(errorFunction(true, 404, "Không tồn tại"));
      const data = await Product.findById(req.params.id);
      res.status(200).json(errorFunction(false, 200, "Lấy thành công", data));
    } catch (error) {
      console.log("err", error);
      res.status(400).json({
        message: "Bad Request",
      });
    }
  },
  updateProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = await Product.findById(req.params.id);
      if (!productId)
        return res.status(404).json(errorFunction(true, 404, "Không tồn tại"));

      await Product.updateOne({ $set: req.body });
      res.status(200).json(errorFunction(false, 200, "Cập nhật thành công"));
    } catch (error) {
      console.log("err", error);
      res.status(400).json({
        message: "Bad Request",
      });
    }
  },
  deleteProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = await Product.findById<IProduct>(req.params.id);
      if (!id)
        return res.status(404).json(errorFunction(true, 404, "Không tồn tại!"));

      await Product.findByIdAndRemove(req.params.id);
      res.status(200).json(errorFunction(true, 200, "Xóa thành công"));
    } catch (error) {
      console.log("err", error);
      res.status(400).json({
        message: "Bad Request",
      });
    }
  },
};
export default productController;
