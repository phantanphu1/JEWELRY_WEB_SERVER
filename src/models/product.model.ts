import mongoose from "mongoose";
import { IProduct } from "../types/product";
const productSchema = new mongoose.Schema<IProduct>(
  {
    nameProduct: {
      type: String,
      required: true,
      unique: true,
    },
    brandProduct: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required:true
    },
    descrisition: {
      type: String,
      required:true
    },
    images: [{ type: String, required: true }],
  },
  {
    timestamps: true,
  }
);
const Product = mongoose.model("Product", productSchema);
export default Product;
