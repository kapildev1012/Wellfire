import React, { useEffect } from "react";
import { motion } from "framer-motion";
import aboutImg from "../assets/about_img.png";

const About = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row items-center gap-10 md:gap-16"
        >
          {/* LEFT SIDE IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full md:w-1/3 rounded-2xl overflow-hidden shadow-xl"
          >
            <img
              src={aboutImg}
              alt="About Us"
              className="w-full h-[320px] md:h-[400px] object-cover hover:scale-105 transition-transform duration-700"
            />
          </motion.div>

          {/* RIGHT SIDE CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-full md:w-2/3 text-center md:text-left space-y-4 md:space-y-6"
          >
            <h1
              className="font-extrabold text-2xl md:text-4xl lg:text-5xl tracking-wide uppercase text-gray-900"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: "800",
              }}
            >
              ABOUT US
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="space-y-4 md:space-y-6"
            >
              <p
                className="text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: "400",
                }}
              >
                We are passionate about delivering high-quality products and creating unique shopping experiences. Our mission is to provide value, trust, and satisfaction to every customer we serve.
              </p>
              
              <p
                className="text-xs md:text-sm lg:text-base text-gray-600 leading-relaxed"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: "400",
                }}
              >
                With years of experience in the industry, we specialize in creating exceptional content that resonates with audiences worldwide. Our team combines creativity with technical expertise to deliver outstanding results that exceed expectations.
              </p>
              
              <p
                className="text-xs md:text-sm lg:text-base text-gray-600 leading-relaxed"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: "400",
                }}
              >
                From concept to completion, we work closely with our clients to bring their vision to life. Our commitment to excellence and attention to detail sets us apart in everything we do.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mt-6"
            >
              {[
                { title: "High-Quality Products", desc: "Premium materials and craftsmanship" },
                { title: "Unique Experience", desc: "Tailored solutions for every client" },
                { title: "Trust & Satisfaction", desc: "Building lasting relationships" },
                { title: "Creative Excellence", desc: "Innovative and artistic approach" },
                { title: "Professional Service", desc: "Dedicated support throughout" },
                { title: "Timely Delivery", desc: "Meeting deadlines consistently" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                  className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-shadow duration-300"
                >
                  <h3
                    className="font-semibold text-xs md:text-sm text-gray-900 mb-1.5 uppercase"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: "600",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-xs text-gray-600"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: "400",
                    }}
                  >
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default About;
