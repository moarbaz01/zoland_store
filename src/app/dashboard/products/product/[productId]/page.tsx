import ProductForm from "@/components/Dashboard/ProductForm";

const Page = async ({ params }: { params: { productId: string } }) => {
  const { productId } = await params;

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product?id=${productId}`);

  if (!response.ok) {
    // Handle the error, such as a 404 or other HTTP status codes
    console.error(`Failed to fetch product: ${response.statusText}`);
    return (
      <div>
        <h1>Product Not Found</h1>
        <p>
          We couldn't find the product you're looking for. Please check the ID.
        </p>
      </div>
    );
  }
  const product = await response.json();
  return <ProductForm product={product} />;
};

export default Page;
