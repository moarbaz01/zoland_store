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

interface Payment {
  _id: string;
  email: string;
  amount: number;
  createdAt: string;
  status: string;
  transactionId: string;
  method: string;
  orderId: string;
}

interface PaymentsProps {
  allPayments: Payment[];
}

const Payments: React.FC<PaymentsProps> = ({ allPayments }) => {
  const [payments] = useState(allPayments);
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("createdAt");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [emailFilter, setEmailFilter] = useState<string>("");
  const [monthFilter, setMonthFilter] = useState<number | string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");

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
  const filteredPayments = useMemo(() => {
    if (!payments || !Array.isArray(payments)) {
      console.error("Invalid payments array:", payments);
      return [];
    }

    return payments
      .filter((payment) =>
        emailFilter
          ? payment.email?.toLowerCase().includes(emailFilter.toLowerCase())
          : true
      )
      .filter((payment) =>
        monthFilter
          ? new Date(payment.createdAt).getMonth() + 1 === Number(monthFilter)
          : true
      )
      .filter((payment) =>
        statusFilter ? payment.status === statusFilter : true
      )
      .filter((payment) =>
        dateFilter
          ? new Date(payment.createdAt).toLocaleDateString() ===
            new Date(dateFilter).toLocaleDateString()
          : true
      );
  }, [payments, emailFilter, monthFilter, statusFilter, dateFilter]);

  // Sorting
  const sortedPayments = useMemo(() => {
    return filteredPayments.sort((a, b) => {
      if (b[orderBy] < a[orderBy]) return -1;
      if (b[orderBy] > a[orderBy]) return 1;
      return 0;
    });
  }, [filteredPayments, orderBy]);

  // Paginated payments
  const currentPayments = useMemo(() => {
    return sortedPayments.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  }, [sortedPayments, page, rowsPerPage]);

  return (
    <div className="md:ml-72 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white mb-6">Payments</h1>
        <p className="text-2xl font-bold text-white mb-6">
          Total : {payments?.length || 0}
        </p>
      </div>
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <TextField
          label="Email"
          variant="outlined"
          size="small"
          value={emailFilter}
          onChange={(e) => setEmailFilter(e.target.value)}
          className="w-64"
        />
        <FormControl size="small" className="w-64">
          <InputLabel>Month</InputLabel>
          <Select
            value={monthFilter}
            onChange={(e: SelectChangeEvent<string>) =>
              setMonthFilter(e.target.value)
            }
            label="Month"
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
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e: SelectChangeEvent<string>) =>
              setStatusFilter(e.target.value)
            }
            label="Status"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="success">Success</MenuItem>
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
              <TableCell>TxnId</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>OrderId</TableCell>
              <TableCell>Method</TableCell>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPayments.map((payment) => (
              <TableRow key={payment._id}>
                <TableCell>{payment.transactionId}</TableCell>
                <TableCell>{payment.email}</TableCell>
                <TableCell>₹{payment.amount}</TableCell>
                <TableCell>{payment.orderId}</TableCell>
                <TableCell>{payment.method || "Prepaid"}</TableCell>
                <TableCell>
                  {new Date(payment.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Chip
                    label={payment.status}
                    color={payment.status === "pending" ? "warning" : "success"}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filteredPayments.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
};

export default Payments;
