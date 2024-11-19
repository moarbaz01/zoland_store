import CustomerEditForm from "@/components/Dashboard/Customers/CustomerEditForm";
import { notFound } from "next/navigation";

const getCustomer = async (customerId: string) => {
  //   const res = await fetch(
  //     `/api/users/${customerId}`
  //   );
  //   if (!res.ok) {
  //     return null;
  //   }

  return {
    _id: "1",
    name: "John Doe",
    role: "user",
    isBlocked: false,
    isDeleted: false,
  };
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
