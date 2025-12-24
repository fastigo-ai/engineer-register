import React from "react";
import { Link } from "react-router-dom";
import Patner from "../assests/PartnerImage.png";

const Home = () => {
  return (
    <div className="bg-blue-50  flex flex-col items-center  px-4">
      <div className="max-w-6xl w-full flex flex-col lg:flex-row items-center justify-between">
        {/* Text Section */}
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Earn More. Earn Respect.
            <br />
            Safety Ensured.
          </h1>
          <p className="text-2xl text-gray-600">
            Join 5000+ service professionals* across India
          </p>
        </div>

        {/* Image Section */}
        <div className="mt-0 lg:mt-2">
          <img
            src={Patner}
            alt="Professionals"
            className="w-96 h-auto object-contain rounded-t-full"
          />
        </div>
      </div>
      {/* WhatsApp CTA Section */}
      <div className=" w-full max-w-6xl  rounded-l-xl shadow-md p-6 md:p-8 flex flex-col md:flex-col items-center justify-between gap-6 bg-[#0e7490]">
        <p className="text-white text-center md:text-left text-lg font-semibold">
          Share your WhatsApp number and we'll reach out via our WhatsApp
          Business Account.
        </p>

        <div className="flex flex-row w-full md:w-auto items-center rounded-md overflow-hidden shadow-sm">
          {/* Join Button */}
          <Link to="/register" className="w-full ">
            <button className="bg-gray-200 text-black hover:bg-cyan-500 hover:text-white font-semibold px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg rounded-md w-full">
              Join US
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
