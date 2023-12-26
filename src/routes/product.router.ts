import { Router } from "express";
import productController from "../controllers/product.controller";
import { productValidation } from "../helpers/product";
import { authorize } from "../middleware/authorize";
import { UserRole } from "../types/user";

export const productRouter = (router: Router) => {
  router.post(
    "/product/addProduct",
    productValidation,
    productController.addProduct
  );
  router.get(
    "/product/getAllProduct",
    authorize([UserRole.ADMIN]),
    productController.getAllProduct
  );
  router.get("/product/getAnProduct/:id", productController.getAnProduct);
  router.put("/product/updateProduct/:id", productController.updateProduct);
  router.delete("/product/deleteProduct/:id", productController.deleteProduct);
};
