"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";

const Navbar = () => {
  const { data: session } = useSession();
  return (
    <div className="h-16 bg-secondary flex items-center px-4 justify-center">
      <div className="max-w-screen-xl w-full m-auto flex items-center justify-between">
        <div className="logo">
          <Link href="/">
            <h1 className="text-xl font-bold">
              Zoland<span className="text-primary">Store</span>
            </h1>
          </Link>
        </div>
        {!session?.user ? (
          <Link href="/login" className="">
            Login
          </Link>
        ) : (
          <Link href="/dashboard" className="">
            Dashboard
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
