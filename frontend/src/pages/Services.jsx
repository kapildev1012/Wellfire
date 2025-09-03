import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const { products } = useContext(ShopContext);
  const [latest, setLatest] = useState({
    music: null,
    film: null,
    commercial: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const getLatest = (category) => {
      return (
        products
          ?.filter(
            (item) =>
              item.category?.toLowerCase() === category.toLowerCase() ||
              item.subCategory?.toLowerCase() === category.toLowerCase()
          )
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] ||
        null
      );
    };

    setLatest({
      music: getLatest("music"),
      film: getLatest("film"),
      commercial: getLatest("commercial"),
    });
  }, [products]);

  const ServiceCard = ({ product, title, target, description }) => {
    if (!product) return null;
    return (
      <motion.div
        className="flex flex-col gap-4 cursor-pointer"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        onClick={() => navigate(`/latestcollection1#${target}`)}
      >
        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-56 sm:h-64 lg:h-72 object-cover rounded-2xl shadow-md"
        />

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold uppercase">
          {product.name}
        </h3>

        {/* Description (3 lines on mobile, full on larger screens) */}
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed line-clamp-3 md:line-clamp-none">
          {description}
        </p>
      </motion.div>
    );
  };

  return (
    <section className="bg-gray-50 px-6 md:px-16 lg:px-24 py-16 md:py-20">
      <div className="grid md:grid-cols-4 gap-12">
        {/* Left Intro */}
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Services</h2>
          <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed">
            Explore our latest highlights in Films, Music, and Commercials. Each
            category showcases our newest work, blending creativity, vision, and
            innovation to deliver outstanding experiences.
          </p>
          <a
            href="mailto:info.wellfire@gmail.com"
            className="font-semibold text-gray-900 border-b-2 border-red-500 inline-block"
          >
            Get in touch
          </a>
        </div>

        {/* Right Side - Service Cards */}
        <div className="md:col-span-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <ServiceCard
            product={latest.film}
            title="Films"
            target="films"
            description="Our films explore powerful stories with stunning visuals and emotion. From short films to feature productions, we focus on creativity and storytelling that connects with audiences and leaves a lasting impression."
          />
          <ServiceCard
            product={latest.music}
            title="Music"
            target="music"
            description="We create original music that inspires, moves, and resonates. From cinematic scores to modern tracks, our music production blends creativity with emotion to deliver unique soundscapes for every project."
          />
          <ServiceCard
            product={latest.commercial}
            title="Commercials"
            target="commercials"
            description="Our commercials bring brands to life with bold ideas and striking visuals. We craft campaigns that resonate emotionally, engage audiences, and make brands stand out in today’s competitive marketplace."
          />
        </div>
      </div>
    </section>
  );
};

export default Services;
