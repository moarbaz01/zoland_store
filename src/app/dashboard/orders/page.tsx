import Orders from "@/components/Dashboard/Orders";

export const dynamic = "force-dynamic"; // Ensure dynamic rendering for real-time data

const Page = async () => {
  try {
    // Fetch the orders with no caching
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order`, {
      next: { revalidate: 0 }, // Disable ISR caching for this fetch
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.statusText}`);
    }

    const orders = await res.json();

    return <Orders allOrders={orders ?? []} />;
  } catch (error) {
    console.error("Error fetching orders:", error);

    return (
      <div>
        <h1>Failed to Load Orders</h1>
        <p>There was an error fetching the orders. Please try again later.</p>
      </div>
    );
  }
};

export default Page;
