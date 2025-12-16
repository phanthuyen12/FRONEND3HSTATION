import React from "react";
import Header1 from "./Components/Header/Header1.jsx";
import Footer1 from "./Components/Footer/Footer1.jsx";
import Home from "./Pages/Home.jsx";
import ServicePage from "./Pages/ServicePage.jsx";
import ServiceDetailsLeft from "./Pages/ServiceDetailsLeft.jsx";

import "./assets/main.css";
import "slick-carousel/slick/slick.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export const TechxenHomePage: React.FC = () => (
  <div className="techxen-landing">
    <Header1 />
    <Home />
    <Footer1 />
  </div>
);

export const TechxenServicesPage: React.FC = () => (
  <div className="techxen-landing">
    <Header1 />
    <ServicePage />
    <Footer1 />
  </div>
);

export const TechxenServiceIntroPage: React.FC = () => (
  <div className="techxen-landing">
    <Header1 />
    <ServiceDetailsLeft />
    <Footer1 />
  </div>
);


