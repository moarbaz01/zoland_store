import Image, { StaticImageData } from "next/image";
import Link from "next/link";

const GameComponent = ({
  _id,
  name,
  image,
}: {
  _id: string;
  name: string;
  image: StaticImageData | string;
}) => {
  return (
    <Link href={`/product/${_id}`}>
      <div className="bg-secondary hover:opacity-80 transition p-3 sm:p-4 border border-primary rounded-xl">
        <Image
          src={image}
          alt={name}
          priority={true}
          height={150}
          width={150}
          className="rounded-xl w-full h-auto aspect-square object-cover"
        />
        <h3 className="text-white mt-2 text-sm sm:text-base font-bold">
          {name}
        </h3>
        <button className="bg-white mt-2 w-full text-black py-2 px-4 text-sm sm:text-base rounded-full hover:bg-gray-200 transition-colors">
          Top Up
        </button>
      </div>
    </Link>
  );
};

export default GameComponent;
