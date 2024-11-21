"use client";

import { useEffect, useState } from "react";
import ProductForm from "@/components/Dashboard/ProductForm";
import Loader from "@/components/Loader";
import axios from "axios";

const Page = ({ params }: { params: { productId: string } }) => {
  const { productId } = params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/product?id=${productId}`);
        if (response.data) {
          setProduct(response.data);
        }
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

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

  return <ProductForm product={product} />;
};

export default Page;
