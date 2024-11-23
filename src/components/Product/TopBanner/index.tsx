import Image, { StaticImageData } from "next/image";
import BoxBackground from "@/components/BoxBackground";
import { CgBolt } from "react-icons/cg";

interface Game {
  name: string;
  image: StaticImageData | string;
}

const TopBanner = ({ image, name }: Game) => {
  return (
    <div className="relative w-full h-[50vh] flex items-center">
      <BoxBackground />
      <div className=" from-black/60 to-white/0 bg-gradient-to-t absolute -z-10 top-0 left-0 w-full h-full"></div>
      <div
        className="flex max-w-screen-xl mx-auto items-center md:justify-start justify-center 
      w-full h-full md:flex-row flex-col gap-6 px-6"
      >
        <>
          <Image
            src={image || ""}
            alt={name || ""}
            width={250}
            height={250}
            className="hidden md:block object-cover rounded-xl"
          />
          <Image
            src={image || ""}
            alt={name || ""}
            width={200}
            height={200}
            className=" md:hidden object-cover rounded-xl"
          />
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-white text-3xl text-nowrap font-bold">
              {name}
            </h1>
            <p className="text-white text-sm flex items-center gap-2">
              <CgBolt className=" text-orange-500" />
              Instant Recharge
              <CgBolt className="text-orange-500" />
            </p>
          </div>
        </>
      </div>
    </div>
  );
};

export default TopBanner;
