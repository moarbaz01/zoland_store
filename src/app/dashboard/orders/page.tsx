"use client";
import { useEffect, useState } from "react";
import Orders from "@/components/Dashboard/Orders";
import Loader from "@/components/Loader";

const Page = () => {
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders data on the client side using useEffect
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.log(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []); // Empty dependency array to run this effect only once on mount

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error loading orders</div>; // Display error if there's an issue fetching data
  }

  return <Orders allOrders={orders} />;
};

export default Page;
