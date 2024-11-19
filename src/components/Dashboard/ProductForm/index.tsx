"use client";

import React, { useState, useEffect } from "react";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Paper,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import axios from "axios";
import toast from "react-hot-toast";

interface CostItem {
  id: string;
  amount: string;
  price: string;
}

interface Product {
  name: string;
  description: string;
  isApi: boolean;
  region: string;
  game: string;
  apiName: string;
  image: string | File | null; // URL or File
  isDeleted: boolean;
  category: string;
  cost: CostItem[];
  stock: boolean; // Stock as boolean
}

const ProductForm = ({ product }: { product?: Product }) => {
  const [formData, setFormData] = useState<Product>({
    name: product?.name || "",
    description: product?.description || "",
    isApi: product?.isApi || false,
    region: product?.region || "", // Region field
    game: product?.game || "",
    apiName: product?.apiName || "",
    image: product?.image || null,
    isDeleted: product?.isDeleted || false,
    category: product?.category || "",
    cost: product?.cost || [{ id: "", amount: "", price: "" }],
    stock: product?.stock || false, // Stock as boolean
  });
  console.log(formData);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Preload image preview if it's a string URL
  useEffect(() => {
    if (formData.image && typeof formData.image === "string") {
      setImagePreview(formData.image);
    }
  }, [formData.image]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData((prev) => ({ ...prev, [name]: value as string }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  // Cost item handling
  const handleCostChange = (index: number, field: string, value: string) => {
    const updatedCosts = formData.cost;
    updatedCosts[index][field as keyof CostItem] = value;
    console.log(updatedCosts);
    setFormData((prev) => ({ ...prev, cost: updatedCosts }));
  };

  const handleAddCost = () => {
    setFormData((prev) => ({
      ...prev,
      cost: [...prev.cost, { id: "", amount: "", price: "" }],
    }));
  };

  const handleRemoveCost = (index: number) => {
    const updatedCosts = [...formData.cost];
    updatedCosts.splice(index, 1);
    setFormData((prev) => ({ ...prev, cost: updatedCosts }));
  };

  const handleSubmit = async () => {
    const endpoint = `/api/product`;

    // Form data for the request
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("isApi", JSON.stringify(formData.isApi));
    data.append("region", formData.region); // Include region in the request
    data.append("game", formData.game);
    data.append("apiName", formData.apiName);
    if (formData.image && typeof formData.image !== "string") {
      data.append("image", formData.image);
    }
    data.append("isDeleted", JSON.stringify(formData.isDeleted));
    data.append("category", formData.category);
    data.append("stock", formData.stock.toString());
    data.append("cost", JSON.stringify(formData.cost));

    try {
      const response = await axios({
        method: product ? "PUT" : "POST",
        url: endpoint,
        data: data,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const result = response.data;
      console.log(result);
      toast.success("Product saved successfully");
    } catch (error) {
      console.log("Error:", error);
      toast.error("Failed to save product");
    }
  };

  return (
    <div className="md:pl-72 p-6 min-h-screen bg-gray-900">
      <h1 className="text-2xl font-bold text-white mb-6">
        {product ? "Edit Product" : "Create Product"}
      </h1>
      <Paper
        className="p-6"
        sx={{ backgroundColor: "#374151", color: "#D1D5DB" }}
      >
        <form>
          {/* Name */}
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
            sx={{ color: "#E5E7EB", backgroundColor: "#1F2937" }}
          />

          {/* Description */}
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            margin="normal"
            multiline
            rows={4}
            variant="outlined"
            sx={{ color: "#E5E7EB", backgroundColor: "#1F2937" }}
          />

          {/* Is API */}
          <FormControlLabel
            control={
              <Checkbox
                name="isApi"
                checked={formData.isApi}
                onChange={handleCheckboxChange}
                sx={{ color: "#E5E7EB" }}
              />
            }
            label="Is API"
            sx={{ color: "#D1D5DB" }}
          />

          {/* API Name (Select) */}
          <Select
            fullWidth
            name="apiName"
            value={formData.apiName}
            onChange={handleSelectChange}
            displayEmpty
            sx={{
              margin: "16px 0",
              backgroundColor: "#1F2937",
              color: "#E5E7EB",
            }}
          >
            <MenuItem value="">Select API Name</MenuItem>
            <MenuItem value="Smile One Api">Smile One Api</MenuItem>
          </Select>

          {/* Region (Select) */}
          <Select
            fullWidth
            name="region"
            value={formData.region}
            onChange={handleSelectChange}
            displayEmpty
            sx={{
              margin: "16px 0",
              backgroundColor: "#1F2937",
              color: "#E5E7EB",
            }}
          >
            <MenuItem value="">Select Region</MenuItem>
            <MenuItem value="brazil">Brazil</MenuItem>
            <MenuItem value="phillipins">Phillipins</MenuItem>
          </Select>

          {/* Stock (Boolean) */}
          <FormControlLabel
            control={
              <Checkbox
                name="stock"
                checked={formData.stock}
                onChange={handleCheckboxChange}
                sx={{ color: "#E5E7EB" }}
              />
            }
            label="In Stock"
            sx={{ color: "#D1D5DB" }}
          />

          {/* Image Upload */}
          <div className="mb-4">
            <input
              type="file"
              onChange={handleImageUpload}
              accept="image/*"
              className="mb-2"
            />
            {imagePreview && (
              <img src={imagePreview} alt="Image Preview" width="100" />
            )}
            {formData.image && typeof formData.image !== "string" && (
              <Button
                onClick={handleRemoveImage}
                color="secondary"
                variant="contained"
                className="mt-2"
              >
                Remove Image
              </Button>
            )}
          </div>

          {/* Category */}
          <Select
            fullWidth
            name="category"
            value={formData.category}
            onChange={handleSelectChange}
            displayEmpty
            sx={{
              margin: "16px 0",
              backgroundColor: "#1F2937",
              color: "#E5E7EB",
            }}
          >
            <MenuItem value="">Select Category</MenuItem>
            <MenuItem value="game">Game</MenuItem>
          </Select>

          {/* Cost Items */}
          {formData.cost.map((costItem, index) => (
            <div key={index} className="mb-4">
              {/* ID Input */}
              <TextField
                fullWidth
                label="ID"
                value={costItem.id}
                onChange={(e) => handleCostChange(index, "id", e.target.value)}
                margin="normal"
                variant="outlined"
                sx={{ color: "#E5E7EB", backgroundColor: "#1F2937" }}
              />
              {/* Amount Input */}
              <TextField
                fullWidth
                label="Amount"
                value={costItem.amount}
                onChange={(e) =>
                  handleCostChange(index, "amount", e.target.value)
                }
                margin="normal"
                variant="outlined"
                sx={{ color: "#E5E7EB", backgroundColor: "#1F2937" }}
              />
              {/* Price Input */}
              <TextField
                fullWidth
                label="Price"
                value={costItem.price}
                onChange={(e) =>
                  handleCostChange(index, "price", e.target.value)
                }
                margin="normal"
                variant="outlined"
                sx={{ color: "#E5E7EB", backgroundColor: "#1F2937" }}
              />
              {/* Remove Cost Item Button */}
              <Button
                onClick={() => handleRemoveCost(index)}
                color="secondary"
                variant="contained"
                className="mt-2"
              >
                <Delete />
              </Button>
            </div>
          ))}
          <Button
            onClick={handleAddCost}
            color="primary"
            variant="contained"
            className="mb-4 bg-white "
          >
            Add Cost Item
          </Button>

          {/* Submit Button */}
          <div>
            <Button onClick={handleSubmit} color="primary" variant="contained">
              Submit
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
};

export default ProductForm;
