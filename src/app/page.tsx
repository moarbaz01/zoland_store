import Banner from "@/components/Home/Banner";
import MarqueComponent from "@/components/Home/MarqueComponent";
import Testimonials from "@/components/Home/Testimonials";
import TrendingGames from "@/components/Home/TrendingGames";
import WhyChooseUs from "@/components/Home/WhyChooseUs";

export default async function Home() {
  const products = await fetch("http://localhost:3000/api/product");
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
}
