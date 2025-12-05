import React from "react";
import { Route, Routes } from "react-router-dom";

// Import CSS và asset từ project dexon-react
import "slick-carousel/slick/slick.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../dexon-react/src/assets/main.css";
import "../../dexon-react/src/assets/responsive.css";

// Import layout & pages từ dexon-react
import Main from "../../dexon-react/src/Layout/Main.jsx";
import Layout2 from "../../dexon-react/src/Layout/Layout2.jsx";

import Home from "../../dexon-react/src/Pages/Home.jsx";
import Home2 from "../../dexon-react/src/Pages/Home2.jsx";
import AboutPage from "../../dexon-react/src/Pages/AboutPage.jsx";
import ServicePage from "../../dexon-react/src/Pages/ServicePage.jsx";
import ServiceDetailsPage from "../../dexon-react/src/Pages/ServiceDetailsPage.jsx";
import TeamPage from "../../dexon-react/src/Pages/TeamPage.jsx";
import PricingPage from "../../dexon-react/src/Pages/PricingPage.jsx";
import FaqPage from "../../dexon-react/src/Pages/FaqPage.jsx";
import ContactPage from "../../dexon-react/src/Pages/ContactPage.jsx";
import BlogGridPage from "../../dexon-react/src/Pages/BlogGridPage.jsx";
import BlogSidebarPage from "../../dexon-react/src/Pages/BlogSidebarPage.jsx";
import BlogDeatilsPage from "../../dexon-react/src/Pages/BlogDeatilsPage.jsx";

/**
 * Router cho landing page Dexon (dựa trên Routes.jsx của dexon-react)
 *
 * Base path: /dexon/*
 *
 * - /dexon                  -> Main + Home
 * - /dexon/about            -> AboutPage
 * - /dexon/service          -> ServicePage
 * - /dexon/service/service-details -> ServiceDetailsPage
 * - /dexon/team             -> TeamPage
 * - /dexon/pricing          -> PricingPage
 * - /dexon/faq              -> FaqPage
 * - /dexon/contact          -> ContactPage
 * - /dexon/blog             -> BlogGridPage
 * - /dexon/blog-sidebar     -> BlogSidebarPage
 * - /dexon/blog/blog-details -> BlogDeatilsPage
 *
 * - /dexon/home2            -> Layout2 + Home2
 */
const DexonRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Nhóm route chính dùng layout Main */}
      <Route path="" element={<Main />}>
        <Route index element={<Home />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="service" element={<ServicePage />} />
        <Route
          path="service/service-details"
          element={<ServiceDetailsPage />}
        />
        <Route path="team" element={<TeamPage />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="faq" element={<FaqPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="blog" element={<BlogGridPage />} />
        <Route path="blog-sidebar" element={<BlogSidebarPage />} />
        <Route path="blog/blog-details" element={<BlogDeatilsPage />} />
      </Route>

      {/* Nhóm route home2 dùng layout Layout2 */}
      <Route path="home2" element={<Layout2 />}>
        <Route index element={<Home2 />} />
      </Route>
    </Routes>
  );
};

export default DexonRoutes;


