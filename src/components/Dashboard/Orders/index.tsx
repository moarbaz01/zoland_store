"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  SelectChangeEvent,
  Tooltip,
  Chip,
} from "@mui/material";
import { Pagination } from "@mui/material";
import { CgEye } from "react-icons/cg";

// Dummy Data for Orders
const dummyOrders = [
  {
    _id: "1",
    createdAt: "2024-11-15T08:00:00Z",
    email: "customer1@example.com",
    product: { name: "Product 1" },
    status: "pending",
    orderType: "Api Game",
  },
  {
    _id: "2",
    createdAt: "2024-11-14T08:00:00Z",
    email: "customer2@example.com",
    product: { name: "Product 2" },
    status: "success",
    orderType: "Api Game",
  },
  {
    _id: "3",
    createdAt: "2024-11-13T08:00:00Z",
    email: "customer3@example.com",
    product: { name: "Product 3" },
    status: "pending",
    orderType: "Api Game",
  },
];

const Orders = () => {
  const [orders, setOrders] = useState(dummyOrders);
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("createdAt");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [emailFilter, setEmailFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState<number | string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState("");

  // Sorting function
  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && orderDirection === "asc";
    setOrderDirection(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleFilterEmailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEmailFilter(event.target.value);
  };

  const handleFilterMonthChange = (event: SelectChangeEvent<string>) => {
    setMonthFilter(event.target.value);
  };

  const handleFilterStatusChange = (event: SelectChangeEvent<string>) => {
    setStatusFilter(event.target.value as string);
  };

  const handleDateFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDateFilter(event.target.value);
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  // Filtering logic
  const filteredOrders = orders
    .filter((order) =>
      order.email.toLowerCase().includes(emailFilter.toLowerCase())
    )
    .filter((order) =>
      monthFilter
        ? new Date(order.createdAt).getMonth() + 1 === monthFilter
        : true
    )
    .filter((order) => (statusFilter ? order.status === statusFilter : true))
    .filter((order) =>
      dateFilter
        ? new Date(order.createdAt).toLocaleDateString() ===
          new Date(dateFilter).toLocaleDateString()
        : true
    );

  // Sorting the filtered orders
  const sortedOrders = filteredOrders.sort((a, b) => {
    return descendingComparator(a, b, orderBy);
  });

  // Get current page orders
  const currentOrders = sortedOrders.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <div className="md:ml-72 p-6">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      {/* Filters */}
      <div className="mb-6 flex space-x-6">
        <TextField
          label="Filter by Email"
          variant="outlined"
          size="small"
          value={emailFilter}
          onChange={handleFilterEmailChange}
          className="w-64"
        />
        <FormControl size="small" className="w-64">
          <InputLabel>Filter by Month</InputLabel>
          <Select
            value={monthFilter}
            onChange={handleFilterMonthChange}
            label="Filter by Month"
          >
            <MenuItem value="">All</MenuItem>
            {Array.from({ length: 12 }, (_, i) => (
              <MenuItem key={i} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" className="w-64">
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={handleFilterStatusChange}
            label="Filter by Status"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="success">Success</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Filter by Date"
          variant="outlined"
          size="small"
          type="date"
          value={dateFilter}
          onChange={handleDateFilterChange}
          className="w-64"
        />
      </div>

      {/* Table */}
      <TableContainer className="bg-gray-800 rounded-xl">
        <Table sx={{ minWidth: 650 }} aria-label="orders table" size="medium">
          <TableHead className="bg-gray-600">
            <TableRow>
              <TableCell>OrderId</TableCell>
              <TableCell>OrderType</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Product</TableCell>
              <TableCell
                sortDirection={orderBy === "createdAt" ? orderDirection : false}
                onClick={() => handleRequestSort("createdAt")}
                className="cursor-pointer"
              >
                <TableSortLabel
                  active={orderBy === "createdAt"}
                  direction={orderDirection}
                >
                  Date
                </TableSortLabel>
              </TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentOrders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order._id}</TableCell>
                <TableCell>{order.orderType}</TableCell>
                <TableCell>{order.email}</TableCell>
                <TableCell>{order.product?.name || "N/A"}</TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={order.status === "pending" ? "warning" : "success"}
                  />
                </TableCell>
                <TableCell>
                  <button className="px-2 py-2 bg-blue-500 rounded-full text-white aspect-square">
                    <CgEye className="text-lg" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filteredOrders.length}
        page={page - 1}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
};

// Helper function to sort by date (or any other field)
const descendingComparator = (a: any, b: any, orderBy: string) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

export default Orders;
