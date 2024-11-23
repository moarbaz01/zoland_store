"use client";
import Loader from "@/components/Loader";
import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import { Suspense } from "react";
const MyComponent = () => {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId");
  const message = searchParams.get("message");

  if (!message) {
    notFound();
  }
  return (
    <div className="min-h-screen  flex items-center justify-center">
      <div className="text-center max-w-lg p-8  shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold text-primary mb-4">Success!</h1>
        <p className="text-lg text-white mb-6">
          Your transaction was successfully completed. Thank you for choosing
          us!
        </p>
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <p className="text-gray-700">
            <span className="font-semibold">Transaction ID:</span>{" "}
            {transactionId}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Message:</span> {message}
          </p>
        </div>
        <Link href="/" className="flex justify-center">
          <button className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/80 transition duration-300">
            Go Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
};

const SuccessPage = () => {
  return (
    <Suspense fallback={<Loader />}>
      <MyComponent />
    </Suspense>
  );
};

export default SuccessPage;
