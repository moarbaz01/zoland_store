import Marquee from "react-fast-marquee";
import { FaQuoteLeft } from "react-icons/fa";

const TestimonialItem = ({ text, name } : {text : string, name : string}) => {
  return (
    <div className="flex flex-col items-center cursor-pointer w-[250px] sm:w-[300px] md:w-[350px] p-6 bg-black border border-white rounded-lg shadow-[0px_4px_15px_rgba(255,255,255,0.5)] transition-shadow duration-300 relative mx-4">
      <FaQuoteLeft className="text-xl absolute bottom-4 left-4 text-white opacity-30" />
      <p className="text-sm italic text-center text-white">
        &quot;{text}&quot;
      </p>
      <span className="font-semibold text-white mt-3 text-sm">
        — {name}
      </span>
    </div>
  );
};

const data = [
  {
    id: 1,
    text: "I purchased Mobile Legends diamonds from this store and am highly satisfied with their prompt, affordable, and reliable services. Thanks!",
    name: "Muse",
  },
  {
    id: 2,
    text: "Just made a purchase of Mobile Legends diamonds from this shop. Speedy, inexpensive, and reliable service. Thank you for the excellent experience!",
    name: "Naru",
  },
  {
    id: 3,
    text: "I highly recommend you guys to get topup from this store. Excellent and fast service. Go and get your work done. Hurry up!",
    name: "Aka",
  },
];

const duplicatedData = [...data, ...data, ...data];

const Testimonials = () => {
  return (
    <div className="flex flex-col items-center justify-center border-t border-gray-700 py-12 overflow-hidden">
      <div className="max-w-screen-xl mx-auto w-full">
        <h2 className="text-sm text-white font-bold text-center mb-2">
          Reviews
        </h2>
        <h3 className="text-lg font-bold text-white mb-6 text-center">
          What People Say About Us
        </h3>
        <div className="overflow-hidden">
          <Marquee
            pauseOnHover
            gradient={false}
            speed={70}
            className="flex py-4"
          >
            {duplicatedData.map((item, index) => (
              <TestimonialItem
                key={`${item.id}-${index}`}
                text={item.text}
                name={item.name}
              />
            ))}
          </Marquee>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
