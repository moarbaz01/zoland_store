import OrderView from "@/components/Dashboard/Orders/OrderView";

type Params = Promise<{ orderId: string }>
const Page = async ({ params }: { params: Params }) => {
  const orderId = (await params).orderId;

  try {
    // Fetch order data from your API
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/order?id=${orderId}`,
      {
        cache: "no-store", // Ensure fresh data is fetched every time
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch order: ${res.statusText}`);
    }

    const order = await res.json();

    return <OrderView order={order} />;
  } catch (error) {
    console.error("Error fetching order:", error);

    return (
      <div>
        <h1>Error</h1>
        <p>Failed to load order data. Please try again later.</p>
      </div>
    );
  }
};

export default Page;
