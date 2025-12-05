/**
 * Static imports mapping cho tất cả các pages từ charius-react
 * Điều này giúp Vite có thể analyze và bundle đúng cách
 */

import React from "react";

// Home Pages
import HomePage from "./main-component/HomePage/HomePage.jsx";
import HomePage2 from "./main-component/HomePage2/HomePage2.jsx";
import HomePage3 from "./main-component/HomePage3/HomePage3.jsx";
import HomePage4 from "./main-component/HomePage4/HomePage4.jsx";

// About Page
import AboutPage from "./main-component/AboutPage/AboutPage.jsx";

// Gallery Page
import GalleryPage from "./main-component/GalleryPage/GalleryPage.jsx";

// Testimonial Page
import TestimonialPage from "./main-component/TestimonialPage/TestimonialPage.jsx";

// Causes Pages
import CausePageOn from "./main-component/CausePageOn/CausePageOn.jsx";
import CausePagetwo from "./main-component/CausePagetwo/CausePagetwo.jsx";
import CausePagethre from "./main-component/CausePagethre/CausePagethre.jsx";
import CauseSinglePage from "./main-component/CauseSinglePage/CauseSinglePage.jsx";

// Volunteer Pages
import Volunteer from "./main-component/TeamPage/TeamPage.jsx";
import VolunteerSinglePage from "./main-component/VolunteerSinglePage/VolunteerSinglePage.jsx";

// Service Pages
import ServicePage from "./main-component/ServicePage/ServicePage.jsx";
import ServiceSinglePage from "./main-component/ServiceSinglePage/ServiceSinglePage.jsx";

// Donate Page
import DonatePage from "./main-component/DonatePage/DonatePage.jsx";

// Event Pages
import EventPage from "./main-component/EventPage/EventPage.jsx";
import EventSinglePage from "./main-component/EventSinglePage/EventSinglePage.jsx";

// Blog Pages
import BlogPage from "./main-component/BlogPage/BlogPage.jsx";
import BlogPageLeft from "./main-component/BlogPageLeft/BlogPageLeft.jsx";
import BlogPageFullwidth from "./main-component/BlogPageFullwidth/BlogPageFullwidth.jsx";
import BlogDetails from "./main-component/BlogDetails/BlogDetails.jsx";
import BlogDetailsFull from "./main-component/BlogDetailsFull/BlogDetailsFull.jsx";
import BlogDetailsLeftSiide from "./main-component/BlogDetailsLeftSiide/BlogDetailsLeftSiide.jsx";

// Contact Page
import ContactPage from "./main-component/ContactPage/ContactPage.jsx";

// Auth Pages
import LoginPage from "./main-component/LoginPage/index.jsx";
import ForgotPassword from "./main-component/ForgotPassword/index.jsx";
import Register from "./main-component/SignUpPage/index.jsx";

// Error Page
import ErrorPage from "./main-component/ErrorPage/ErrorPage.jsx";

// Mapping object để lookup components
export const chariusPages: Record<string, React.ComponentType> = {
  "HomePage/HomePage.jsx": HomePage,
  "HomePage2/HomePage2.jsx": HomePage2,
  "HomePage3/HomePage3.jsx": HomePage3,
  "HomePage4/HomePage4.jsx": HomePage4,
  "AboutPage/AboutPage.jsx": AboutPage,
  "GalleryPage/GalleryPage.jsx": GalleryPage,
  "TestimonialPage/TestimonialPage.jsx": TestimonialPage,
  "CausePageOn/CausePageOn.jsx": CausePageOn,
  "CausePagetwo/CausePagetwo.jsx": CausePagetwo,
  "CausePagethre/CausePagethre.jsx": CausePagethre,
  "CauseSinglePage/CauseSinglePage.jsx": CauseSinglePage,
  "TeamPage/TeamPage.jsx": Volunteer,
  "VolunteerSinglePage/VolunteerSinglePage.jsx": VolunteerSinglePage,
  "ServicePage/ServicePage.jsx": ServicePage,
  "ServiceSinglePage/ServiceSinglePage.jsx": ServiceSinglePage,
  "DonatePage/DonatePage.jsx": DonatePage,
  "EventPage/EventPage.jsx": EventPage,
  "EventSinglePage/EventSinglePage.jsx": EventSinglePage,
  "BlogPage/BlogPage.jsx": BlogPage,
  "BlogPageLeft/BlogPageLeft.jsx": BlogPageLeft,
  "BlogPageFullwidth/BlogPageFullwidth.jsx": BlogPageFullwidth,
  "BlogDetails/BlogDetails.jsx": BlogDetails,
  "BlogDetailsFull/BlogDetailsFull.jsx": BlogDetailsFull,
  "BlogDetailsLeftSiide/BlogDetailsLeftSiide.jsx": BlogDetailsLeftSiide,
  "ContactPage/ContactPage.jsx": ContactPage,
  "LoginPage/index.jsx": LoginPage,
  "ForgotPassword/index.jsx": ForgotPassword,
  "SignUpPage/index.jsx": Register,
  "ErrorPage/ErrorPage.jsx": ErrorPage,
};

