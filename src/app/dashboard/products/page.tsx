"use client";

import { useEffect, useState } from "react";
import Products from "@/components/Dashboard/Products";
import axios from "axios";
import Loader from "@/components/Loader";

const Page = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`/api/product`);
        if (res.status === 200) {
          setAllProducts(res.data);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array to run once when the component mounts

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div>
        <h1>Error Loading Products</h1>
        <p>
          We encountered an error while fetching products. Please try again
          later.
        </p>
      </div>
    );
  }

  return <Products allProducts={allProducts} />;
};

export default Page;
