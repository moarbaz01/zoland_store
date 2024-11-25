// app/page.js (or app/home/page.js if your Home page is in the app folder)
export const runtime = "edge";
import Banner from "@/components/Home/Banner";
import MarqueComponent from "@/components/Home/MarqueComponent";
import Testimonials from "@/components/Home/Testimonials";
import TrendingGames from "@/components/Home/TrendingGames";
import WhyChooseUs from "@/components/Home/WhyChooseUs";

export default function Home() {
  return (
    <div>
      <Banner />
      <MarqueComponent />
      <TrendingGames />
      <Testimonials />
      <WhyChooseUs />
    </div>
  );
}
