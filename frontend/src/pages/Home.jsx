import React from "react";
import Hero from "../components/Hero";
import LatestCollection1 from "../components/LatestCollection1";
import LatestCollection from "../components/LatestCollection";
import About from "../pages/About"
import OurPolicy from "../components/OurPolicy";
import NewsletterBox from "../components/NewsletterBox";
import Services from "../pages/Services"

const Home = () => {
  return (
    <div>
      <Hero />
     
      <LatestCollection1 />
      <About />
      <Services />
    
      <NewsletterBox />
    </div>
  );
};

export default Home;
