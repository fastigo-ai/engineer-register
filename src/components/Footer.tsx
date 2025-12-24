import React from "react";
import { FaLinkedin, FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black text-white text-sm px-4 pt-8 pb-4">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto">
        <p className="mb-2 font-semibold">100% Purely Bhartiya Brand </p>
        <h2 className="text-lg font-bold mb-2">We Are Live In 48 Cities</h2>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-gray-300 text-sm mb-6">
          {[
            "Agra",
            "Ahmedabad",
            "Aligarh",
            "Amritsar",
            "Bareilly",
            "Bengaluru",
            "Bhagalpur",
            "Bhopal",
            "Bhubaneswar",
            "Chandigarh",
            "Cuttack",
            "Dehradun",
            "Delhi",
            "Faridabad",
            "Gandhi Nagar",
            "Ghaziabad",
            "Gorakhpur",
            "Greater Noida",
            "Gurugram",
            "Gwalior",
            "Haridwar",
            "Haldwani",
            "Hyderabad",
            "Indore",
            "Jabalpur",
            "Jaipur",
            "Jhansi",
            "Kanpur",
            "Lucknow",
            "Ludhiana",
            "Meerut",
            "Mohali",
            "Moradabad",
            "Mumbai",
            "Mysuru",
            "Nagpur",
            "Noida",
            "Patna",
            "Panchkula",
            "Prayagraj",
            "Pune",
            "Raipur",
            "Roorkee",
            "Rudrapur",
            "Tirupati",
            "Ujjain",
            "Varanasi",
            "Vijayawada",
            "Zirakpur",
            "New Delhi",
          ].map((city, idx) => (
            <span key={idx}>| {city}</span>
          ))}
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-700 pt-6">
          <div>
            <h3 className="text-cyan-400 font-semibold mb-2">Company</h3>
            <ul className="space-y-1">
              <li className="cursor-pointer">About Us</li>
              <li className="cursor-pointer">Terms & Conditions</li>
              <li className="cursor-pointer">Privacy Policy</li>
              <li className="cursor-pointer">Anti-Discrimination Policy</li>
            </ul>
          </div>
          <div>
            <h3 className="text-cyan-400 font-semibold mb-2">For Customers</h3>
            <ul className="space-y-1">
              <li className="cursor-pointer">Refundable Policy</li>

              <li className="cursor-pointer">Contact Us</li>
            </ul>
          </div>
          <div>
            <h3 className="text-cyan-400 font-semibold mb-2">For Partners</h3>
            <ul className="space-y-1">
              <Link to="/Register-Professional">
                <li className="cursor-pointer">Register as a Professional</li>
              </Link>
            </ul>
          </div>
        </div>

        {/* Social and App Download */}
        <div className="mt-6 border-t border-gray-700 pt-4 flex flex-col items-center gap-4">
          <div className="flex gap-4 text-white text-xl">
            <FaLinkedin className="cursor-pointer" />
            <FaInstagram className="cursor-pointer" />
            <FaFacebook className="cursor-pointer" />
            <FaTwitter className="cursor-pointer" />
          </div>
          <div className="text-cyan-400 font-semibold">Download Our App</div>
          <div className="flex gap-3">

  <a
    href="https://play.google.com/store/apps/details?id=com.Door2fy&pli=1"
    target="_blank"
    rel="noopener noreferrer"
  >
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/5/5f/Available_on_the_App_Store_(black)_SVG.svg"
      alt="App Store"
      className="h-10 cursor-pointer"
    />
  </a>

  <a
    href="https://play.google.com/store/apps/details?id=com.Door2fy&pli=1"
    target="_blank"
    rel="noopener noreferrer"
  >
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
      alt="Google Play"
      className="h-10 cursor-pointer"
    />
  </a>

</div>

        </div>

        {/* Copyright  */}
        <p className="text-center mt-6 text-gray-400 text-xs border-t border-gray-700 pt-4">
          © Copyright 2024 Doorfy. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
