"use client";

import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import {
  FaShoppingCart,
  FaBox,
  FaUsers,
  FaDollarSign,
  FaRupeeSign,
} from "react-icons/fa";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    orders: 0,
    products: 0,
    customers: 0,
    revenue: 0,
    monthlySales: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/analytics");
        const data = await response.json();
        console.log("Analytics data:", data);
        setAnalyticsData(data);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    };

    fetchData();
  }, []);

  const barData = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Sales (₹)",
        data: analyticsData.monthlySales.map((item) => item.totalSales || 0),
        backgroundColor: "#34D399",
      },
    ],
  };

  return (
    <div className="md:pl-72 p-6 min-h-screen bg-gray-900">
      <h1 className="text-2xl font-bold text-gray-100 mb-6">
        Analytics Dashboard
      </h1>

      {/* Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-4 bg-gray-800 shadow rounded-lg flex items-center space-x-4">
          <div className="bg-blue-500 p-3 rounded-full text-white">
            <FaShoppingCart size={24} />
          </div>
          <div>
            <h2 className="text-gray-400">Orders</h2>
            <p className="text-3xl font-semibold text-gray-100">
              {analyticsData.orders}
            </p>
          </div>
        </div>
        <div className="p-4 bg-gray-800 shadow rounded-lg flex items-center space-x-4">
          <div className="bg-yellow-500 p-3 rounded-full text-white">
            <FaBox size={24} />
          </div>
          <div>
            <h2 className="text-gray-400">Products</h2>
            <p className="text-3xl font-semibold text-gray-100">
              {analyticsData.products}
            </p>
          </div>
        </div>
        <div className="p-4 bg-gray-800 shadow rounded-lg flex items-center space-x-4">
          <div className="bg-green-500 p-3 rounded-full text-white">
            <FaUsers size={24} />
          </div>
          <div>
            <h2 className="text-gray-400">Customers</h2>
            <p className="text-3xl font-semibold text-gray-100">
              {analyticsData.customers}
            </p>
          </div>
        </div>
        <div className="p-4 bg-gray-800 shadow rounded-lg flex items-center space-x-4">
          <div className="bg-indigo-500 p-3 rounded-full text-white">
            <FaRupeeSign size={24} />
          </div>
          <div>
            <h2 className="text-gray-400">Total Sales</h2>
            <p className="text-3xl font-semibold text-gray-100">
              ₹{analyticsData.revenue}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Bar Chart */}
        <div className="p-6 bg-gray-800 shadow rounded-lg">
          <h3 className="text-lg font-bold text-gray-100 mb-4">
            Monthly Sales
          </h3>
          <Bar
            data={barData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  labels: {
                    color: "#E5E7EB", // Gray-100
                  },
                },
              },
              scales: {
                x: {
                  ticks: {
                    color: "#E5E7EB",
                  },
                },
                y: {
                  ticks: {
                    color: "#E5E7EB",
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
