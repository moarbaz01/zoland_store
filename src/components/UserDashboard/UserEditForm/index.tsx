"use client";

import React, { useCallback, useEffect, useState } from "react";
import { TextField, Button, Paper } from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

const UserEditForm = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const { data: session } = useSession();

  //   Handle Submit
  const handleSubmit = useCallback(async () => {
    const isConfirm = confirm("Are you sure?");
    if (!isConfirm) return;

    // New endpoint
    const endpoint = `/api/users/$${id}`;

    // Response
    const res = await axios.put(
      endpoint,
      {
        name,
        email,
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
  }, [name, email, id]);

  //   Handle Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "name":
        setName(value);
        break;
      case "email":
        setEmail(value);
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    if (session?.user) {
      setEmail(session.user.email!);
      setName(session.user.name!);
      setId(session.user.id!);
    }
  }, [session]);
  return (
    <Paper className="p-6">
      <form>
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
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            className="bg-primary font-bold text-black"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Paper>
  );
};

export default UserEditForm;
