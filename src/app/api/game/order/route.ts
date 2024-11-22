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
    

    // Check if the response from Smile One is successful
    if (response.data.message !== "success") {
      return NextResponse.json(
        {
          error: "Failed to create order with Smile One",
          details: response.data,
        },
        { status: 500 }
      );
    }
    console.log("Order created successfully:", response.data);

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
