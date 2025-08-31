import React from "react";
import { motion } from "framer-motion";
import { Film, Camera, Landmark } from "lucide-react"; // icons
import NewsletterBox from "../components/NewsletterBox";
const Services = () => {
  return (
    <div className="bg-black text-white px-6 md:px-16 lg:px-24 py-16">
      {/* Services Head */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-3xl md:text-5xl font-bold text-center mb-12"
      >
        Our Services
      </motion.h2>

      {/* Services Grid */}
      <div className="grid md:grid-cols-3 gap-10">
        {/* Media Production */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gray-900 rounded-2xl p-6 shadow-lg"
        >
          <Film className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-xl font-semibold mb-3">Media Production</h3>
          <p className="text-gray-300">
            We create original films, series, and digital media that spark
            ideas, inspire audiences, and push creative boundaries.
          </p>
        </motion.div>

        {/* Line Production */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-gray-900 rounded-2xl p-6 shadow-lg"
        >
          <Camera className="w-12 h-12 text-blue-500 mb-4" />
          <h3 className="text-xl font-semibold mb-3">
            Line Production Services
          </h3>
          <p className="text-gray-300 mb-2">
            Beyond our own projects, we offer line production services to
            filmmakers, studios, and production houses worldwide.
          </p>
          <p className="text-gray-400 text-sm">
            🌍 Operating across USA, Canada, UK, UAE, Bahrain, India, and
            Australia.
          </p>
        </motion.div>

        {/* Government Subsidy */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-gray-900 rounded-2xl p-6 shadow-lg"
        >
          <Landmark className="w-12 h-12 text-green-500 mb-4" />
          <h3 className="text-xl font-semibold mb-3">
            Government Subsidy Guidance
          </h3>
          <p className="text-gray-300 mb-2">
            We help you access subsidies and incentives when producing
            internationally — making your project financially efficient while
            keeping quality uncompromised.
          </p>
        </motion.div>
      </div>

      {/* CTA Buttons */}
      <div className="flex justify-center gap-6 mt-12">
        <a
          href="mailto:info.wellfire@gmail.com"
          className="bg-red-700 hover:bg-red-700 rounded-2xl px-6 py-2 font-medium transition"
        >
          Work With Us
        </a>
        <a
          href="https://wa.me/917506312117"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-red-700 hover:bg-red-700 rounded-2xl px-6 py-2 font-medium transition"
        >
          Contact Us
        </a>
      </div>
   
    </div>
  );
};

export default Services;
