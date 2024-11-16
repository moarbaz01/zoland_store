import { Product } from "@/models/product.model";
import { NextResponse } from "next/server";
import z from "zod";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await Product.findById(params.id, { isDeleted: false });
    if (!product) {
      return NextResponse.json({ error: "No product found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.log("Error :", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

const ProductSchema = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string(),
  cost: z.array(
    z.object({
      id: z.string(),
      price: z.string(),
      amount: z.string(),
    })
  ),
  region: z.string(),
  isApi: z.boolean(),
  apiName: z.string(),
  stock: z.boolean(),
  category: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const image = req.formData().get("image")
    const result = ProductSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(result.error.errors, { status: 400 });
    }

    const {
      name,
      price,
      description,
      cost,
      region,
      isApi,
      apiName,
      stock,
      category,
    } = result.data;
  } catch (error) {
    console.log("Error :", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
