"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaTachometerAlt,
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaCogs,
} from "react-icons/fa";
import { HiMenuAlt1 } from "react-icons/hi"; // Hamburger icon

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // Initialize useRouter to get the current route

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path: string) => pathname === path; // Helper function to check active route

  // Sidebar links data
  const links = [
    { href: "/dashboard", label: "Dashboard", icon: FaTachometerAlt },
    { href: "/dashboard/products", label: "Products", icon: FaBox },
    { href: "/dashboard/orders", label: "Orders", icon: FaShoppingCart },
    { href: "/dashboard/customers", label: "Customers", icon: FaUsers },
    { href: "/dashboard/settings", label: "Settings", icon: FaCogs },
  ];

  return (
    <div className={`relative ${isOpen ? "block" : "hidden"} md:block`}>
      {/* Sidebar background overlay */}
      <div
        className={`fixed inset-0 bg-black opacity-50 z-10 md:hidden ${
          isOpen ? "block" : "hidden"
        }`}
        onClick={toggleSidebar}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-20 w-64 h-full bg-gradient-to-br bg-gray-800 shadow-xl transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 bg-gray-800">
          <div className="flex items-center space-x-3">
            {/* Company Logo */}
            <span className="text-2xl font-semibold tracking-wide">
              Zoland <span className="text-primary">Admin</span>
            </span>
          </div>
          <button
            onClick={toggleSidebar}
            className="md:hidden text-white p-2 hover:bg-gray-700 rounded-full"
          >
            <span>&#10005;</span> {/* Close button */}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="mt-4">
          <ul>
            {links.map(({ href, label, icon: Icon }) => (
              <li key={href} className="mt-2">
                <Link
                  href={href}
                  className={`flex items-center p-4 rounded-lg transition-colors ${
                    isActive(href)
                      ? "bg-gray-700 text-primary"
                      : "hover:bg-gray-700"
                  }`}
                >
                  <Icon className="mr-4 text-lg" />
                  <span className="text-lg">{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Hamburger Button for Mobile */}
      <button
        className="md:hidden absolute top-4 left-4 z-20 text-white text-2xl"
        onClick={toggleSidebar}
      >
        <HiMenuAlt1 />
      </button>
    </div>
  );
};

export default Sidebar;
