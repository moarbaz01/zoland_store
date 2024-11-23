"use client";
import { useEffect, useState } from "react";
import Customers from "@/components/Dashboard/Customers";
import { notFound } from "next/navigation";
import Loader from "@/components/Loader";

const Page = () => {
  const [customers, setCustomers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch customers data on the client side using useEffect
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch customers");
        }
        const data = await res.json();
        setCustomers(data);
      } catch (error) {
        console.log(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []); // Empty dependency array to run this effect only once on mount

  if (loading) {
    return <Loader />;
  }

  if (error || !customers) {
    notFound(); // Trigger the 404 page if customers data is not found
    return null;
  }

  return <Customers allCustomers={customers} />;
};

export default Page;
