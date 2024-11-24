"use client";

import React, { useCallback, useEffect, useState } from "react";
import { TextField, Button, Paper } from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { updateName } from "@/redux/userSlice";

const UserEditForm = () => {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const { user } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  //   Handle Submit
  const handleSubmit = useCallback(async () => {
    const isConfirm = confirm("Are you sure?");
    if (!isConfirm) return;

    // New endpoint
    const endpoint = `/api/user?id=${id}`;

    try {
      // Response
      const res = await axios.put(
        endpoint,
        {
          name,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        dispatch(updateName(name));
        toast.success("User updated successfully!");
      } else {
        toast.error("Failed to update customer.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("An error occurred while updating the user.");
    }
  }, [name, id, dispatch]);

  //   Handle Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "name") setName(value);
  };

  useEffect(() => {
    if (user) {
      setName(user.name!);
      setId(user._id!);
    }
  }, [user]);

  return (
    <Paper className="md:py-6 md:px-6 px-4">
      {/* Name */}
      <TextField
        fullWidth
        label="Name"
        name="name"
        value={name}
        onChange={handleChange}
        margin="normal"
        variant="outlined"
        sx={{ color: "#E5E7EB", backgroundColor: "#1F2937" }}
      />

      {/* Submit Button */}
      <div className="mt-4">
        <Button
          type="button"
          onClick={handleSubmit}
          variant="contained"
          className="bg-yellow-300 font-bold text-black rounded-full"
        >
          Save Changes
        </Button>
      </div>
    </Paper>
  );
};

export default UserEditForm;
