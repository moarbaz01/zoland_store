"use client";

import { useEffect, useState } from "react";
import Orders from "@/components/Dashboard/Orders";
import Loader from "@/components/Loader";

const Page = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order`);
        if (!res.ok) {
          throw new Error(`Failed to fetch data: ${res.statusText}`);
        }
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError(err.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div>
        <h1>Failed to Load Orders</h1>
        <p>{error}</p>
      </div>
    );
  }

  return <Orders allOrders={orders} />;
};

export default Page;
