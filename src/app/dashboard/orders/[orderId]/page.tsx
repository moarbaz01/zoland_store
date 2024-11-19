import OrderView from "@/components/Dashboard/Orders/OrderView";
import { notFound } from "next/navigation";

const Page = async ({ params }: { params: { orderId: string } }) => {
  const { orderId } = await params;
  const res = await fetch(`http://localhost:4000/orders/${orderId}`);

  if (!res.ok) {
    notFound();
  }
  const order = await res.json();
  return <OrderView order={order} />;
};

export default Page;