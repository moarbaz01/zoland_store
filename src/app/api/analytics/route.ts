import { Order } from "@/models/order.model";
import { Product } from "@/models/product.model";
import { User } from "@/models/user.model";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const orders = await Order.countDocuments();
    const products = await Product.countDocuments();
    const customers = await User.countDocuments();
    const totalRevenue = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: { $toDouble: "$amount" } },
        },
      },
    ]);
    const totalOrders = await Order.find();
    console.log("Total Orders", totalOrders);
    console.log("Total Revenue", totalRevenue);
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

    // Respond with aggregated data
    return NextResponse.json(
      {
        orders,
        products,
        customers,
        revenue,
        monthlySales: formattedMonthlySales,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { message: "Failed to fetch analytics", error },
      { status: 500 }
    );
  }
}
