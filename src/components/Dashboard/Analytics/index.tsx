"use client";

import React, { useEffect, useState } from "react";
import { FaShoppingCart, FaBox, FaUsers, FaRupeeSign } from "react-icons/fa";
import toast from "react-hot-toast";
import { CircularProgress } from "@mui/material";
import axios from "axios";

interface AnalyticsData {
  orders: number | null;
  products: number | null;
  customers: number | null;
  revenue: number | null;
}

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    orders: null,
    products: null,
    customers: null,
    revenue: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/api/analytics`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status !== 200) {
          toast.error("Failed to fetch analytics data. Please try again.");
        }
        const data = response.data;
        setAnalyticsData(data);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        toast.error("Failed to fetch analytics data. Please try again.");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="md:pl-72 md:py-6 md:px-6 px-4 min-h-screen bg-gray-900">
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
              {analyticsData.orders !== null ? (
                analyticsData.orders
              ) : (
                <CircularProgress size={12} />
              )}
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
              {analyticsData.products !== null ? (
                analyticsData.products
              ) : (
                <CircularProgress size={12} />
              )}
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
              {analyticsData.customers !== null ? (
                analyticsData.customers
              ) : (
                <CircularProgress size={12} />
              )}
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
              {analyticsData.revenue !== null ? (
                `₹ ${analyticsData.revenue.toFixed(2)}`
              ) : (
                <CircularProgress size={12} />
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
