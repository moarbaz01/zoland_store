// components/Footer.js
import React from "react";
import { FaHeart, FaWhatsapp, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <>
      <footer className="text-white border-t border-gray-700 py-12 sm:px-6 px-4">
        {/* Middle Section */}
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row sm:flex-wrap gap-8 sm:text-left">
          {/* Brand Info */}
          <div className="flex-1 w-full">
            <h2 className="text-3xl font-bold mb-4">
              Zoland<span className="text-teal-400">Store</span>
            </h2>
            <p className="text-md">
              Made with <FaHeart className="inline text-red-500" /> in India
            </p>
            <p className="text-md mt-2">+91 7085414571</p>
            <p className="text-md">zolandstore23@gmail.com</p>
            <p className="text-md">India</p>
          </div>

          {/* Quick Links */}
          <div className="flex justify-between flex-[2] ">
            <div className="flex-1">
              <h2 className="text-lg font-bold mb-4">Quick Links</h2>
              <ul className="text-sm space-y-2">
                <li>Login</li>
                <li>Register</li>
                <li>About Us</li>
              </ul>
            </div>

            {/* Important Links */}
            <div className="flex-1 ">
              <h2 className="text-lg font-bold mb-4">Important Links</h2>
              <ul className="text-sm space-y-2">
                <li>Terms & Conditions</li>
                <li>Privacy Policy</li>
                <li>Refund Policy</li>
              </ul>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex-1 min-w-[200px]">
            <h2 className="text-lg font-bold mb-4">Connect here</h2>
            <div className="flex space-x-4">
              <a
                href="https://wa.me/7085414571"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp className="text-xl hover:text-green-400 transition-colors duration-200" />
              </a>
              <a href="mailto:zolandstore23@gmail.com">
                <FaEnvelope className="text-xl hover:text-blue-400 transition-colors duration-200" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom Section */}
      <div className="py-6 px-6 sm:px-4  border-t border-gray-700 text-center">
        <div className="max-w-screen-xl mx-auto">
          <p className="text-sm">
            &copy; 2024 | ZOLAND STORE | All Rights Reserved
          </p>
        </div>
      </div>
    </>
  );
};

export default Footer;
