import BoxBackground from "@/components/BoxBackground";
import Banner from "@/components/Home/Banner";
import MarqueComponent from "@/components/Home/MarqueComponent";
import Testimonials from "@/components/Home/Testimonials";
import TrendingGames from "@/components/Home/TrendingGames";
import WhyChooseUs from "@/components/Home/WhyChooseUs";
import Footer from "@/components/ui/Footer";

export default function Home() {
  return (
    <div>
      <Banner />
      <MarqueComponent />
      <TrendingGames />
      <Testimonials />
      <WhyChooseUs/>
    </div>
  );
}
