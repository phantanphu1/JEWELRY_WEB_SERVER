
import mongoose, { Schema } from "mongoose";
import { IVoucher } from "../types/voucher";

const voucherSchema = new mongoose.Schema<IVoucher>(
  {
    codeVoucher: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Number,
      required: true,
    },
    endDate: {
      type: Number,
      required: true,
    },
    public: {
      type: Boolean,
      required: false,
      default: true,
    },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
  },
  {
    timestamps: true,
  }
);

const Vouchers = mongoose.model("Voucher", voucherSchema);

export default Vouchers;
