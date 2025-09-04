import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import heroVideo from "../assets/hero.mp4";

const Hero = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [showText, setShowText] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle video and text timing
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const t = video.currentTime;

      // Visibility ranges
      const shouldShow =
        (t >= 14.7 && t <= 37) || (t >= 43 && t <= 62.7) || (t >= 69 && t <= 76);

      if (shouldShow !== showText) {
        setShowText(shouldShow);
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [showText]);

  return (
    <div
      className="w-full"
      style={{ fontFamily: "Montserrat, sans-serif", fontWeight: "800" }}
    >
      {/* Desktop/Tablet Layout */}
      {!isMobile && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="relative w-full flex items-center justify-center overflow-hidden"
        >
          {/* Background Video */}
          <video
            ref={videoRef}
            src={heroVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto max-h-screen object-contain"
          />

          {/* Dark Overlay - 10% */}
          <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>

          {/* Content */}
          <AnimatePresence>
            {showText && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute inset-0 flex items-center justify-center z-10 px-4 sm:px-6 md:px-12"
              >
                <div className="text-center text-white uppercase tracking-wider">
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-4xl md:text-4xl lg:text-6xl mb-6"
                  >
                    WE DREAM WE CREATE WE PRESENT
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-xs sm:text-sm md:text-base text-center mb-6 max-w-2xl mx-auto"
                  >
                    Wellfire Media is where art, business, and bold imagination
                    collide. We are a next-gen creative powerhouse building
                    films, digital media, and lifestyle experiences that inspire
                    and disrupt.
                  </motion.p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      )}

      {isMobile && (
        <div className="w-full h-screen relative">
          {/* Video Section */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative w-full h-full flex items-center justify-center overflow-hidden"
          >
            <video
              ref={videoRef}
              src={heroVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            {/* Overlay for dark effect */}
            <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>

            {/* Text Section Over Video */}
            <AnimatePresence>
              {showText && (
                <div className="absolute bottom-18 w-full text-center px-4">
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-white text-2xl sm:text-3xl font-bold mb-3 uppercase tracking-wider"
                  >
                    WE DREAM WE CREATE WE PRESENT
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-white text-sm sm:text-base max-w-xs mx-auto"
                  >
                    At Wellfire, we don’t just make content. We create
                    experiences that last.
                  </motion.p>
                </div>
              )}
            </AnimatePresence>
          </motion.section>
        </div>
      )}
    </div>
  );
};

export default Hero;
