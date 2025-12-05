import React from "react";
import { Route, Routes } from "react-router-dom";
import ChariusPageWrapper from "./pages/ChariusPageWrapper";

// Wrapper để handle loading state
const ChariusRouteWrapper: React.FC<{ 
  componentPath: string; 
  componentName: string;
}> = ({ componentPath, componentName }) => {
  return (
    <ChariusPageWrapper 
      componentPath={componentPath} 
      componentName={componentName} 
    />
  );
};

const ChariusRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Home Pages */}
      <Route
        path="/charius"
        element={
          <ChariusRouteWrapper 
            componentPath="HomePage/HomePage.jsx" 
            componentName="HomePage" 
          />
        }
      />
      <Route
        path="/charius/home"
        element={
          <ChariusRouteWrapper 
            componentPath="HomePage/HomePage.jsx" 
            componentName="HomePage" 
          />
        }
      />
      <Route
        path="/charius/home-2"
        element={
          <ChariusRouteWrapper 
            componentPath="HomePage2/HomePage2.jsx" 
            componentName="HomePage2" 
          />
        }
      />
      <Route
        path="/charius/home-3"
        element={
          <ChariusRouteWrapper 
            componentPath="HomePage3/HomePage3.jsx" 
            componentName="HomePage3" 
          />
        }
      />
      <Route
        path="/charius/home-4"
        element={
          <ChariusRouteWrapper 
            componentPath="HomePage4/HomePage4.jsx" 
            componentName="HomePage4" 
          />
        }
      />

      {/* About Page */}
      <Route
        path="/charius/about"
        element={
          <ChariusRouteWrapper 
            componentPath="AboutPage/AboutPage.jsx" 
            componentName="AboutPage" 
          />
        }
      />

      {/* Gallery Page */}
      <Route
        path="/charius/gallery"
        element={
          <ChariusRouteWrapper 
            componentPath="GalleryPage/GalleryPage.jsx" 
            componentName="GalleryPage" 
          />
        }
      />

      {/* Testimonial Page */}
      <Route
        path="/charius/testimonial"
        element={
          <ChariusRouteWrapper 
            componentPath="TestimonialPage/TestimonialPage.jsx" 
            componentName="TestimonialPage" 
          />
        }
      />

      {/* Causes Pages */}
      <Route
        path="/charius/causes"
        element={
          <ChariusRouteWrapper 
            componentPath="CausePageOn/CausePageOn.jsx" 
            componentName="CausePageOn" 
          />
        }
      />
      <Route
        path="/charius/causes-s2"
        element={
          <ChariusRouteWrapper 
            componentPath="CausePagetwo/CausePagetwo.jsx" 
            componentName="CausePagetwo" 
          />
        }
      />
      <Route
        path="/charius/causes-s3"
        element={
          <ChariusRouteWrapper 
            componentPath="CausePagethre/CausePagethre.jsx" 
            componentName="CausePagethre" 
          />
        }
      />
      <Route
        path="/charius/causes-single/:slug"
        element={
          <ChariusRouteWrapper 
            componentPath="CauseSinglePage/CauseSinglePage.jsx" 
            componentName="CauseSinglePage" 
          />
        }
      />

      {/* Volunteer Pages */}
      <Route
        path="/charius/volunteer"
        element={
          <ChariusRouteWrapper 
            componentPath="TeamPage/TeamPage.jsx" 
            componentName="Volunteer" 
          />
        }
      />
      <Route
        path="/charius/volunteer-single"
        element={
          <ChariusRouteWrapper 
            componentPath="VolunteerSinglePage/VolunteerSinglePage.jsx" 
            componentName="VolunteerSinglePage" 
          />
        }
      />

      {/* Service Pages */}
      <Route
        path="/charius/service"
        element={
          <ChariusRouteWrapper 
            componentPath="ServicePage/ServicePage.jsx" 
            componentName="ServicePage" 
          />
        }
      />
      <Route
        path="/charius/service-single/:slug"
        element={
          <ChariusRouteWrapper 
            componentPath="ServiceSinglePage/ServiceSinglePage.jsx" 
            componentName="ServiceSinglePage" 
          />
        }
      />

      {/* Donate Page */}
      <Route
        path="/charius/donate"
        element={
          <ChariusRouteWrapper 
            componentPath="DonatePage/DonatePage.jsx" 
            componentName="DonatePage" 
          />
        }
      />

      {/* Event Pages */}
      <Route
        path="/charius/event"
        element={
          <ChariusRouteWrapper 
            componentPath="EventPage/EventPage.jsx" 
            componentName="EventPage" 
          />
        }
      />
      <Route
        path="/charius/event-single/:slug"
        element={
          <ChariusRouteWrapper 
            componentPath="EventSinglePage/EventSinglePage.jsx" 
            componentName="EventSinglePage" 
          />
        }
      />

      {/* Blog Pages */}
      <Route
        path="/charius/blog"
        element={
          <ChariusRouteWrapper 
            componentPath="BlogPage/BlogPage.jsx" 
            componentName="BlogPage" 
          />
        }
      />
      <Route
        path="/charius/blog-left-sidebar"
        element={
          <ChariusRouteWrapper 
            componentPath="BlogPageLeft/BlogPageLeft.jsx" 
            componentName="BlogPageLeft" 
          />
        }
      />
      <Route
        path="/charius/blog-fullwidth"
        element={
          <ChariusRouteWrapper 
            componentPath="BlogPageFullwidth/BlogPageFullwidth.jsx" 
            componentName="BlogPageFullwidth" 
          />
        }
      />
      <Route
        path="/charius/blog-single/:slug"
        element={
          <ChariusRouteWrapper 
            componentPath="BlogDetails/BlogDetails.jsx" 
            componentName="BlogDetails" 
          />
        }
      />
      <Route
        path="/charius/blog-single-fullwidth/:slug"
        element={
          <ChariusRouteWrapper 
            componentPath="BlogDetailsFull/BlogDetailsFull.jsx" 
            componentName="BlogDetailsFull" 
          />
        }
      />
      <Route
        path="/charius/blog-single-left-sidebar/:slug"
        element={
          <ChariusRouteWrapper 
            componentPath="BlogDetailsLeftSiide/BlogDetailsLeftSiide.jsx" 
            componentName="BlogDetailsLeftSiide" 
          />
        }
      />

      {/* Contact Page */}
      <Route
        path="/charius/contact"
        element={
          <ChariusRouteWrapper 
            componentPath="ContactPage/ContactPage.jsx" 
            componentName="ContactPage" 
          />
        }
      />

      {/* Auth Pages */}
      <Route
        path="/charius/login"
        element={
          <ChariusRouteWrapper 
            componentPath="LoginPage/index.jsx" 
            componentName="LoginPage" 
          />
        }
      />
      <Route
        path="/charius/forgot"
        element={
          <ChariusRouteWrapper 
            componentPath="ForgotPassword/index.jsx" 
            componentName="ForgotPassword" 
          />
        }
      />
      <Route
        path="/charius/register"
        element={
          <ChariusRouteWrapper 
            componentPath="SignUpPage/index.jsx" 
            componentName="Register" 
          />
        }
      />

      {/* Error Page */}
      <Route
        path="/charius/404"
        element={
          <ChariusRouteWrapper 
            componentPath="ErrorPage/ErrorPage.jsx" 
            componentName="ErrorPage" 
          />
        }
      />
    </Routes>
  );
};

export default ChariusRoutes;
