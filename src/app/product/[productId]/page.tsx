import Product from "@/components/Product";

const Page = async ({ params }: { params: { productId: string } }) => {
  const { productId } = await params;

  const response = await fetch(
    `http://localhost:3000/api/product?id=${productId}`
  );

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

  return (
    <>
      <Product {...product} />
    </>
  );
};

export default Page;
