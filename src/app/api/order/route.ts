import { dbConnect } from "@/lib/database";
import { Order } from "@/models/order.model";
import { Product } from "@/models/product.model";
import { NextResponse } from "next/server";
import { z } from "zod";

// Connect to the database
dbConnect();

// Zod schema for validation
const orderSchema = z.object({
  user: z.string().min(1, "User is required"),
  email: z.string().email("Invalid email format"),
  costId: z.string().min(1, "Cost ID is required"),
  orderDetails: z.string(), // Accepts any object
  orderType: z.string(),
  gameCredentials: z
    .object({
      userId: z.string().optional(),
      zoneId: z.string().optional(),
      game: z.string().optional(),
    })
    .optional(),
  paymentId: z.string().nullable().optional(),
  product: z.string().optional(), // Product ID reference
  amount: z.string().min(1, "Amount is required"),
  status: z.enum(["pending", "success"]).optional(),
});

// **POST**: Create a new order
export async function POST(req: Request) {
  try {
    const json = await req.json();
    console.log("json : ", json);

    // Validate the input
    const validatedData = orderSchema.parse(json);

    // Verify that the product exists (if provided)
    if (validatedData.product) {
      const productExists = await Product.findById(validatedData.product);
      if (!productExists) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }
    }

    // Create and save the order
    const order = await Order.create(validatedData);
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 400 }
    );
  }
}

// **GET**: Retrieve orders
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    let orders;
    if (id) {
      // Fetch a single order by ID
      orders = await Order.findById(id).populate("product");
      if (!orders) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
    } else {
      // Fetch all orders
      orders = await Order.find().populate("product");
    }

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve orders" },
      { status: 500 }
    );
  }
}

// **PUT**: Update an order by ID
export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const json = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Validate the input (partial update allowed)
    const validatedData = orderSchema.partial().parse(json);

    // Update the order
    const updatedOrder = await Order.findByIdAndUpdate(id, validatedData, {
      new: true,
    }).populate("product");

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update order" },
      { status: 400 }
    );
  }
}

// **DELETE**: Delete an order by ID
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Delete the order
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Order deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 }
    );
  }
}
