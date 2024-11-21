import { FaGlobe, FaHeadset, FaShieldAlt, FaTruck } from "react-icons/fa";

const WhyChooseUs = () => {
  return (
    <div className="py-12 sm:px-6 px-4 border-t border-gray-700 flex items-center justify-center bg-black">
      <div className="flex max-w-screen-xl mx-auto w-full flex-col md:flex-row gap-6 md:gap-10 justify-center text-center">
        <div className="flex flex-col items-center transform transition-transform duration-300 hover:scale-105">
          <div className="bg-indigo-600 text-white p-4 rounded-full shadow-lg mb-4">
            <FaTruck className="text-3xl" />
          </div>
          <p className="mt-2 text-lg font-semibold text-white">
            24/7 INSTANT DELIVERY
          </p>
        </div>
        <div className="flex flex-col items-center transform transition-transform duration-300 hover:scale-105">
          <div className="bg-green-600 text-white p-4 rounded-full shadow-lg mb-4">
            <FaShieldAlt className="text-3xl" />
          </div>
          <p className="mt-2 text-lg font-semibold text-white">
            100% SAFE AND LEGITIMATE
          </p>
        </div>
        <div className="flex flex-col items-center transform transition-transform duration-300 hover:scale-105">
          <div className="bg-blue-600 text-white p-4 rounded-full shadow-lg mb-4">
            <FaGlobe className="text-3xl" />
          </div>
          <p className="mt-2 text-lg font-semibold text-white">
            EASY AND SECURE PAYMENT METHODS
          </p>
        </div>
        <div className="flex flex-col items-center transform transition-transform duration-300 hover:scale-105">
          <div className="bg-purple-600 text-white p-4 rounded-full shadow-lg mb-4">
            <FaHeadset className="text-3xl" />
          </div>
          <p className="mt-2 text-lg font-semibold text-white">24/7 SUPPORT</p>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
