"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
// pages/auth/signin.tsx
import { FaGoogle } from "react-icons/fa";

const SignIn = () => {
  return (
    <div className="py-12 px-6 sm:px-8 md:h-[80vh] h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-md p-8  rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">
            Welcome to Zoland Store
          </h2>
          <p className="mt-4 text-gray-400">
            Please sign in to continue to your account.
          </p>
        </div>

        {/* Google Sign-in Button */}
        <button
          onClick={() => signIn("google")}
          className="w-full mt-6 flex items-center justify-center py-3 px-6 bg-white text-black rounded-full shadow-md hover:shadow-xl"
        >
          <FaGoogle className="text-xl" />
          <span className="ml-3">Continue with Google</span>
        </button>

        {/* Sign-up link */}
        {/* <div className="mt-6 text-center text-gray-400">
          <p className="text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary font-semibold">
              Sign up
            </Link>
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default SignIn;
