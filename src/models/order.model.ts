import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    productInfo: {
      type: String,
      required: true,
    },
    orderDetails: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    zoneId: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["failed", "success"],
      default: "success",
      required: true,
    },
  },
  { timestamps: true }
);

export const Order =
  mongoose.models.Order || mongoose.model("Order", orderSchema);
