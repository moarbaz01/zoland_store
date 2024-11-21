import Customers from "@/components/Dashboard/Customers";

const Page = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`);
  const customers = await res.json();
  console.log(customers);
  return <Customers allCustomers={customers ?? []} />;
};

export default Page;
