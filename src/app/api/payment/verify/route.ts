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

// Game Order Request
const gameOrderRequest = async (order: any) => {
  const timestamp = Math.floor(Date.now() / 1000);

  // Extract, flatten, and sort all prices (duplicates allowed)
  const costIds = order.costId.split("&");

  console.log("costIds", costIds, order.costId);

  // Prepare API URL based on the region
  const apiUrl =
    order.region === "brazil"
      ? "https://www.smile.one/smilecoin/api/createorder"
      : "https://www.smile.one/ph/smilecoin/api/createorder";

  const responses = await Promise.all(
    costIds.map(async (cost) => {
      const params = {
        uid: process.env.SMILE_ONE_UID!,
        email: process.env.SMILE_ONE_EMAIL!,
        userid: order.gameCredentials.userId,
        zoneid: order.gameCredentials.zoneId,
        product: order.gameCredentials.game,
        productid: cost.toString(),
        time: timestamp,
      };

      const sign = generateSign(params, process.env.SMILE_ONE_API_KEY);

      try {
        const res = await axios.post(
          apiUrl,
          { ...params, sign },
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );
        return { status: res.data.status, data: res.data }; // Success
      } catch (error: any) {
        return { status: 500, error: error.message, cost }; // Failure
      }
    })
  );

  // Find a successful response or handle failures
  const successResponse = responses.find((res) => res.status === 200);
  if (successResponse) {
    return successResponse;
  }

  return { status: 302, message: "All requests failed.", responses };
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
    console.log("Payment Status", data);

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

    // Create game order
    if (order.orderType === "API Order") {
      const orderResponse = await gameOrderRequest(order);
      if (orderResponse.status !== 200) {
        order.paymentId = payment._id;
        order.status = "failed";
        await order.save();
        return NextResponse.redirect(
          new URL(
            `/failed?message=Top-UP Failed`,
            process.env.NEXT_PUBLIC_BASE_URL!
          ),
          { status: 302 }
        );
      }
    }

    // Update Order Status
    order.paymentId = payment._id;
    order.status = order.orderType === "API Order" ? "success" : "pending";
    await order.save();

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
