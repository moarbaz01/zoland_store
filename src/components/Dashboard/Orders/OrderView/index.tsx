"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  Divider,
  SelectChangeEvent,
} from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";

interface Order {
  _id: string;
  createdAt: string;
  email: string;
  product: { name: string };
  status: string;
  orderType: string;
  gameCredentials: {
    zoneId: string;
    userId: string;
    game: string;
  };
  amount: string;
  orderDetails: string;
}

const OrderView = ({ order }: { order: Order }) => {
  const [status, setStatus] = useState(order.status);

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setStatus(event.target.value as string);
  };

  const handleStatusUpdate = async () => {
    if (status === order.status) return;
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/order?id=${order._id}`,
        {
          status,
        }
      );
      setStatus(order.status === "pending" ? "success" : "pending");
      toast.success("Status updated successfully");
    } catch (error) {
      toast.error("Error updating status");
    }
  };

  return (
    <div className="md:pl-72 p-6 min-h-screen bg-gray-900">
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          marginBottom: "24px",
        }}
      >
        Order Details
      </Typography>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Order Details Section */}
        <Box
          sx={{
            flex: "1",
            backgroundColor: "#2D3748",
            padding: "16px",
            borderRadius: "8px",
            maxWidth: "600px",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              marginBottom: "16px",
            }}
          >
            Order Information
          </Typography>
          <Divider sx={{ backgroundColor: "#4A5568", marginBottom: "16px" }} />

          <div className="flex flex-col gap-6">
            <Box
              sx={{
                display: "table",
                width: "100%",
                backgroundColor: "#F7FAFC", // Light background for the table
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
              }}
            >
              {/* Table Header */}
              <Box
                sx={{
                  display: "table-row",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                <Box
                  sx={{
                    display: "table-cell",
                    padding: "12px",
                    borderBottom: "2px solid #CBD5E0",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "18px",
                      color: "#2D3748",
                      fontWeight: "bold",
                      textWrap: "nowrap",
                    }}
                  >
                    Order ID
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "table-cell",
                    padding: "12px",
                    borderBottom: "2px solid #CBD5E0",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontSize: "18px", color: "#4A5568" }}
                  >
                    {order._id}
                  </Typography>
                </Box>
              </Box>

              {/* Order Details */}
              <Box sx={{ display: "table-row", marginBottom: "10px" }}>
                <Box
                  sx={{
                    display: "table-cell",
                    padding: "12px",
                    borderBottom: "1px solid #CBD5E0",
                    fontWeight: "bold",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontSize: "16px", color: "#4A5568" }}
                  >
                    Email
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "table-cell",
                    padding: "12px",
                    borderBottom: "1px solid #CBD5E0",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontSize: "16px", color: "#4A5568" }}
                  >
                    {order.email}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "table-row", marginBottom: "10px" }}>
                <Box
                  sx={{
                    display: "table-cell",
                    padding: "12px",
                    borderBottom: "1px solid #CBD5E0",
                    fontWeight: "bold",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontSize: "16px", color: "#4A5568" }}
                  >
                    Product
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "table-cell",
                    padding: "12px",
                    borderBottom: "1px solid #CBD5E0",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontSize: "16px", color: "#4A5568" }}
                  >
                    {order.product.name ?? "Normal Pack"}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "table-row", marginBottom: "10px" }}>
                <Box
                  sx={{
                    display: "table-cell",
                    padding: "12px",
                    borderBottom: "1px solid #CBD5E0",
                    fontWeight: "bold",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontSize: "16px", color: "#4A5568" }}
                  >
                    Status
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "table-cell",
                    padding: "12px",
                    borderBottom: "1px solid #CBD5E0",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontSize: "16px", color: "#4A5568" }}
                  >
                    {status}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "table-row", marginBottom: "10px" }}>
                <Box
                  sx={{
                    display: "table-cell",
                    padding: "12px",
                    borderBottom: "1px solid #CBD5E0",
                    fontWeight: "bold",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontSize: "16px", color: "#4A5568" }}
                  >
                    Order Type
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "table-cell",
                    padding: "12px",
                    borderBottom: "1px solid #CBD5E0",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontSize: "16px", color: "#4A5568" }}
                  >
                    {order.orderType}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "table-row", marginBottom: "10px" }}>
                <Box
                  sx={{
                    display: "table-cell",
                    padding: "12px",
                    borderBottom: "1px solid #CBD5E0",
                    fontWeight: "bold",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontSize: "16px", color: "#4A5568" }}
                  >
                    Zone ID
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "table-cell",
                    padding: "12px",
                    borderBottom: "1px solid #CBD5E0",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontSize: "16px", color: "#4A5568" }}
                  >
                    {order.gameCredentials.zoneId}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "table-row", marginBottom: "10px" }}>
                <Box
                  sx={{
                    display: "table-cell",
                    padding: "12px",
                    borderBottom: "1px solid #CBD5E0",
                    fontWeight: "bold",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontSize: "16px", color: "#4A5568" }}
                  >
                    User ID
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "table-cell",
                    padding: "12px",
                    borderBottom: "1px solid #CBD5E0",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontSize: "16px", color: "#4A5568" }}
                  >
                    {order.gameCredentials.userId}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "table-row", marginBottom: "10px" }}>
                <Box
                  sx={{
                    display: "table-cell",
                    padding: "12px",
                    borderBottom: "1px solid #CBD5E0",
                    fontWeight: "bold",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontSize: "16px", color: "#4A5568" }}
                  >
                    Game
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "table-cell",
                    padding: "12px",
                    borderBottom: "1px solid #CBD5E0",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontSize: "16px", color: "#4A5568" }}
                  >
                    {order.gameCredentials.game}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "table-row", marginBottom: "10px" }}>
                <Box
                  sx={{
                    display: "table-cell",
                    padding: "12px",
                    borderBottom: "1px solid #CBD5E0",
                    fontWeight: "bold",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontSize: "16px", color: "#4A5568" }}
                  >
                    Price
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "table-cell",
                    padding: "12px",
                    borderBottom: "1px solid #CBD5E0",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontSize: "16px", color: "#4A5568" }}
                  >
                    {order.amount}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "table-row", marginBottom: "10px" }}>
                <Box
                  sx={{
                    display: "table-cell",
                    padding: "12px",
                    borderBottom: "1px solid #CBD5E0",
                    fontWeight: "bold",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontSize: "16px", color: "#4A5568" }}
                  >
                    Amount
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "table-cell",
                    padding: "12px",
                    borderBottom: "1px solid #CBD5E0",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontSize: "16px", color: "#4A5568" }}
                  >
                    {order.orderDetails}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "table-row" }}>
                <Box
                  sx={{
                    display: "table-cell",
                    padding: "12px",
                    fontWeight: "bold",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontSize: "16px", color: "#4A5568" }}
                  >
                    Date
                  </Typography>
                </Box>
                <Box sx={{ display: "table-cell", padding: "12px" }}>
                  <Typography
                    variant="body1"
                    sx={{ fontSize: "16px", color: "#4A5568" }}
                  >
                    {new Date(order.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </div>
        </Box>

        {/* Status Update Section */}
        <Box
          sx={{
            flex: "1",
            backgroundColor: "#2D3748",
            padding: "16px",
            borderRadius: "8px",
            maxWidth: "300px",
            height: "fit-content",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              marginBottom: "16px",
            }}
          >
            Update Order Status
          </Typography>
          <Divider sx={{ backgroundColor: "#4A5568", marginBottom: "16px" }} />

          <Select
            value={status}
            onChange={handleStatusChange}
            fullWidth
            sx={{
              backgroundColor: "#1A202C",
              marginBottom: "16px",
            }}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="success">Success</MenuItem>
          </Select>

          <Button
            onClick={handleStatusUpdate}
            variant="contained"
            disabled={status === order.status}
            sx={{
              backgroundColor: "#3182CE",
              color: "#FFF",
              "&:hover": {
                backgroundColor: "#2B6CB0",
              },
              width: "100%",
            }}
          >
            Update
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default OrderView;
