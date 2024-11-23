"use client";
import { useEffect, useState } from "react";
import Products from "@/components/Dashboard/Products";
import Loader from "@/components/Loader";

const Page = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products data on the client side using useEffect
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product`, {
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await res.json();
        setAllProducts(data);
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array to ensure it runs only once when the component mounts

  if (loading) {
    return <Loader />;
  }

  if (error || !allProducts) {
    return <div>Error loading products</div>;
  }

  return <Products allProducts={allProducts} />;
};

export default Page;
