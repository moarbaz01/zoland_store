export const runtime = "edge";
import Product from "@/components/Product";

// Page component
export default async function Page({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  try {
    // Fetch the product data at build time
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/product?id=${productId}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }

    const product = await response.json();

    if (!product) {
      return (
        <div>
          <h1>Product Not Found</h1>
          <p>
            We couldn&apos;t find the product you&apos;re looking for. Please
            check the ID.
          </p>
        </div>
      );
    }

    return <Product {...product} />;
  } catch (err: any) {
    // Handle errors
    return (
      <div>
        <h1>Error</h1>
        <p>{err.message || "An error occurred while fetching the product."}</p>
      </div>
    );
  }
}
