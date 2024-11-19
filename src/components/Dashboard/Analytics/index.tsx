"use client";

import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { FaShoppingCart, FaBox, FaUsers, FaDollarSign } from "react-icons/fa";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
);

const Analytics = () => {
  const sidebarWidth = 64; // Adjust this according to your sidebar width in pixels

  // Dummy data
  const stats = {
    orders: 1200,
    products: 340,
    customers: 850,
    totalSales: "$85,000",
  };

  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Sales ($)",
        data: [5000, 8000, 6000, 9000, 12000, 15000],
        backgroundColor: "#34D399",
      },
    ],
  };

  const pieData = {
    labels: ["Electronics", "Clothing", "Accessories", "Books"],
    datasets: [
      {
        label: "Product Distribution",
        data: [40, 30, 20, 10],
        backgroundColor: ["#5755FE", "#F59E0B", "#34D399", "#3B82F6"],
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
              {stats.orders}
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
              {stats.products}
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
              {stats.customers}
            </p>
          </div>
        </div>
        <div className="p-4 bg-gray-800 shadow rounded-lg flex items-center space-x-4">
          <div className="bg-indigo-500 p-3 rounded-full text-white">
            <FaDollarSign size={24} />
          </div>
          <div>
            <h2 className="text-gray-400">Total Sales</h2>
            <p className="text-3xl font-semibold text-gray-100">
              {stats.totalSales}
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

        {/* Product Distribution Pie Chart */}
        <div className="p-6 bg-gray-800 shadow rounded-lg">
          <h3 className="text-lg font-bold text-gray-100 mb-4">
            Product Distribution
          </h3>
          <Pie
            data={pieData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  labels: {
                    color: "#E5E7EB", // Gray-100
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
