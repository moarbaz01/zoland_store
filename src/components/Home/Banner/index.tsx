"use client"; // Ensures that the component uses client-side rendering

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/swiper-bundle.css"; // Make sure the Swiper CSS is imported
import Image from "next/image";

const Banner = () => {
  return (
    <div className="relative">
      <div className="max-w-screen-xl mx-auto mt-6 md:px-0 px-4">
        <Swiper
          spaceBetween={10} // Adjust space between slides
          slidesPerView={1} // Only one slide per view
          pagination={{
            clickable: true, // Make dots clickable
            type: "bullets", // Use bullet dots for pagination
          }}
          loop={true} // Loop through slides
          autoplay={{
            delay: 2000, // Auto play with 1 second delay
            disableOnInteraction: false, // Ensures autoplay continues after user interaction
          }}
          effect="fade" // Apply the fade effect
          modules={[Pagination, Autoplay, EffectFade]} // Import the fade effect module
        >
          <SwiperSlide>
            <Image
              src="/images/banner1.webp"
              alt="Zoland Store Banner 1"
              layout="responsive"
              priority={true}
              width={1600} // Adjust for large screen resolution
              height={600} // Adjust height proportionally
              className="w-full max-h-[80vh] object-cover rounded-xl border-2 border-white" // Ensures image scaling with aspect ratio
            />
          </SwiperSlide>
          <SwiperSlide>
            <Image
              src="/images/banner2.webp"
              alt="Zoland Store Banner 2"
              layout="responsive"
              priority={true}
              width={1600} // Adjust for large screen resolution
              height={600} // Adjust height proportionally
              className="w-full max-h-[80vh] object-cover rounded-xl border-2 border-white" // Ensures image scaling with aspect ratio
            />
          </SwiperSlide>
          <SwiperSlide>
            <Image
              src="/images/banner3.webp"
              alt="Zoland Store Banner 3"
              layout="responsive"
              priority={true}
              width={1600} // Adjust for large screen resolution
              height={600} // Adjust height proportionally
              className="w-full max-h-[80vh] object-cover rounded-xl border-2 border-white" // Ensures image scaling with aspect ratio
            />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default Banner;
