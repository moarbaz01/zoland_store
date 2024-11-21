"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "@/components/Loader";
import CustomerEditForm from "@/components/Dashboard/Customers/CustomerEditForm";

const Page = ({ params }: { params: { customerId: string } }) => {
  const { customerId } = params;
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await axios.get(`/api/user?id=${customerId}`);
        if (res.status === 200) {
          setCustomer(res.data);
        }
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [customerId]);

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

  return <CustomerEditForm customer={customer} />;
};

export default Page;
