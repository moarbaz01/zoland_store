import { dbConnect } from "@/lib/database";
import { Product } from "@/models/product.model";
import { cloudinaryUpload } from "@/utils/cloudinary";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Connect to the database
dbConnect();

// Zod schema for validation
const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  region: z.string().optional(),
  apiName: z.string().optional(),
  cost: z.array(
    z.object({
      id: z.string(),
      price: z.string(),
      amount: z.string(),
    })
  ),
  game: z.string(),
  isApi: z.boolean().optional(),
  stock: z.boolean().optional(),
  image: z.any(), // Image is handled separately
});

// **POST**: Create a new product
export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // If the user is not authenticated, return Unauthorized
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" });
    }
    const formData = await req.formData();
    const rawData: Record<string, any> = {};
    console.log(formData);

    // Parse FormData
    formData.forEach((value, key) => {
      if (key === "cost") {
        const parsedCost = JSON.parse(value.toString()).map((item: any) => ({
          id: item.id,
          price: item.price, // Ensure it's a string
          amount: item.amount, // Ensure it's a string
        }));
        console.log(typeof parsedCost);
        rawData[key] = parsedCost;
      } else if (key === "image" && value instanceof File) {
        rawData[key] = value;
      } else if (key === "isApi") {
        rawData[key] = value === "true";
      } else if (key === "stock") {
        rawData[key] = value === "true";
      } else {
        rawData[key] = value;
      }
    });

    // Validate inputs
    const result = productSchema.safeParse(rawData);
    if (!result.success) {
      const errors = result.error.errors.map((error) => ({
        field: error.path.join("."),
        message: error.message,
      }));
      return NextResponse.json({ errors }, { status: 400 });
    }
    const validatedData = result.data;

    // Upload image to Cloudinary
    const { url } =
      validatedData.image instanceof File
        ? await cloudinaryUpload(validatedData.image)
        : { url: validatedData.image };
    validatedData.image = url;

    // Save product to the database
    const product = await Product.create(validatedData);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create product" },
      { status: 400 }
    );
  }
}

// **GET**: Retrieve products
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    let products;
    if (id) {
      // Fetch a single product by ID
      products = await Product.findById(id);
      if (!products) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }
    } else {
      // Fetch all products (excluding deleted ones)
      products = await Product.find({ isDeleted: false });
    }

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve products" },
      { status: 500 }
    );
  }
}

// **PUT**: Update a product by ID
export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // If the user is not authenticated, return Unauthorized
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" });
    }

    if (token?.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" });
    }
    const formData = await req.formData();
    const id = formData.get("id")?.toString();

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const rawData: Record<string, any> = {};
    formData.forEach((value, key) => {
      if (key === "cost") {
        const parsedCost = JSON.parse(value.toString()).map((item: any) => ({
          id: item.id,
          price: item.price, // Ensure it's a string
          amount: item.amount, // Ensure it's a string
        }));
        console.log(typeof parsedCost);
        rawData[key] = parsedCost;
      } else if (key === "image" && value instanceof File) {
        rawData[key] = value;
      } else if (key === "isApi") {
        rawData[key] = value === "true";
      } else if (key === "stock") {
        rawData[key] = value === "true";
      } else {
        rawData[key] = value;
      }
    });

    // Validate inputs (excluding image validation)
    const result = productSchema.safeParse(rawData);
    if (!result.success) {
      const errors = result.error.errors.map((error) => ({
        field: error.path.join("."),
        message: error.message,
      }));
      return NextResponse.json({ errors }, { status: 400 });
    }
    const validatedData = result.data;

    if (validatedData.image) {
      // Upload new image to Cloudinary if provided
      const { url } =
        validatedData.image instanceof File
          ? await cloudinaryUpload(validatedData.image)
          : { url: validatedData.image };
      validatedData.image = url;
    }

    // Update product in the database
    const updatedProduct = await Product.findByIdAndUpdate(id, validatedData, {
      new: true,
    });

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update product" },
      { status: 400 }
    );
  }
}

// **DELETE**: Soft delete a product by ID
export async function DELETE(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // If the user is not authenticated, return Unauthorized
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" });
    }

    if (token?.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" });
    }
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Soft delete the product
    const deletedProduct = await Product.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
