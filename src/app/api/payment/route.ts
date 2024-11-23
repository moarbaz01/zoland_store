import { Payment } from "@/models/payment.model";
import { NextResponse } from "next/server";

// **GET**: Retrieve orders
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    let orders;
    if (id) {
      // Fetch a single order by ID
      orders = await Payment.findById(id);
      if (!orders) {
        return NextResponse.json(
          { error: "Payment not found" },
          { status: 404 }
        );
      }
    } else {
      // Fetch all orders
      orders = await Payment.find();

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
