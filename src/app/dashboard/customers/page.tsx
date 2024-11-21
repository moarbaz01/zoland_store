"use client";

import { useEffect, useState } from "react";
import Customers from "@/components/Dashboard/Customers";
import Loader from "@/components/Loader";

const Page = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`);
        const data = await res.json();
        setCustomers(data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div>
      {loading ? (
        <Loader/>
      ) : (
        <Customers allCustomers={customers} />
      )}
    </div>
  );
};

export default Page;
