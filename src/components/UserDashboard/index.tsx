"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  CircularProgress,
  Chip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { LuLogOut, LuShoppingBag, LuUser } from "react-icons/lu";
import UserEditForm from "./UserEditForm";
import { useSelector } from "react-redux";
import axios from "axios";

const UserDashboard = () => {
  const { data: session } = useSession();
  const { user } = useSelector((state: any) => state.user);
  const [orders, setOrders] = useState<any[]>([]); // Default to empty array
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof (typeof orders)[0]>("costId");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedTab, setSelectedTab] = useState("profile");

  // Sorting logic
  const handleSort = (property: keyof (typeof orders)[0]) => {
    const isAscending = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);

    const sortedOrders = [...orders].sort((a, b) => {
      if (a[property] < b[property]) return isAscending ? 1 : -1;
      if (a[property] > b[property]) return isAscending ? -1 : 1;
      return 0;
    });
    setOrders(sortedOrders);
  };

  // Pagination logic
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await axios.get("/api/order");
      if (res.status === 200) {
        const filterData = res.data.filter(
          (item: any) => item.user === session?.user?.id
        );
        if (filterData.length > 0) {
          const sortedData = filterData.sort((a: any, b: any) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });
          setOrders(sortedData);
        }
        console.log(filterData);
      }
    };
    fetchOrders();
  }, [session?.user.id]);

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="py-12 sm:px-6 px-4 lg:min-h-[80vh]">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <div className="flex md:justify-between flex-col md:flex-row mt-4 gap-6">
          {/* Sidebar */}
          <div>
            <div className="flex items-center bg-secondary p-4 rounded-xl gap-4">
              <div className="w-24 h-24 rounded-full">
                <Image
                  src={session?.user?.image!}
                  alt="User Avatar"
                  priority={true}
                  width={96}
                  height={96}
                  className="w-full h-full rounded-full"
                />
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold">{user?.name!}</h2>
                <p className="text-gray-500">{user?.email!}</p>
              </div>
            </div>

            <div className="flex flex-col bg-secondary rounded-xl gap-4 mt-4 p-4">
              <li
                onClick={() => setSelectedTab("profile")}
                className="text-lg flex items-center gap-4 hover:text-primary transition cursor-pointer"
              >
                <LuUser className="text-2xl" /> Profile
              </li>
              <li
                onClick={() => setSelectedTab("orders")}
                className="text-lg flex items-center gap-4 hover:text-primary transition cursor-pointer"
              >
                <LuShoppingBag className="text-2xl" /> Orders
              </li>
              <li
                onClick={() => signOut()}
                className="text-lg flex items-center gap-4 hover:text-primary transition cursor-pointer"
              >
                <LuLogOut className="text-2xl" /> Logout
              </li>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-4">
              {selectedTab === "profile" ? "Your Profile" : "Recent Orders"}
            </h3>
            {selectedTab === "profile" ? (
              <UserEditForm />
            ) : orders?.length > 0 ? (
              <>
                <TableContainer
                  sx={{
                    backgroundColor: "#1f1f1f",
                    borderRadius: "10px",
                  }}
                >
                  <Table>
                    <TableHead className=" bg-gray-600">
                      <TableRow>
                        <TableCell>
                          <TableSortLabel
                            active={orderBy === "costId"}
                            direction={order}
                            onClick={() => handleSort("costId")}
                          >
                            Order ID
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>
                          <TableSortLabel
                            active={orderBy === "name"}
                            direction={order}
                            onClick={() => handleSort("name")}
                          >
                            Name
                          </TableSortLabel>
                        </TableCell>

                        <TableCell align="right">
                          <TableSortLabel
                            active={orderBy === "amount"}
                            direction={order}
                            onClick={() => handleSort("amount")}
                          >
                            Amount ($)
                          </TableSortLabel>
                        </TableCell>
                        <TableCell align="right">
                          <TableSortLabel
                            active={orderBy === "paymentId"}
                            direction={order}
                            onClick={() => handleSort("paymentId")}
                          >
                            Payment Id
                          </TableSortLabel>
                        </TableCell>

                        <TableCell align="right">
                          <TableSortLabel
                            active={orderBy === "status"}
                            direction={order}
                            onClick={() => handleSort("status")}
                          >
                            Status
                          </TableSortLabel>
                        </TableCell>
                        <TableCell align="right">
                          <TableSortLabel
                            active={orderBy === "payDate"}
                            direction={order}
                            onClick={() => handleSort("payDate")}
                          >
                            Pay Date
                          </TableSortLabel>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orders
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((order) => (
                          <TableRow key={order._id}>
                            <TableCell>{order?._id}</TableCell>
                            <TableCell align="right">
                              {order?.product?.name}
                            </TableCell>
                            <TableCell align="right">
                              ₹{order?.amount}
                            </TableCell>
                            <TableCell align="right">
                              {order?.paymentId || "N/A"}
                            </TableCell>

                            <TableCell align="right">
                              <Chip
                                label={order?.status}
                                color={
                                  order.status === "success"
                                    ? "success"
                                    : order.status === "pending"
                                    ? "warning"
                                    : "error"
                                }
                              />
                            </TableCell>
                            <TableCell
                              sx={{ textWrap: "nowrap" }}
                              align="right"
                            >
                              {new Date(order?.createdAt).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={orders?.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </>
            ) : (
              <p className="text-lg font-bold mb-4">No orders found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
