import Customers from "@/components/Dashboard/Customers";

// Force dynamic rendering for live API data
export const dynamic = "force-dynamic";

const Page = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
      next: { revalidate: 0 }, // Disable caching to fetch fresh data
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const customers = await res.json();

    return <Customers allCustomers={customers ?? []} />;
  } catch (error) {
    console.error("Error fetching customers:", error);

    return (
      <div>
        <h1>Failed to Load Customers</h1>
        <p>There was an error fetching customer data. Please try again later.</p>
      </div>
    );
  }
};

export default Page;
