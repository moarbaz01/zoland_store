import Image from "next/image";

const Banner = () => {
  return (
    <div className="max-w-screen-xl mx-auto mt-4 md:px-0 px-4 ">
      <Image
        src="/images/banner.webp"
        height={400}
        width={500}
        alt="Zoland Store Banner"
        className="w-full h-auto border-white rounded-md border-4"
      />
    </div>
  );
};

export default Banner;
