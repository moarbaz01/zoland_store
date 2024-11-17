import axios from "axios";
import { NextResponse } from "next/server";
import z from "zod";
import sha256 from "crypto-js/sha256";
import { v4 as uuid } from "uuid";

const schema = z.object({
  amount: z.string(),
  orderId: z.string(),
  user: z.any(),
});

// Create PhonePe payment
export async function POST(req: Request) {
  try {
    const result = schema.safeParse({
      ...(await req.json()),
    });

    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid request", error: result.error.errors },
        { status: 400 }
      );
    }

    const { amount, orderId, user } = result.data;
    const transactionId = uuid().slice(10).replaceAll("-", "");

    const data = {
      name: user?.name,
      amount: parseInt(amount) * 100,
      merchantId: process.env.PHONEPE_MERCHANT_ID!,
      merchantTransactionId: `T${transactionId}`,
      merchantUserId: `M${user?.name}${user?.id}`,
      redirectUrl: `${process.env
        .NEXT_PUBLIC_BASE_URL!}/api/payment/verify?merchantTransactionId=T${transactionId}&orderId=${orderId}&user=${
        user.id
      }&email=${user.email}`,
      redirectMode: "POST",
      paymentInstrument: { type: "PAY_PAGE" },
    };

    // Create Checksum
    const payload = JSON.stringify(data);
    const payloadMain = Buffer.from(payload).toString("base64");
    const string = payloadMain + "/pg/v1/pay" + process.env.PHONEPE_SALT_KEY;
    const checksum =
      sha256(string).toString() + "###" + process.env.PHONEPE_SALT_INDEX;
    console.log("payloadMain : ", payloadMain);

    // Fetch API
    const response = await axios.post(
      `${process.env.PHONEPE_BASE_URL}/pg/v1/pay`,
      {
        request: payloadMain,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
        },
      }
    );

    // Log Response
    console.log("response ", response.data);

    // Return Response
    return NextResponse.json(
      { message: "Payment created successfully", data: response.data },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PhonePe Error:", error.response?.data || error.message);
    return NextResponse.json(
      {
        message: "Something went wrong",
        error: error.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}
