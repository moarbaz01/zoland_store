import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { v4 as uuid } from "uuid";
import { generateChecksum } from "@/utils/generateChecksum";
import { getToken } from "next-auth/jwt";
import { Payment } from "@/models/payment.model"; // Import your Payment model

const schema = z.object({
  amount: z.string(),
  costId: z.string().min(1, "Cost ID is required"),
  orderDetails: z.string(), // Accepts any object
  orderType: z.string(),
  region: z.string().optional(),
  gameCredentials: z
    .object({
      userId: z.string().optional(),
      zoneId: z.string().optional(),
      game: z.string().optional(),
    })
    .optional(),
  paymentId: z.string().nullable().optional(),
  product: z.string().optional(), // Product ID reference
  status: z.enum(["pending", "success", "failed"]).optional(),
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
export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // If the user is not authenticated, return Unauthorized
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" });
    }
    const id = token.id as string;
    const name = token.name as string;
    const email = token.email as string;

    const result = schema.safeParse({
      ...(await req.json()),
    });

    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid request", error: result.error.errors },
        { status: 400 }
      );
    }

    const body = result.data;
    // convert body into string
    const bodyString = encodeURIComponent(JSON.stringify(body));

    // Use full UUID for transaction ID
    const transactionId = uuid().replace(/-/g, "").slice(0, 8);

    // Check if the transaction ID already exists in the database
    const existingPayment = await Payment.findOne({
      transactionId, // You can also check by merchantTransactionId if needed
    });

    if (existingPayment) {
      return NextResponse.json(
        { message: "Duplicate transaction detected" },
        { status: 400 }
      );
    }

    const data = {
      name: name,
      amount: parseInt(body.amount) * 100,
      merchantId: process.env.PHONEPE_MERCHANT_ID!,
      merchantTransactionId: `T${transactionId}`,
      merchantUserId: `M${name}${id}`,
      redirectUrl: `${process.env
        .NEXT_PUBLIC_BASE_URL!}/api/payment/verify?merchantTransactionId=T${transactionId}&order=${bodyString}&userId=${id}&email=${email}`,
      redirectMode: "POST",
      paymentInstrument: { type: "PAY_PAGE" },
    };

    console.log("CheckSum Data", data);

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
