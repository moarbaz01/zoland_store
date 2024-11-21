import Products from "@/components/Dashboard/Products";

const Page = async () => {
  const products = await fetch("http://localhost:3000/api/product");
  const allProducts = await products.json();
  return <Products allProducts={allProducts ?? []} />;
};

export default Page;
