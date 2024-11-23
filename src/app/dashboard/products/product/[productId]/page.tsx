import ProductForm from "@/components/Dashboard/ProductForm";

export default async function Page({ params }: { params: Promise<{ productId: string }> }){
  const productId = (await params).productId;

  let product = null;
  let error = null;

  try {
    const res = await fetch(`/api/product?id=${productId}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch product data: ${res.statusText}`);
    }

    product = await res.json();
  } catch (err) {
    console.log(err);
    error = "Failed to load product data. Please try again later.";
  }

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  return <ProductForm product={product} />;
};

