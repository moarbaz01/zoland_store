import Orders from "@/components/Dashboard/Orders";
import Payments from "@/components/Dashboard/Payments";

const Page = async () => {
  const allPayments = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment`);
  const payments = await allPayments.json();
  return <Payments allPayments={payments ?? []} />;
};
export default Page;
