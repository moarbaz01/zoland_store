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
    costId: {
      type: String,
      required: true,
    },
    orderDetails: {
      type: String,
      required: true,
    },
    gameCredentials: {
      userId: {
        type: String,
      },
      zoneId: {
        type: String,
      },
      game: {
        type: String,
      },
    },
    region: {
      type: String,
    },
    orderType: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
      default: null,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    amount: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Order =
  mongoose.models.Order || mongoose.model("Order", orderSchema);
