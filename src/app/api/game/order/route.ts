import axios from "axios";
import { NextResponse } from "next/server";
import { z } from "zod";
import { generateSign } from "@/utils/hash";

// Define the input schema using Zod
const createOrderSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  zoneId: z.string().min(1, "Zone ID is required"),
  game: z.string().min(1, "Game is required"),
  costId: z.string().min(1, "costId is required"),
});

// Create order route
export async function POST(req: Request) {
  try {
    // Parse incoming request body
    const body = await req.json();

    // Validate input using Zod
    const parsedData = createOrderSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        {
          error: "Invalid input data",
          details: parsedData.error.errors,
        },
        { status: 400 }
      );
    }

    const { userId, zoneId, game, costId } = parsedData.data;

    // Generate timestamp for the API request
    const timestamp = Math.floor(Date.now() / 1000);

    // Build the request parameters
    const params = {
      uid: process.env.SMILE_ONE_UID!,
      email: process.env.SMILE_ONE_EMAIL!,
      userid: userId,
      zoneid: zoneId,
      product: game,
      productid: costId,
      time: timestamp,
    };

    // Generate the signature for the API request
    const sign = generateSign(params, process.env.SMILE_ONE_API_KEY!);

    // Log the request details for debugging
    console.log("Creating order with params:", params);

    // Make the API request to Smile One
    const response = await axios.post(
      `${process.env.SMILE_ONE_API_URL!}/createorder`,
      { ...params, sign },
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    // Check if the response from Smile One is successful
    if (!response.data.success) {
      return NextResponse.json(
        {
          error: "Failed to create order with Smile One",
          details: response.data,
        },
        { status: 500 }
      );
    }

    // Return the successful response data
    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    // Enhanced error handling with more context
    console.error(
      "Error in purchase API:",
      error.response?.data || error.message
    );
    return NextResponse.json(
      {
        error: "Failed to create order",
        details: error.response?.data || error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}
