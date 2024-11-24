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
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Chip,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";

const Customers = ({ allCustomers }) => {
  console.log("all customers", allCustomers);
  const [customers, setCustomers] = useState(allCustomers);
  const [orderBy, setOrderBy] = useState<string>("createdAt");
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [emailFilter, setEmailFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [blockedFilter, setBlockedFilter] = useState("");
  const router = useRouter();

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
    setPage(newPage + 1);
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Do you really wanna delete this user?")) {
      return toast.error("User not deleted");
    }
    const endpoint = `/api/user?id=${id}`;
    const res = await axios.delete(endpoint);
    if (res.status === 200) {
      toast.success("User deleted successfully!");
      setCustomers((prev) => prev.filter((customer) => customer._id !== id));
    } else {
      toast.error("Failed to delete user.");
    }
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleEmailFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEmailFilter(event.target.value);
  };

  const handleRoleFilterChange = (event: SelectChangeEvent<string>) => {
    setRoleFilter(event.target.value as string);
  };

  const handleBlockedFilterChange = (event: SelectChangeEvent<string>) => {
    setBlockedFilter(event.target.value as string);
  };
  // Filtering logic
  const filteredCustomers = customers
    .filter((customer) =>
      customer.email.toLowerCase().includes(emailFilter.toLowerCase())
    )
    .filter((customer) => (roleFilter ? customer.role === roleFilter : true))
    .filter((customer) =>
      blockedFilter === "blocked"
        ? customer.isBlocked
        : blockedFilter === "active"
        ? !customer.isBlocked
        : true
    );

  // Sorting the filtered customers
  const sortedCustomers = filteredCustomers.sort((a, b) =>
    descendingComparator(a, b, orderBy)
  );

  // Current page data
  const currentCustomers = sortedCustomers.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <div className="md:ml-72 md:py-6 md:px-6 px-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white mb-6">Customers</h1>
        <p className="text-2xl font-bold text-white mb-6">
          Total : {customers?.length || 0}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex space-x-6">
        <TextField
          label="Filter by Email"
          variant="outlined"
          size="small"
          value={emailFilter}
          onChange={handleEmailFilterChange}
          className="w-64"
        />
        <FormControl size="small" className="w-64">
          <InputLabel>Filter by Role</InputLabel>
          <Select value={roleFilter} onChange={handleRoleFilterChange}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" className="w-64">
          <InputLabel>Filter by Status</InputLabel>
          <Select value={blockedFilter} onChange={handleBlockedFilterChange}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="blocked">Blocked</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Table */}
      <TableContainer className="bg-gray-800 rounded-xl">
        <Table
          sx={{ minWidth: 650 }}
          aria-label="customers table"
          size="medium"
        >
          <TableHead className="bg-gray-600">
            <TableRow>
              <TableCell
                sortDirection={orderBy === "createdAt" ? orderDirection : false}
                onClick={() => handleRequestSort("createdAt")}
                className="cursor-pointer"
              >
                <TableSortLabel
                  active={orderBy === "createdAt"}
                  direction={orderDirection}
                >
                  Joined Date
                </TableSortLabel>
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentCustomers.map(
              (customer) =>
                !customer?.isDeleted && (
                  <TableRow key={customer._id}>
                    <TableCell>
                      {new Date(customer.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={customer.role === "admin" ? "Admin" : "User"}
                        size="small"
                        className="bg-gray-700 text-white"
                      />
                    </TableCell>
                    <TableCell>
                      {customer.isBlocked ? "Blocked" : "Active"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4 md:flex-row flex-col">
                        <button
                          onClick={() =>
                            router.push(`/dashboard/customers/${customer._id}`)
                          }
                          className="text-primary"
                        >
                          <Edit />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(customer._id)}
                          className="text-red-500"
                        >
                          <Delete />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filteredCustomers.length}
        page={page - 1}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
};

// Helper function to sort by field
const descendingComparator = (a: any, b: any, orderBy: string) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

export default Customers;
