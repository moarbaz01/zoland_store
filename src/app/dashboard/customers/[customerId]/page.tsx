import CustomerEditForm from "@/components/Dashboard/Customers/CustomerEditForm";

type Params = Promise<{ customerId: string }>
const Page = async ({ params }: { params: Params }) => {
  const  customerId = (await params).customerId;

  try {
    // Fetch the customer data from your API
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user?id=${customerId}`,
      {
        cache: "no-store", // Avoid caching for dynamic content
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch customer: ${res.statusText}`);
    }

    const customer = await res.json();

    return <CustomerEditForm customer={customer} />;
  } catch (error) {
    console.error("Error fetching customer:", error);

    return (
      <div>
        <h1>Error</h1>
        <p>Failed to load customer data. Please try again later.</p>
      </div>
    );
  }
};

export default Page;
