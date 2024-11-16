import Product from "@/components/Product";

const Page = async ({ params }: { params: { productId: string } }) => {
  // Await the params if required
  const resolvedParams = await params; // Ensure compatibility with dynamic scenarios
  const { productId } = resolvedParams;
  const product = await (
    await fetch(`http://localhost:4000/products/${productId}`, {
      cache: "no-store",
    })
  ).json();

  return (
    <>
      <Product {...product} />
    </>
  );
};

export default Page;
