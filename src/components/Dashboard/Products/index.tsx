"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import axios from "axios";

const Products = () => {
  const router = useRouter();
  const initialProducts = [
    {
      id: "1",
      name: "Small Pack",
      description:
        "🔥Instant Delivery🔥Indonesian accounts will not be credited❌",
      isApi: true,
      region: "brazil",
      game: "mobilelegends",
      apiName: "Smile One Api",
      image: "/images/small-pack.jpg",
      isDeleted: false,
      category: "game",
      cost: [
        { id: "212", amount: "11 Diamonds", price: "20" },
        { id: "213", amount: "22 Diamonds", price: "40" },
      ],
    },
    // Add more products here if needed
  ];

  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/products/product/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return toast.error("Product not deleted");
    }
    const endpoint = `/api/product?id=${id}`;

    // Api Request
    try {
      const response = await axios.delete(endpoint);
      if (response.status === 200) {
        toast.success("Product deleted successfully");
        setProducts(products.filter((product) => product.id !== id));
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  // Filter products based on search input
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.id.includes(search)
  );

  return (
    <div className="md:pl-72 p-6 min-h-screen bg-gray-900">
      <h1 className="text-2xl font-bold text-white mb-6">Products</h1>

      {/* Search Input */}
      <div className="mb-6">
        <TextField
          fullWidth
          label="Search by Name or ID"
          variant="outlined"
          value={search}
          onChange={handleSearch}
          sx={{
            color: "#E5E7EB",
            backgroundColor: "#374151",
            borderRadius: "10px",
          }}
        />
      </div>

      <div className="mb-6">
        <button
          onClick={() => router.push("/dashboard/products/product")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add New Product <Add />
        </button>
      </div>

      {/* Products Table */}
      <TableContainer className="bg-gray-800 rounded-xl">
        <Table>
          <TableHead className="bg-gray-600">
            <TableRow>
              <TableCell style={{ color: "#E5E7EB" }}>Image</TableCell>
              <TableCell style={{ color: "#E5E7EB" }}>ID</TableCell>
              <TableCell style={{ color: "#E5E7EB" }}>Name</TableCell>
              <TableCell style={{ color: "#E5E7EB" }}>Description</TableCell>
              <TableCell style={{ color: "#E5E7EB" }}>Category</TableCell>
              <TableCell style={{ color: "#E5E7EB" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Image
                      src={product.image}
                      alt={product.name}
                      className="object-cover rounded-md"
                      width={50}
                      height={50}
                    />
                  </TableCell>
                  <TableCell sx={{ color: "#D1D5DB" }}>{product.id}</TableCell>
                  <TableCell sx={{ color: "#D1D5DB" }}>
                    {product.name}
                  </TableCell>
                  <TableCell sx={{ color: "#D1D5DB" }}>
                    {product.description}
                  </TableCell>
                  <TableCell sx={{ color: "#D1D5DB" }}>
                    {product.category}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleEdit(product.id)}
                      sx={{ color: "#60A5FA" }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(product.id)}
                      sx={{ color: "#EF4444" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ color: "#D1D5DB" }}>
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Products;
