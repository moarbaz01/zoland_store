"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
const Navbar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (pathname.startsWith("/dashboard")) return null;
  return (
    <div className="py-6 border-b border-white/20 flex items-center px-4 justify-center">
      <div className="max-w-screen-xl w-full m-auto flex items-center justify-between">
        <div className="logo">
          <Link href="/">
            <h1 className="text-2xl font-bold">
              Zoland <span className="text-primary">Store</span>
            </h1>
          </Link>
        </div>
        {!session?.user ? (
          <Link href="/login" className="">
            <button className="bg-white rounded-full px-6 py-1 hover:opacity-80 transition text-black">
              Login
            </button>
          </Link>
        ) : (
          <div className="flex items-center gap-4">
            {session?.user?.role && (
              <Link href="/dashboard" className="">
                <button className="bg-white rounded-full px-6 py-1 hover:opacity-80 transition text-black">
                  Dashboard
                </button>
              </Link>
            )}
            <Link href="/user-dashboard" className="">
              <Image
                src={session?.user?.image!}
                alt="user"
                width={30}
                height={30}
                className="rounded-full aspect-square"
              />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
