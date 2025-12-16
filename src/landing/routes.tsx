import React from "react";
import { Route, Routes } from "react-router-dom";
import H3StationLanding from "./pages/H3StationLanding";
import TechxenLanding from "../client/techxen/TechxenLanding";
import {
  TechxenHomePage,
  TechxenServicesPage,
  TechxenServiceIntroPage,
} from "../client/techxen/TechxenPages";

const LandingRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/h3station" element={<H3StationLanding />} />
      <Route path="/landing" element={<TechxenLanding />} />
      <Route path="/techxen/home" element={<TechxenHomePage />} />
      <Route path="/techxen/services" element={<TechxenServicesPage />} />
      <Route path="/techxen/service-intro" element={<TechxenServiceIntroPage />} />
    </Routes>
  );
};

export default LandingRoutes;














