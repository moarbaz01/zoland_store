import axios from "axios";
import { NextResponse } from "next/server";
import { generateSign } from "@/utils/hash";

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse incoming request body
    const { userId, zoneId, product, productId, amount } = body;

    if (!userId || !zoneId || !product || !productId || !amount) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const timestamp = Math.floor(Date.now() / 1000); // Current Unix timestamp

    // Build request parameters
    const params = {
      uid: process.env.SMILE_ONE_UID!,
      email: process.env.SMILE_ONE_EMAIL!,
      userid: userId,
      zoneid: zoneId,
      product,
      productid: productId,
      time: timestamp,
    };

    // Generate the sign
    const sign = generateSign(params, process.env.SMILE_ONE_API_KEY!);

    // Make the API request
    const response = await axios.post(
      `${process.env.SMILE_ONE_API_URL!}/createorder`,
      { ...params, sign },
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    console.error("Purchase API Error:", error.response?.data || error.message);
    return NextResponse.json(
      {
        error: "Failed to create order",
        details: error.response?.data || error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}
