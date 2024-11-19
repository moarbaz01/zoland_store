import axios from "axios";
import { NextResponse } from "next/server";
import z from "zod";
import { v4 as uuid } from "uuid";
import { generateChecksum } from "@/utils/generateChecksum";

const schema = z.object({
  amount: z.string(),
  orderId: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
  }),
});

const payRequest = async (payloadMain: string, checksum: string) => {
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
  return response;
};

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

    const { payloadMain, checksum } = generateChecksum(data);

    // Fetch API
    const response = await payRequest(payloadMain, checksum);

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
