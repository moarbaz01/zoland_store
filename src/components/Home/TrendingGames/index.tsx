import GameComponent from "@/components/GameComponent";
import { gamesData } from "@/components/GameComponent/data";

const TrendingGames = () => {
  return (
    <div className="py-12 px-4 sm:px-6">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-xl font-bold text-white ">TRENDING GAMES</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {gamesData.map((item, i) => (
            <GameComponent key={i} name={item.name} image={item.image} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingGames;
