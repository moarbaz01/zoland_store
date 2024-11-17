import { Product } from "@/models/product.model";
import { cloudinaryUpload } from "@/utils/cloudinary";
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
  cost: z.string(),
  region: z.string(),
  isApi: z.boolean(),
  apiName: z.string(),
  stock: z.boolean(),
  category: z.string(),
  image: z.any(),
});

export async function POST(req: Request) {
  try {
    const formdata = await req.formData();
    const result = ProductSchema.safeParse({
      name: formdata.get("name"),
      price: formdata.get("price"),
      description: formdata.get("description"),
      cost: formdata.get("cost"),
      region: formdata.get("region"),
      isApi: formdata.get("isApi"),
      apiName: formdata.get("apiName"),
      stock: formdata.get("stock"),
      category: formdata.get("category"),
      image: formdata.get("image"),
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error.errors }, { status: 400 });
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

    const isProduct = await Product.findOne({ name, isDeleted: false });
    if (isProduct) {
      return NextResponse.json(
        { error: "Product already exists" },
        { status: 400 }
      );
    }

    const uploadImage = await cloudinaryUpload(formdata.get("image") as File);
    if (!uploadImage) {
      return NextResponse.json(
        { error: "Image upload failed" },
        { status: 400 }
      );
    }
    const product = await Product.create({
      name,
      price,
      description,
      cost: JSON.parse(cost),
      region,
      isApi,
      apiName,
      image: uploadImage.url,
      stock,
      category,
    });

    return NextResponse.json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.log("Error :", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: "No product found" }, { status: 404 });
    }
    product.isDeleted = true;
    await product.save();
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("Error :", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { id, data } = await req.json();

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: "No product found" }, { status: 404 });
    }

    await Product.findByIdAndUpdate(id, data);
    return NextResponse.json({ message: "Product updated successfully" });
  } catch (error) {
    console.log("Error :", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
