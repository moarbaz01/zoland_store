import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    email: {
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
      type: Object,
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
      required: false,
      default: "null",
    },
    product: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "success"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Order =
  mongoose.models.Order || mongoose.model("Order", orderSchema);
