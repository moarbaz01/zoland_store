import { NextResponse } from "next/server";
import axios from "axios";
import { Order } from "@/models/order.model";
import { Payment } from "@/models/payment.model";
import { dbConnect } from "@/lib/database";
import { User } from "@/models/user.model";
import { generateSign } from "@/utils/hash";
import { sendEmail } from "@/utils/nodemailer";
import createEmailTemplate from "@/template/emailTemplate";
import { SHA256 } from "crypto-js";

// Generate checksum
const generateChecksum = (
  merchantId: string,
  merchantTransactionId: string
) => {
  const string =
    `/pg/v1/status/${merchantId}/${merchantTransactionId}` +
    process.env.PHONEPE_SALT_KEY;

  const sha256 = SHA256(string).toString();

  const checksum = sha256 + "###" + process.env.PHONEPE_SALT_INDEX;

  return checksum;
};

// Get Status Request
const statusRequest = async (
  merchantId: string,
  merchantTransactionId: string
) => {
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

  console.log("Params:", params);
  const sign = generateSign(params, process.env.SMILE_ONE_API_KEY!);
  const res = await axios.post(
    `${process.env.SMILE_ONE_API_URL!}/createorder`,
    { ...params, sign },
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );
  console.log("Game Order Response:", res.data);
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
    const email = searchParams.get("email");
    const userId = searchParams.get("userId");
    const orderString = searchParams.get("order");
    if (!orderString) {
      return NextResponse.json(
        { message: "Missing order data" },
        { status: 400 }
      );
    }

    let orderData;
    try {
      orderData = JSON.parse(decodeURIComponent(orderString));
    } catch (error) {
      console.error("Failed to parse order string:", error.message);
      return NextResponse.json(
        { message: "Invalid order data", error: error.message },
        { status: 400 }
      );
    }
    console.log("Order Data", orderData);

    // If order doesn't exist or it's already processed, return a failure response
    if (!orderData) {
      return NextResponse.redirect(
        new URL(
          `/failed?message=Order details not found`,
          process.env.NEXT_PUBLIC_BASE_URL!
        ),
        { status: 302 }
      );
    }

    // Verify Status
    const data = await statusRequest(merchantId!, merchantTransactionId!);
    console.log("pAYMEN STatus", data);

    // If payment failed
    if (!data.success) {
      return NextResponse.redirect(
        new URL(
          `/failed?message=Payment Failed`,
          process.env.NEXT_PUBLIC_BASE_URL!
        ),
        { status: 302 }
      );
    }

    const order = await Order.create({ ...orderData, email, user: userId });

    // Create Payment record
    const payment = await Payment.create({
      orderId: order._id,
      transactionId: merchantTransactionId,
      status: "success",
      amount: parseInt(data.data.amount) / 100,
      method: data.data.paymentInstrument?.type,
      user: userId,
      email,
    });

    // Update Order Status
    order.paymentId = payment._id;
    order.status = order.orderType === "API Order" ? "success" : "pending";
    await order.save();

    // Create game order
    if (order.orderType === "API Order") {
      const orderResponse = await gameOrderRequest(order);
      if (
        orderResponse?.result === null ||
        orderResponse.message !== "success"
      ) {
        return NextResponse.redirect(
          new URL(
            `/failed?message=Top-UP Failed`,
            process.env.NEXT_PUBLIC_BASE_URL!
          ),
          { status: 302 }
        );
      }
    }

    // Update User's order history
    await User.findByIdAndUpdate(userId, {
      $push: {
        order: order._id,
      },
    });

    if (order.orderType === "Custom Order") {
      await sendEmail(email, "Order Placed", createEmailTemplate(order));
    }

    // Redirection on success
    return NextResponse.redirect(
      new URL(
        `/success?transactionId=${merchantTransactionId}&message=success`,
        process.env.NEXT_PUBLIC_BASE_URL!
      ),
      { status: 302 }
    );
  } catch (error: any) {
    console.error("Error in payment callback:", error.message);
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
