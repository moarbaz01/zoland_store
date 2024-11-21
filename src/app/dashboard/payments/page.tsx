import Payments from "@/components/Dashboard/Payments";

export const dynamic = "force-dynamic"; // Ensure dynamic rendering for up-to-date data

const Page = async () => {
  try {
    // Fetch payment data with dynamic behavior
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment`, {
      next: { revalidate: 0 }, // Disable ISR caching for this fetch
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.statusText}`);
    }

    const payments = await res.json();

    return <Payments allPayments={payments ?? []} />;
  } catch (error) {
    console.error("Error fetching payments:", error);

    return (
      <div>
        <h1>Failed to Load Payments</h1>
        <p>There was an error fetching payment data. Please try again later.</p>
      </div>
    );
  }
};

export default Page;
