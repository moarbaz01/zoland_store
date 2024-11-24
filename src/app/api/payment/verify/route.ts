import { NextResponse } from "next/server";
import crypto from "crypto";
import axios from "axios";
import { Order } from "@/models/order.model";
import { Payment } from "@/models/payment.model";
import { dbConnect } from "@/lib/database";
import { User } from "@/models/user.model";
import { generateSign } from "@/utils/hash";
import { sendEmail } from "@/utils/nodemailer";
import createEmailTemplate from "@/template/emailTemplate";


// Generate checksum
const generateChecksum = (merchantId: string, merchantTransactionId: string) => {
  const string =
    `/pg/v1/status/${merchantId}/${merchantTransactionId}` +
    process.env.PHONEPE_SALT_KEY!;
  const sha256 = crypto.createHash("sha256").update(string).digest("hex");
  const checksum = sha256 + "###" + process.env.PHONEPE_SALT_INDEX!;
  return checksum;
};

// Get Status Request
const statusRequest = async (merchantId: string, merchantTransactionId: string) => {
  const checksum = generateChecksum(merchantId, merchantTransactionId);
  const url = `${process.env.PHONEPE_BASE_URL}/pg/v1/status/${merchantId}/${merchantTransactionId}`;
  const options = {
    method: "GET",
    url,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
      "X-MERCHANT-ID": merchantId,
    },
  };
  const response = await axios.request(options);
  return response.data;
};

const gameOrderRequest = async (order: any) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const params = {
    uid: process.env.SMILE_ONE_UID!,
    email: process.env.SMILE_ONE_EMAIL!,
    userid: order.gameCredentials.userId,
    zoneid: order.gameCredentials.zoneId,
    product: order.gameCredentials.game,
    productid: order.costId,
    time: timestamp,
  };
  const sign = generateSign(params, process.env.SMILE_ONE_API_KEY!);
  const res = await axios.post(
    `${process.env.SMILE_ONE_API_URL!}/createorder`,
    { ...params, sign },
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );
  if (res.data.message !== "success") {
    return { result: null, message: res.data.message };
  }
  return res.data;
};

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const merchantTransactionId = searchParams.get("merchantTransactionId");
    const merchantId = process.env.PHONEPE_MERCHANT_ID;
    const orderId = searchParams.get("orderId");
    const user = searchParams.get("user");
    const email = searchParams.get("email");

    // Verify Status
    const data = await statusRequest(merchantId!, merchantTransactionId!);

    // If payment failed
    if (!data.success) {
      await Order.findByIdAndDelete(orderId);
      return NextResponse.redirect(
        new URL(`/failed?message=Payment Failed`, process.env.NEXT_PUBLIC_BASE_URL!),
        { status: 302 }  // Explicitly setting status as 302 (default)
      );  // Explicitly setting status as 302 (default
    }

    // Create Payment record
    const payment = await Payment.create({
      orderId: orderId,
      transactionId: merchantTransactionId,
      status: "success",
      amount: parseInt(data.data.amount) / 100,
      method: data.data.paymentInstrument?.type,
      user,
      email,
    });

    // Update Order Status
    const order = await Order.findById(orderId).populate("product");

    order.paymentId = payment._id;
    order.status = order.orderType === "API Order" ? "success" : "pending";
    await order.save();

    // Create game order
    if (order.orderType === "API Order") {
      const orderResponse = await gameOrderRequest(order);
      if (orderResponse.result && orderResponse.result === null) {
        return NextResponse.redirect(
          new URL(`/failed?message="Top-UP Failed"}`, process.env.NEXT_PUBLIC_BASE_URL!),
          { status: 302 }  // Explicitly setting status as 302 (default)
        );
      }
    }

    // Update User's order history
    await User.findByIdAndUpdate(user, {
      $push: {
        order: order._id,
      },
    });

    if (order.orderType === "Custom Order") {
      await sendEmail(email, "Order Placed", createEmailTemplate(order))
    }

    // Redirection on success
    return NextResponse.redirect(
      new URL(`/success?transactionId=${merchantTransactionId}&message=success`, process.env.NEXT_PUBLIC_BASE_URL!),
      { status: 302 }  // Explicitly setting status as 302 (default)
    );
  } catch (error: any) {
    console.error("Error in payment callback:", error.message);
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
