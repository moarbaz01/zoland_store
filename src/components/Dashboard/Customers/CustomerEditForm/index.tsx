"use client";

import React, { useState } from "react";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  SelectChangeEvent,
} from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";

interface CustomerEditFormProps {
  customer?: {
    _id: string;
    name: string;
    role: string;
    isDeleted: boolean;
    isBlocked: boolean;
  };
}

const CustomerEditForm: React.FC<CustomerEditFormProps> = ({ customer }) => {
  const [formData, setFormData] = useState({
    _id: customer?._id || "",
    name: customer?.name || "",
    role: customer?.role || "user",
    isDeleted: customer?.isDeleted || false,
    isBlocked: customer?.isBlocked || false,
  });

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

  const handleRoleChange = (e: SelectChangeEvent<string>) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, role: value as string }));
  };

  const handleSubmit = async () => {
    const isConfirm = confirm("Are you sure?");
    if (!isConfirm) return;

    // New endpoint
    const endpoint = `/api/users/$${formData._id}`;

    // Response
    const res = await axios.put(
      endpoint,
      {
        name: formData.name,
        role: formData.role,
        isDeleted: formData.isDeleted,
        isBlocked: formData.isBlocked,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (res.status === 200) {
      toast.success("Customer updated successfully!");
    } else {
      toast.error("Failed to update customer.");
    }
  };

  return (
    <div className="md:pl-72 p-6 min-h-screen bg-gray-900">
      <h1 className="text-2xl font-bold text-white mb-6">
        {customer ? "Edit Customer" : "Create Customer"}
      </h1>
      <Paper
        className="p-6"
        style={{ backgroundColor: "#374151", color: "#D1D5DB" }}
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

          {/* Role */}
          <FormControl fullWidth margin="normal">
            <InputLabel style={{ color: "#D1D5DB" }}>Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleRoleChange}
              sx={{ color: "#E5E7EB", backgroundColor: "#1F2937" }}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>

          {/* Is Deleted */}
          <FormControlLabel
            control={
              <Checkbox
                name="isDeleted"
                checked={formData.isDeleted}
                onChange={handleCheckboxChange}
                sx={{ color: "#E5E7EB" }}
              />
            }
            label="Is Deleted"
            sx={{ color: "#D1D5DB" }}
          />

          {/* Is Blocked */}
          <FormControlLabel
            control={
              <Checkbox
                name="isBlocked"
                checked={formData.isBlocked}
                onChange={handleCheckboxChange}
                sx={{ color: "#E5E7EB" }}
              />
            }
            label="Is Blocked"
            sx={{ color: "#D1D5DB" }}
          />

          {/* Submit Button */}
          <div className="mt-4">
            <Button
              onClick={handleSubmit}
              color="primary"
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#6366F1",
                color: "#FFFFFF",
              }}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
};

export default CustomerEditForm;
