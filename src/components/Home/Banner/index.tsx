import Image from "next/image";

const Banner = () => {
  return (
    <div className="bg-purple-500">
      <div className="max-w-screen-xl mx-auto mt-4 md:px-0 px-4 ">
        <Image
          src="/images/banner.png"
          height={400}
          width={500}
          alt="Zoland Store Banner"
          className="w-full h-auto "
        />
      </div>
    </div>
  );
};

export default Banner;
