"use client";

import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import axios from "axios";
import OrderView from "@/components/Dashboard/Orders/OrderView";

const Page = ({ params }: { params: { orderId: string } }) => {
  const { orderId } = params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`/api/order?id=${orderId}`);
        if (response.data) {
          setOrder(response.data);
        }
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  return <OrderView order={order} />;
};

export default Page;
