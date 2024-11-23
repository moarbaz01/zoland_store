import GameComponent from "@/components/GameComponent";

const fetchProducts = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product`, {
      cache: "no-store", // Ensures fresh data on every request
    });
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return await res.json();
  } catch (err) {
    console.error("Error fetching products:", err);
    throw new Error("Failed to fetch data");
  }
};

const TrendingGames = async () => {
  let products;

  try {
    products = await fetchProducts();
  } catch (error) {
    return (
      <div className="py-12 px-4 sm:px-6">
        <div className="max-w-screen-xl mx-auto">
          <h2 className="text-xl font-bold text-white">TRENDING GAMES</h2>
          <div className="text-red-500 mt-4">Error: {error.message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-xl font-bold text-white">TRENDING GAMES</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {products.map(
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
