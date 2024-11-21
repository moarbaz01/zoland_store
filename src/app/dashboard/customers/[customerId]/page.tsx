import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import Loader from "@/components/Loader";

const CustomerEditForm = dynamic(
  () => import("@/components/Dashboard/Customers/CustomerEditForm")
);

const getCustomer = async (customerId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user?id=${customerId}`
  );
  if (!res.ok) {
    return null;
  }
  return res.json();
};

const Page = async ({ params }: { params: { customerId: string } }) => {
  const { customerId } = await params;
  const customer = await getCustomer(customerId);

  if (!customer) {
    notFound();
  }
  return (
    <Suspense fallback={<Loader />}>
      <CustomerEditForm customer={customer} />
    </Suspense>
  );
};

export default Page;
