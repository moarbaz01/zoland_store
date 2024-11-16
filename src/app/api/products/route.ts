import { NextResponse } from "next/server";
import { Product } from "@/models/product.model";

// const API_URL = "https://www.smile.one/smilecoin/api/productlist";
// const API_KEY = "250ac95f38bf87fbd07c6550a42bd5b4";
// const UID = "2110039";
// const EMAIL = "htlianahmar@gmail.com";
// const PRODUCT = "mobilelegends";

export async function GET(req: Request) {
  try {
    const products = await Product.find({ isDeleted: false });
    if (!products) {
      return NextResponse.json({ error: "No products found" }, { status: 404 });
    }
    return NextResponse.json(products);
  } catch (error) {
    console.log("Error :", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
