import React from "react";
import aboutImg from "../assets/about_img.png"; // (1) Change image path here

const About = () => {
  return (
    <section
      className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20  bg-white" // (2) Section padding and max width
    >
      <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
        {/* (3) Flex gap and responsive layout */}

        {/* LEFT SIDE IMAGE */}
        <div className=" md:w-1/3 rounded-2xl overflow-hidden shadow-lg">
          {/* (4) Image container size + border radius */}
          <img
            src={aboutImg}
            alt="About Us"
            className="w-full h-[400px] md:h-[400px] object-cover" // (5) Image height control
          />
        </div>

        {/* RIGHT SIDE CONTENT */}
        <div className="w-full md:w-2/3 text-center md:text-left space-y-4 md:space-y-6">
          {/* (6) Content width + spacing */}

          <h2
            className="font-extrabold text-2xl md:text-4xl tracking-wide uppercase font-[Montserrat]"
            // (7) Heading font, size, tracking
          >
            ABOUT US
          </h2>

          <p
            className="text-sm md:text-base text-gray-600 leading-relaxed uppercase"
            // (8) Description size, color, spacing
          >
            We are passionate about delivering high-quality products and
            creating unique shopping experiences. Our mission is to provide
            value, trust, and satisfaction to every customer we serve. We are
            passionate about delivering high-quality products and creating
            unique shopping experiences. Our mission is to provide value, trust,
            and satisfaction to every customer we serve.We are passionate about
            delivering high-quality products and creating unique shopping
            experiences. Our mission is to provide value, trust, and
            satisfaction to every customer we serve.We are passionate about
            delivering high-quality products and creating unique shopping
            experiences. Our mission is to provide value, trust, and
            satisfaction to every customer we serve.We are passionate about
            delivering high-quality products and creating unique shopping
            experiences. Our mission is to provide value, trust, and
            satisfaction to every customer we serve.
          </p>

          <ul className="list-disc list-inside text-sm md:text-base text-gray-600 space-y-2 uppercase">
            {/* (9) Bullet points font, size, spacing */}
            <li>High-quality products</li>
            <li>Unique shopping experience</li>
            <li>Value, trust & satisfaction</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default About;
