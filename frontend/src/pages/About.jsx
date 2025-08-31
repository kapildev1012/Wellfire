import React from "react";
import { assets } from "../assets/assets";
import Title from "../components/Title";

const About = () => {
  return (
    <div className="bg-white text-black rounded-3xl min-h-screen p-2 sm:p-4 lg:p-6">
      {/* Main Container */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg sm:shadow-xl lg:shadow-2xl overflow-hidden">
        {/* Header Section */}
        <div className="relative bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 rounded-t-xl sm:rounded-t-2xl lg:rounded-t-3xl py-4 sm:py-6 lg:py-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent"></div>
          <div className="relative z-10 text-center">
            <div className="text-xl sm:text-2xl lg:text-3xl text-black font-bold tracking-wide">
              <Title text1={"ABOUT"} text2={"US"} />
            </div>
            <div className="w-16 sm:w-24 h-0.5 bg-gradient-to-r from-black to-gray-400 mx-auto mt-2"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-3 sm:p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 items-start">
            {/* Image Section */}
            <div className="w-full lg:w-2/5 xl:w-1/2">
              <div className="group relative rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                <img
                  className="w-full h-48 sm:h-56 lg:h-64 xl:h-72 object-cover transform group-hover:scale-105 transition-transform duration-700"
                  src={assets.about_img}
                  alt="Wellfire Media"
                />
              </div>
            </div>

            {/* Content Section */}
            <div className="w-full lg:w-3/5 xl:w-1/2 space-y-3 sm:space-y-4 lg:space-y-5">
              {/* Main Description */}
              <div className="group bg-gradient-to-br from-gray-50 to-slate-100 rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                <p className="text-gray-800 text-xs sm:text-sm lg:text-base leading-relaxed font-medium">
                  Wellfire Media is where art, business, and bold imagination
                  collide. We are a next-gen creative powerhouse building films,
                  digital media, and lifestyle experiences that inspire and
                  disrupt.
                </p>
              </div>

              {/* Mission Section */}
              <div className="group bg-gradient-to-br from-slate-900 to-black rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white">
                    Our Mission
                  </h3>
                </div>
                <p className="text-gray-300 text-xs sm:text-sm lg:text-base leading-relaxed">
                  Empowering customers with choice, convenience, and confidence
                  through seamless experiences that exceed expectations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="bg-gradient-to-b from-white via-gray-25 to-slate-50 px-3 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
          {/* Section Title */}
          <div className="text-center mb-4 sm:mb-6 lg:mb-8">
            <div className="text-lg sm:text-xl lg:text-2xl text-black font-bold mb-1 sm:mb-2">
              <Title text1={"WHY"} text2={"CHOOSE US"} />
            </div>
            <div className="w-12 sm:w-20 h-0.5 bg-gradient-to-r from-black to-gray-400 mx-auto"></div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {/* Quality Card */}
            <div className="group bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-lg border border-gray-100 hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 bg-gradient-to-br from-slate-800 to-black text-white rounded-lg p-2 sm:p-2.5 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm sm:text-base font-bold text-black mb-1 sm:mb-2">
                    Quality Assurance
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    We produce bold, visionary content and power productions
                    with world-class support.
                  </p>
                </div>
              </div>
            </div>

            {/* Creative Excellence Card */}
            <div className="group bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-lg border border-gray-100 hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 bg-gradient-to-br from-slate-800 to-black text-white rounded-lg p-2 sm:p-2.5 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm sm:text-base font-bold text-black mb-1 sm:mb-2">
                    Creative Excellence
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Original films, series, and digital media that spark ideas
                    and push boundaries.
                  </p>
                </div>
              </div>
            </div>

            {/* Global Reach Card */}
            <div className="group bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-lg border border-gray-100 hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] md:col-span-2 xl:col-span-1">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 bg-gradient-to-br from-slate-800 to-black text-white rounded-lg p-2 sm:p-2.5 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm sm:text-base font-bold text-black mb-1 sm:mb-2">
                    Global Reach
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Seamless operations across USA, Canada, UK, UAE, Bahrain,
                    India, and Australia.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Accent */}
       
      </div>
      
    </div>
  );
};

export default About;
