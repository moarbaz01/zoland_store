import { FaGlobe, FaHeadset, FaShieldAlt, FaTruck } from "react-icons/fa";

const WhyChooseUs = () => {
  return (
    <div className="py-12 sm:px-6 px-4 border-t border-gray-700 flex items-center justify-center">
      <div className="h-fit flex max-w-screen-xl mx-auto w-full flex-col md:flex-row gap-6 md:gap-0 justify-between text-center">
        <div className="flex flex-col items-center">
          <FaTruck className="text-2xl" />
          <p className="mt-2 text-md">24/7 INSTANT DELIVERY</p>
        </div>
        <div className="flex flex-col items-center">
          <FaShieldAlt className="text-2xl" />
          <p className="mt-2 text-md">100% SAFE AND LEGITIMATE</p>
        </div>
        <div className="flex flex-col items-center">
          <FaGlobe className="text-2xl" />
          <p className="mt-2 text-md">EASY AND SECURE PAYMENT METHODS</p>
        </div>
        <div className="flex flex-col items-center">
          <FaHeadset className="text-2xl" />
          <p className="mt-2 text-md">24/7 SUPPORT</p>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
