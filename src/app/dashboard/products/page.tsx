import Products from "@/components/Dashboard/Products";

export const dynamic = "force-dynamic"; // Always fetch fresh data for dynamic behavior

const Page = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product`, {
      next: { revalidate: 0 }, // Disable ISR for fresh data on each request
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.statusText}`);
    }

    const allProducts = await res.json();

    return <Products allProducts={allProducts ?? []} />;
  } catch (error) {
    console.error("Error fetching products:", error);

    return (
      <div>
        <h1>Error Loading Products</h1>
        <p>
          We encountered an error while fetching products. Please try again
          later.
        </p>
      </div>
    );
  }
};

export default Page;
