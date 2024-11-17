import { NextResponse } from "next/server";
import { Order } from "@/models/order.model";
import { dbConnect } from "@/lib/database";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json(); // Parse incoming request body
    const {
      userId,
      zoneId,
      product,
      productId,
      amount,
      product_db_id,
      orderDetails,
      user,
    } = body;

    if (
      !userId ||
      !zoneId ||
      !product ||
      !productId ||
      !amount ||
      !product_db_id ||
      !orderDetails ||
      !user
    ) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const order = await Order.create({
      user: user?.id,
      productId,
      productInfo: product,
      orderDetails,
      userId,
      zoneId,
      amount,
      product: product_db_id,
      email: user?.email,
    });

    return NextResponse.json({ message: "success", order }, { status: 200 });
  } catch (error: any) {
    console.error("Order API Error:", error.response?.data || error.message);
    return NextResponse.json(
      {
        error: "Failed to create order",
        details: error.response?.data || error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}
