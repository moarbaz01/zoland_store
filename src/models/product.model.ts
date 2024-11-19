import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    game: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    apiName: {
      type: String,
      required: true,
    },
    isApi: {
      type: Boolean,
      default: false,
    },
    stock: {
      type: Boolean,
      default: true,
    },
    cost: [
      {
        id: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        amount: {
          type: String,
          required: true,
        },
      },
    ],
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
