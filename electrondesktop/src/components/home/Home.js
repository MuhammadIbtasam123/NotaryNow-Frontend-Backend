import React, { useEffect } from "react";
import "../../App.css";
import Nav from "./Nav";
import Header from "./Header";
import Footer from "./Footer";
import WhyUs from "./WhyUs";
import Team from "./Team";
import ConatctUs from "./ConatctUs";
import HowItWorks from "./HowItWorks";
import "./homeStyles.css";
const Home = () => {
  const [buttonType, setButtonType] = React.useState("Home");

  //scroll among sections
  useEffect(() => {
    const scrollToElement = () => {
      setButtonType(buttonType.toLowerCase().split(" ")[0]);
      const element = document.querySelector("#" + buttonType + "");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    scrollToElement();
  }, [buttonType]);

  return (
    <div className="home-container">
      <section className="upper-section">
        <div id="Home">
          <Nav setButtonType={setButtonType} />
        </div>
        <div>
          <Header />
        </div>
      </section>
      <section id="about" className="content-section">
        <WhyUs />
      </section>
      <section id="how" className="content-section">
        <HowItWorks />
      </section>
      <section id="Team" className="content-section">
        <Team />
      </section>
      <section id="Contact" className="content-section">
        <ConatctUs />
      </section>
      <Footer />
    </div>
  );
};
export default Home;
