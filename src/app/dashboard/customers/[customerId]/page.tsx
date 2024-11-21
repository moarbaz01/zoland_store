import CustomerEditForm from "@/components/Dashboard/Customers/CustomerEditForm";
import { notFound } from "next/navigation";

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
  return <CustomerEditForm customer={customer} />;
};

export default Page;
