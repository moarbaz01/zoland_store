import Image, { StaticImageData } from "next/image";

const GameComponent = ({
  name,
  image,
}: {
  name: string;
  image: StaticImageData | string;
}) => {
  return (
    <div className="bg-secondary p-3 sm:p-4 border border-primary rounded-xl">
      <Image
        src={image}
        alt={name}
        height={150}
        width={150}
        className="rounded-xl w-full h-auto object-cover"
      />
      <h3 className="text-white mt-2 text-sm sm:text-base font-bold">{name}</h3>
      <button className="bg-white mt-2 w-full text-black py-2 px-4 text-sm sm:text-base rounded-full hover:bg-gray-200 transition-colors">
        Buy
      </button>
    </div>
  );
};

export default GameComponent;
