import { NextResponse } from "next/server";
import crypto from "crypto";
import axios from "axios";
import { Order } from "@/models/order.model";
import { Payment } from "@/models/payment.model";
import { dbConnect } from "@/lib/database";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const merchantTransactionId = searchParams.get("merchantTransactionId");
    const merchantId = process.env.PHONEPE_MERCHANT_ID;
    const orderId = searchParams.get("orderId");
    const user = searchParams.get("user");
    const email = searchParams.get("email");

    const string =
      `/pg/v1/status/${merchantId}/${merchantTransactionId}` +
      process.env.PHONEPE_SALT_KEY!;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = sha256 + "###" + process.env.PHONEPE_SALT_INDEX!;

    // Verify Status
    const res = await axios.get(
      `${process.env.PHONEPE_BASE_URL}/pg/v1/status/${merchantId}/${merchantTransactionId}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
          "X-MERCHANT-ID": merchantId,
        },
      }
    );

    const data = res.data;

    // If checksum is valid, process the payment response
    if (!data.success) {
      await Order.findByIdAndDelete(orderId);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/failed`
      );
    }

    // Create Payment
    const payment = await Payment.create({
      orderId: orderId,
      transactionId: merchantTransactionId,
      status: "success",
      amount: parseInt(data.data.amount) / 100,
      method: data.data.paymentInstrument?.type ?? "Prepaid",
      user,
      email,
    });

    // Update Order Status
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentId: payment._id,
        status: "success",
      },
      { new: true }
    );

    // Order response
    const orderResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL!}/api/game/order`,
      {
        userId: order.userId,
        zoneId: order.zoneId,
        product: order.productInfo,
        productId: order.productId,
        amount: order.amount,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("order res ", orderResponse);

    if (orderResponse.data.status !== "success") {
      await Order.findByIdAndDelete(orderId);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/failed`
      );
    }

    // Redirect to success page
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/success`);
  } catch (error: any) {
    console.log(error);
    console.error("Error in payment callback:", error.message);
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
