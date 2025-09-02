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
      className="relative w-full flex items-center justify-center overflow-hidden"
    >
      {/* Background Video (keep aspect ratio, no stretch) */}
      <video
        src={heroVideo}
        autoPlay
        loop
        
        playsInline
        className="w-full h-auto max-h-screen object-contain"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center z-10 px-4 sm:px-6 md:px-12">
        
      </div>
    </motion.section>
  );
};

export default Hero;
