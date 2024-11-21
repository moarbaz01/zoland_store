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
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    apiName: {
      type: String,
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
          type: String, // Ensure this is defined as String
          required: true,
        },
        amount: {
          type: String, // Ensure this is defined as String
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
