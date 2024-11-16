import axios from "axios";
import { generateSign } from "../../../utils/hash";
import { NextResponse } from "next/server";

const API_URL = "https://www.smile.one/smilecoin/api/createorder";
const API_KEY = "250ac95f38bf87fbd07c6550a42bd5b4";
const UID = "2110039"; // Smile One UID
const EMAIL = "htlianahmar@gmail.com"; // Smile One email

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse incoming request body
    const { userid, zoneid, product, productid } = body;

    if (!userid || !zoneid || !product || !productid) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const timestamp = Math.floor(Date.now() / 1000); // Current Unix timestamp

    // Build request parameters
    const params = {
      uid: UID,
      email: EMAIL,
      userid,
      zoneid,
      product,
      productid,
      time: timestamp,
    };
    console.log("Params : ", params);

    // Generate the sign
    const sign = generateSign(params, API_KEY);
    console.log(params, sign);

    // Make the API request
    const response = await axios.post(
      API_URL,
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
