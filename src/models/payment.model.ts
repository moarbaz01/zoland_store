import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    payDate: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    orderId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Payment =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
