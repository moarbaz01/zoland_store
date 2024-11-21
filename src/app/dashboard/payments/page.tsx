"use client";

import { useEffect, useState } from "react";
import Payments from "@/components/Dashboard/Payments";
import Loader from "@/components/Loader";

const Page = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment`);
        if (!res.ok) {
          throw new Error(`Failed to fetch data: ${res.statusText}`);
        }
        const data = await res.json();
        setPayments(data);
      } catch (err) {
        setError(err.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div>
        <h1>Failed to Load Payments</h1>
        <p>{error}</p>
      </div>
    );
  }

  return <Payments allPayments={payments} />;
};

export default Page;
