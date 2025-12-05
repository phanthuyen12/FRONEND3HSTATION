import {
    createBrowserRouter,
  } from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../Pages/Home";
import Layout2 from "../Layout/Layout2";
import Home2 from "../Pages/Home2";
import AboutPage from "../Pages/AboutPage";
import ServicePage from "../Pages/ServicePage";
import ServiceDetailsPage from "../Pages/ServiceDetailsPage";
import TeamPage from "../Pages/TeamPage";
import PricingPage from "../Pages/PricingPage";
import FaqPage from "../Pages/FaqPage";
import ContactPage from "../Pages/ContactPage";
import BlogGridPage from "../Pages/BlogGridPage";
import BlogSidebarPage from "../Pages/BlogSidebarPage";
import BlogDeatilsPage from "../Pages/BlogDeatilsPage";

export const router = createBrowserRouter([
    {
      path: "/",
      element: <Main></Main>,
      children: [
        {
          path: "/",
          element: <Home></Home>,
        },
        {
            path: "/about",
            element:<AboutPage></AboutPage>,
        }, 
        {
          path: "/service",
          element:<ServicePage></ServicePage>,
        },
        {
          path: "/service/service-details",
          element:<ServiceDetailsPage></ServiceDetailsPage>,
        },
        {
          path: "/team",
          element:<TeamPage></TeamPage>,
        },
        {
          path: "/pricing",
          element:<PricingPage></PricingPage>,
        }, 
        {
          path: "/faq",
          element:<FaqPage></FaqPage>,
        },  
        {
          path: "/contact",
          element:<ContactPage></ContactPage>,
        }, 
        {
          path: "/blog",
          element:<BlogGridPage></BlogGridPage>,
        }, 
        {
          path: "/blog-sidebar",
          element:<BlogSidebarPage></BlogSidebarPage>,
        },    
        {
          path: "/blog/blog-details",
          element:<BlogDeatilsPage></BlogDeatilsPage>,
        },                                                                                                                                              
      ],
    }, 
    {
      path: 'home2',
      element: <Layout2></Layout2>,
      children: [
        {
          index: true,
          element: <Home2></Home2>,
        },                           
      ],
    },        
  ]);