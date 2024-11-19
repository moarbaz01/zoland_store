"use client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
const Navbar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (pathname.startsWith("/dashboard")) return null;
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
          <div className="flex items-center gap-4">
            <Link href="/user-dashboard" className="">
              Dashboard
            </Link>
            <Image
              onClick={() => signOut()}
              src={session?.user?.image!}
              alt="user"
              width={30}
              height={30}
              className="rounded-full aspect-square"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
