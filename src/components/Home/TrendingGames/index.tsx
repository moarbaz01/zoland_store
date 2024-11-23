"use client";
import GameComponent from "@/components/GameComponent";
import Loader from "@/components/Loader";
import { useEffect, useState } from "react";

const TrendingGames = () => {
  const [products, setProducts] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product`);
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!products) {
    return <Loader />;
  }
  return (
    <div className="py-12 px-4 sm:px-6">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-xl font-bold text-white ">TRENDING GAMES</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {products?.map(
            (item: { _id: string; name: string; image: string; isDeleted }) => (
              <GameComponent
                key={item._id}
                _id={item._id}
                name={item.name}
                image={item.image}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default TrendingGames;
