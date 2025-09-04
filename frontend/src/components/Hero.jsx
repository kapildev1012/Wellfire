import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import heroVideo from "../assets/hero.mp4";

const Hero = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [showText, setShowText] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

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
            muted={isMuted}
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
                    className="text-4xl md:text-6xl lg:text-8xl mb-6"
                  >
                    YOUR TITLE HERE
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-sm md:text-base lg:text-lg mb-8 max-w-3xl"
                  >
                    YOUR SUBTITLE OR DESCRIPTION HERE
                  </motion.p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      )}

      {/* Mobile Layout - Reels-like */}
      {isMobile && (
        <div className="w-full">
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative w-full h-[100svh] min-h-screen overflow-hidden"
          >
            <video
              ref={videoRef}
              src={heroVideo}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Gradient overlay for readability */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

            {/* Mute toggle */}
            <button
              type="button"
              onClick={() => setIsMuted((m) => !m)}
              aria-label={isMuted ? "Unmute video" : "Mute video"}
              className="absolute right-4 top-4 z-20 rounded-full bg-black/40 text-white p-2 backdrop-blur-sm"
            >
              {isMuted ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M11.25 3.106a.75.75 0 0 1 .75.75v16.288a.75.75 0 0 1-1.2.6L6.3 17.25H3.75A1.75 1.75 0 0 1 2 15.5v-7A1.75 1.75 0 0 1 3.75 6.75H6.3l4.5-3.494a.75.75 0 0 1 .45-.15zM16.72 8.47a.75.75 0 0 1 1.06 0L19 9.69l1.22-1.22a.75.75 0 1 1 1.06 1.06L20.06 10.75l1.22 1.22a.75.75 0 1 1-1.06 1.06L19 11.81l-1.22 1.22a.75.75 0 1 1-1.06-1.06l1.22-1.22-1.22-1.22a.75.75 0 0 1 0-1.06z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M11.25 3.106a.75.75 0 0 1 .75.75v16.288a.75.75 0 0 1-1.2.6L6.3 17.25H3.75A1.75 1.75 0 0 1 2 15.5v-7A1.75 1.75 0 0 1 3.75 6.75H6.3l4.5-3.494a.75.75 0 0 1 .45-.15zM16.5 8.25a.75.75 0 0 1 .75.75v5a.75.75 0 0 1-1.5 0v-5a.75.75 0 0 1 .75-.75zm3 1.5a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 .75-.75z" />
                </svg>
              )}
            </button>

            {/* Text overlay */}
            <AnimatePresence>
              {showText && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 40 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute inset-x-0 bottom-0 z-10 p-6 text-white"
                >
                  <div className="uppercase tracking-wider">
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      className="text-2xl sm:text-3xl mb-2"
                    >
                      YOUR TITLE HERE
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="text-xs sm:text-sm opacity-90"
                    >
                      YOUR SUBTITLE OR DESCRIPTION HERE
                    </motion.p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        </div>
      )}
    </div>
  );
};

export default Hero;
