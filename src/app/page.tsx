import Banner from "@/components/Home/Banner";
import MarqueComponent from "@/components/Home/MarqueComponent";
import Testimonials from "@/components/Home/Testimonials";
import TrendingGames from "@/components/Home/TrendingGames";
import WhyChooseUs from "@/components/Home/WhyChooseUs";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default async function Home() {
  try {
    const products = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product`, {
      next: { revalidate: 0 }, // Avoid caching for fresh data
    });

    if (!products.ok) {
      throw new Error("Failed to fetch products");
    }

    const allProducts = await products.json();

    return (
      <div>
        <Banner />
        <MarqueComponent />
        <TrendingGames products={allProducts} />
        <Testimonials />
        <WhyChooseUs />
      </div>
    );
  } catch (error) {
    console.error("Error fetching products:", error);

    return (
      <div>
        <h1>Products Not Found</h1>
        <p>We couldn't find the products you're looking for.</p>
      </div>
    );
  }
}
