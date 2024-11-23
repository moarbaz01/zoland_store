import { Order } from "@/models/order.model";
import { Product } from "@/models/product.model";
import { User } from "@/models/user.model";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // If the user is not authenticated, return Unauthorized
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" });
    }
    const orders = await Order.countDocuments();
    const products = await Product.countDocuments();
    const customers = await User.countDocuments();

    // Calculate total revenue
    const totalRevenue = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: { $toDouble: "$amount" } },
        },
      },
    ]);
    const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

    // Aggregate monthly sales
    const monthlySales = await Order.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" }, // Extract the month from the `createdAt` field
          amount: { $toDouble: "$amount" }, // Convert amount to a number
        },
      },
      {
        $group: {
          _id: "$month", // Group by month
          totalSales: { $sum: "$amount" }, // Sum the sales for the month
          totalOrders: { $count: {} }, // Count the orders for the month
        },
      },
      {
        $sort: { _id: 1 }, // Sort by month (January = 1, February = 2, etc.)
      },
    ]);

    // Format the monthly sales data
    const formattedMonthlySales = monthlySales.map((item) => ({
      month: item._id, // Month number
      totalSales: item.totalSales,
      totalOrders: item.totalOrders,
    }));

    // Aggregate the data into a single object
    const data = {
      orders,
      products,
      customers,
      revenue,
      monthlySales: formattedMonthlySales,
    };

    // Respond with the aggregated data
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { message: "Failed to fetch analytics", error },
      { status: 500 }
    );
  }
}
