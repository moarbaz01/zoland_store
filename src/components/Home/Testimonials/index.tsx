"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { FaQuoteLeft } from "react-icons/fa";
import { data } from "./data";
import { Autoplay, Pagination } from "swiper/modules";

const TestimonialItem = ({ text, name }: { text: string; name: string }) => {
  return (
    <div className="flex flex-col items-center cursor-pointer p-6 bg-primary border border-white rounded-lg shadow-lg transition-shadow duration-300 relative mx-auto">
      <FaQuoteLeft className="text-xl absolute bottom-4 left-4 text-white opacity-30" />
      <p className="text-sm italic text-center text-white">
        &quot;{text}&quot;
      </p>
      <span className="font-semibold text-white mt-3 text-sm">— {name}</span>
    </div>
  );
};

const Testimonials = () => {
  return (
    <div className="flex flex-col items-center justify-center border-t border-gray-700 py-12 px-4">
      <div className="max-w-screen-xl mx-auto w-full">
        <h2 className="text-sm text-white font-bold text-center mb-2">
          Reviews
        </h2>
        <h3 className="text-lg font-bold text-white mb-6 text-center">
          What People Say About Us
        </h3>
        <Swiper
          spaceBetween={20} // Adjust space between slides
          slidesPerView={1} // Show one testimonial at a time
          loop={true} // Loop through slides
          autoplay={{ delay: 3000 }} // Autoplay after 3 seconds
          pagination={{ clickable: true }} // Enable pagination dots
          breakpoints={{
            640: {
              slidesPerView: 2, // Display 2 slides on small screens
            },
            1024: {
              slidesPerView: 3, // Display 3 slides on larger screens
            },
          }}
          modules={[Pagination, Autoplay]}
          className="py-4"
        >
          {data.map((item, index) => (
            <SwiperSlide key={index}>
              <TestimonialItem text={item.text} name={item.name} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Testimonials;
