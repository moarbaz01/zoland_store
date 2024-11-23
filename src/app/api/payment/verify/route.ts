import { NextResponse } from "next/server";
import crypto from "crypto";
import axios from "axios";
import { Order } from "@/models/order.model";
import { Payment } from "@/models/payment.model";
import { dbConnect } from "@/lib/database";
import { User } from "@/models/user.model";
import { generateSign } from "@/utils/hash";

// Generate checksum
const generateChecksum = (
  merchantId: string,
  merchantTransactionId: string
) => {
  const string =
    `/pg/v1/status/${merchantId}/${merchantTransactionId}` +
    process.env.PHONEPE_SALT_KEY!;
  const sha256 = crypto.createHash("sha256").update(string).digest("hex");
  const checksum = sha256 + "###" + process.env.PHONEPE_SALT_INDEX!;
  return checksum;
};

// Get Status Request
const statusRequest = async (
  merchantId: string,
  merchantTransactionId: string
) => {
  console.log("merchantId", merchantId);
  console.log("merchantTransactionId", merchantTransactionId);
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
  console.log("response", response.data);
  return response.data;
};

// create game order
const gameOrderRequest = async (order: any) => {
  console.log("order", order);
  const timestamp = Math.floor(Date.now() / 1000);

  // Build the request parameters
  const params = {
    uid: process.env.SMILE_ONE_UID!,
    email: process.env.SMILE_ONE_EMAIL!,
    userid: order.gameCredentials.userId,
    zoneid: order.gameCredentials.zoneId,
    product: order.gameCredentials.game,
    productid: "13",
    time: timestamp,
  };

  // Generate the signature for the API request
  const sign = generateSign(params, process.env.SMILE_ONE_API_KEY!);

  // Log the request details for debugging
  console.log("Creating order with params:", params);

  // Make the API request to Smile One
  const res = await axios.post(
    `${process.env.SMILE_ONE_API_URL!}/createorder`,
    { ...params, sign },
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  console.log("game order response", res.data);

  if (res.data.message !== "success") {
    return null;
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
    console.log("DATA", data);
    console.log("Request URL:", req.url);
    const reqUrl = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/success`);

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
      method: data.data.paymentInstrument?.type,
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

    console.log("Order in verify", order);

    // Order response
    const orderResponse = await gameOrderRequest(order);
    console.log("Order Response", orderResponse);

    if (!orderResponse) {
      await Order.findByIdAndDelete(orderId);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/failed`
      );
    }

    await User.findByIdAndUpdate(user, {
      $push: {
        order: order._id,
      },
    });

    // Redirect to success page
    return NextResponse.redirect(reqUrl);
  } catch (error: any) {
    console.log(error);
    console.error("Error in payment callback:", error.message);
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
