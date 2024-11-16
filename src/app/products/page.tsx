const fetchProducts = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await res.json();
  return data.data.product;
};

export default async function ProductsPage() {
  let products;

  try {
    products = await fetchProducts();
  } catch (error: any) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map((product: any) => (
          <li key={product.id}>
            {product.spu} - ${product.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
