"use client";
import { useEffect, useState } from "react";
import Payments from "@/components/Dashboard/Payments";
import Loader from "@/components/Loader";

const Page = () => {
  const [payments, setPayments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch payment data on the client side using useEffect
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch payments");
        }

        const data = await res.json();
        setPayments(data);
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []); // Empty dependency array to ensure it runs only once when the component mounts

  if (loading) {
    return <Loader />;
  }

  if (error || !payments) {
    return <div>Error loading payments</div>;
  }

  return <Payments allPayments={payments} />;
};

export default Page;
