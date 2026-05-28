import React from "react";
import NavBar from "../components/NavBar.jsx";
import Hero from "../components/Hero.jsx";
import AiTools from "../components/AiTools.jsx";
import Testimonial from "../components/Testimonial.jsx";
import Plan from "../components/Plan.jsx";
import Footer from "../components/Footer.jsx";

const Home = () => {
  return (
    <>
      <NavBar />
      <Hero/>
      <AiTools/>
      <Testimonial/>
      <Plan/>
      <Footer/>
    </>
  );
};

export default Home;
