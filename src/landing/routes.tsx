import React from "react";
import { Route, Routes } from "react-router-dom";
import H3StationLanding from "./pages/H3StationLanding";

const LandingRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/h3station" element={<H3StationLanding />} />
    </Routes>
  );
};

export default LandingRoutes;














