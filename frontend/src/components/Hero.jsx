import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import heroVideo from "../assets/hero.mp4";
const Hero = () => {
  const navigate = useNavigate();

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="relative w-full h-[60vh] sm:h-[70vh] md:h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Video */}
      <video
        src={heroVideo}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 md:px-12 max-w-4xl">
        <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white uppercase leading-tight">
          Discover Your Next Favorite Visual
        </h1>
        <p className="mt-3 sm:mt-5 text-sm sm:text-lg md:text-xl text-gray-200 leading-relaxed">
          Explore our extensive collection of video albums and media projects,
          each designed to captivate and inspire. Experience the quality and
          creativity that defines our work.
        </p>
      </div>
    </motion.section>
  );
};

export default Hero;
