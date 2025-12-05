import React from 'react';
import { BrowserRouter, Routes, Route, } from "react-router-dom";
import Homepage from '../HomePage/HomePage'
import HomePage2 from '../HomePage2/HomePage2';
import HomePage3 from '../HomePage3/HomePage3';
import HomePage4 from '../HomePage4/HomePage4';
import AboutPage from '../AboutPage/AboutPage';
import GalleryPage from '../GalleryPage/GalleryPage';
import TestimonialPage from '../TestimonialPage/TestimonialPage';
import CausePageOn from '../CausePageOn/CausePageOn';
import CausePagetwo from '../CausePagetwo/CausePagetwo';
import CausePagethre from '../CausePagethre/CausePagethre';
import CauseSinglePage from '../CauseSinglePage/CauseSinglePage';
import Volunteer from '../TeamPage/TeamPage';
import VolunteerSinglePage from '../VolunteerSinglePage/VolunteerSinglePage';
import ServicePage from '../ServicePage/ServicePage';
import ServiceSinglePage from '../ServiceSinglePage/ServiceSinglePage';
import DonatePage from '../DonatePage/DonatePage';
import EventPage from '../EventPage/EventPage';
import EventSinglePage from '../EventSinglePage/EventSinglePage';
import BlogPage from '../BlogPage/BlogPage'
import BlogPageLeft from '../BlogPageLeft/BlogPageLeft'
import BlogPageFullwidth from '../BlogPageFullwidth/BlogPageFullwidth'
import BlogDetails from '../BlogDetails/BlogDetails'
import BlogDetailsFull from '../BlogDetailsFull/BlogDetailsFull'
import BlogDetailsLeftSiide from '../BlogDetailsLeftSiide/BlogDetailsLeftSiide'
import ContactPage from '../ContactPage/ContactPage';
import LoginPage from '../LoginPage/index';
import ForgotPassword from '../ForgotPassword/index';
import Register from '../SignUpPage/index';
import ErrorPage from '../ErrorPage/ErrorPage';

const AllRoute = () => {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="home" element={<Homepage />} />
          <Route path="home-2" element={<HomePage2 />} />
          <Route path="home-3" element={<HomePage3 />} />
          <Route path="home-4" element={<HomePage4 />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="testimonial" element={<TestimonialPage />} />
          <Route path="causes" element={<CausePageOn />} />
          <Route path="causes-s2" element={<CausePagetwo />} />
          <Route path="causes-s3" element={<CausePagethre />} />
          <Route path="causes-single/:slug" element={<CauseSinglePage />} />
          <Route path="volunteer" element={<Volunteer />} />
          <Route path="volunteer-single" element={<VolunteerSinglePage />} />
          <Route path="service" element={<ServicePage />} />
          <Route path="service-single/:slug" element={<ServiceSinglePage />} />
          <Route path="donate" element={<DonatePage />} />
          <Route path="event" element={<EventPage />} />
          <Route path="event-single/:slug" element={<EventSinglePage />} />
          <Route path='blog' element={<BlogPage />} />
          <Route path='blog-left-sidebar' element={<BlogPageLeft />} />
          <Route path='blog-fullwidth' element={<BlogPageFullwidth />} />
          <Route path='blog-single/:slug' element={<BlogDetails />} />
          <Route path='blog-single-fullwidth/:slug' element={<BlogDetailsFull />} />
          <Route path='blog-single-left-sidebar/:slug' element={<BlogDetailsLeftSiide />} />
          <Route path='contact' element={<ContactPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="forgot" element={<ForgotPassword />} />
          <Route path="register" element={<Register />} />
          <Route path='404' element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default AllRoute;
