import Orders from "@/components/Dashboard/Orders";

const Page = async () => {
  const allOrders = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order`);
  const orders = await allOrders.json();
  return <Orders allOrders={orders ?? []} />;
};
export default Page;
