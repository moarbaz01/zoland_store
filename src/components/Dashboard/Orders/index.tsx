"use client";

import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  SelectChangeEvent,
  Chip,
} from "@mui/material";
import { CgEye } from "react-icons/cg";
import { useRouter } from "next/navigation";

interface Order {
  _id: string;
  email: string;
  amount: number;
  createdAt: string;
  status: string;
  paymentId: string | null;
  product?: {
    name: string;
  };
  gameCredentials?: {
    userId: string;
    zoneId?: string;
  };
  orderType?: string;
}

interface OrdersProps {
  allOrders: Order[];
}

const Orders: React.FC<OrdersProps> = ({ allOrders }) => {
  const [orders] = useState(allOrders);
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("createdAt");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [emailFilter, setEmailFilter] = useState<string>("");
  const [monthFilter, setMonthFilter] = useState<number | string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const router = useRouter();

  // Sorting logic
  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && orderDirection === "asc";
    setOrderDirection(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filters
  const filteredOrders = useMemo(() => {
    if (!orders || !Array.isArray(orders)) {
      console.error("Invalid orders array:", orders);
      return [];
    }

    return orders
      .filter((order) =>
        emailFilter
          ? order.email?.toLowerCase().includes(emailFilter.toLowerCase())
          : true
      )
      .filter((order) =>
        monthFilter
          ? new Date(order.createdAt).getMonth() + 1 === Number(monthFilter)
          : true
      )
      .filter((order) => (statusFilter ? order.status === statusFilter : true))
      .filter((order) =>
        dateFilter
          ? new Date(order.createdAt).toLocaleDateString() ===
            new Date(dateFilter).toLocaleDateString()
          : true
      );
  }, [orders, emailFilter, monthFilter, statusFilter, dateFilter]);

  // Sorting
  const sortedOrders = useMemo(() => {
    return filteredOrders.sort((a, b) => {
      if (b[orderBy] < a[orderBy]) return -1;
      if (b[orderBy] > a[orderBy]) return 1;
      return 0;
    });
  }, [filteredOrders, orderBy]);

  // Paginated Orders
  const currentOrders = useMemo(() => {
    return sortedOrders.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  }, [sortedOrders, page, rowsPerPage]);

  return (
    <div className="md:ml-72 md:py-6 md:px-6 px-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white mb-6">Orders</h1>
        <p className="text-2xl font-bold text-white mb-6">
          Total : {orders?.length || 0}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <TextField
          label="Filter by Email"
          variant="outlined"
          size="small"
          value={emailFilter}
          onChange={(e) => setEmailFilter(e.target.value)}
          className="w-64"
        />
        <FormControl size="small" className="w-64">
          <InputLabel>Filter by Month</InputLabel>
          <Select
            value={monthFilter}
            onChange={(e: SelectChangeEvent<string>) =>
              setMonthFilter(e.target.value)
            }
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
            onChange={(e: SelectChangeEvent<string>) =>
              setStatusFilter(e.target.value)
            }
            label="Filter by Status"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="success">Success</MenuItem>
            <MenuItem value="failed">Failed</MenuItem>
          </Select>
        </FormControl>
        <TextField
          variant="outlined"
          size="small"
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="w-64"
        />
      </div>

      {/* Table */}
      <TableContainer className="bg-gray-800 rounded-xl">
        <Table>
          <TableHead className="bg-gray-600">
            <TableRow>
              <TableCell>OrderId</TableCell>
              <TableCell>OrderType</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>PaymentId</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Game Id</TableCell>
              <TableCell>Zone Id</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "createdAt"}
                  direction={orderDirection}
                  onClick={() => handleRequestSort("createdAt")}
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
                <TableCell>{order.orderType || "N/A"}</TableCell>
                <TableCell>{order.email}</TableCell>
                <TableCell>{order.paymentId || "N/A"}</TableCell>
                <TableCell>₹{order.amount}</TableCell>
                <TableCell>{order.product?.name || "N/A"}</TableCell>
                <TableCell>{order.gameCredentials.userId}</TableCell>
                <TableCell>
                  {order.orderType === "API Order"
                    ? order?.gameCredentials?.zoneId
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={
                      order.status === "success"
                        ? "success"
                        : order.status === "pending"
                        ? "warning"
                        : "error"
                    }
                  />
                </TableCell>
                <TableCell>
                  <button
                    onClick={() =>
                      router.push(`/dashboard/orders/${order._id}`)
                    }
                    className="px-2 py-2 bg-blue-500 rounded-full text-white"
                  >
                    <CgEye />
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
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
};

export default Orders;
