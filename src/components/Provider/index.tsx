"use client";
import { ThemeProvider } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import theme from "../../../theme";

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </SessionProvider>
  );
};

export default Provider;
