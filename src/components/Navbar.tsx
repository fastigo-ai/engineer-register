import React, { useState, useRef, useEffect } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import Logo from "../assests/Logo-removebg-preview (1).png";

const cities = [
  "Delhi NCR",
  "Mumbai",
  "Bengaluru",
  "Hyderabad",
  "Pune",
  "Kolkata",
  "Chandigarh",
];

const Navbar = () => {
  const [selectedCity, setSelectedCity] = useState("Delhi NCR");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo + Brand */}
        <Link to="/" className="flex  ">
          <img src={Logo} alt="Logo" className="w-32 h-10 object-cover" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 text-gray-700 text-sm font-medium">
          <Link to="https://www.door2fy.com/" className="hover:text-black">Book a service</Link>
          <Link to="/about" className="hover:text-black">About us</Link>

          {/* City Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md shadow-sm"
            >
              <img
                src="https://flagcdn.com/w40/in.png"
                alt="India"
                className="w-5 h-3 object-cover"
              />
              <span>{selectedCity}</span>
              <IoChevronDown className="text-gray-600" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow z-10">
                {cities.map((city, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedCity(city);
                      setIsDropdownOpen(false);
                    }}
                    className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    {city}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(true)}>
            <FiMenu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Slide-out Menu */}
      {isMobileMenuOpen && (
        <div className="fixed top-0 right-0 h-full w-64 bg-white z-50 shadow-lg transition-transform duration-300 ease-in-out">
          <div className="flex justify-between items-center px-4 py-3 border-b">
            <span className="text-lg font-semibold">Menu</span>
            <button onClick={() => setIsMobileMenuOpen(false)}>
              <IoClose size={24} />
            </button>
          </div>

          <div className="p-4 flex flex-col gap-4 text-sm text-gray-800">
            <a
              href="https://www.door2fy.com/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-black"
            >
              Book a service
            </a>
            <Link
              to="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-black"
            >
              About us
            </Link>

            {/* Mobile City Selector */}
            <div className="mt-4">
              <p className="font-medium mb-2">Select City</p>
              <div className="border rounded">
                {cities.map((city, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedCity(city);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                      selectedCity === city ? "bg-gray-200" : ""
                    }`}
                  >
                    {city}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
