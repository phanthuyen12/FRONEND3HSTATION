import React, { Fragment } from 'react';
import Navbar from '../../components/Navbar/Navbar'
import Hero from '../../components/hero/hero';
import FeatureSection from '../../components/FeatureSection/FeatureSection';
import About from '../../components/about/about';
import CausesSecion from '../../components/CausesSecion/CausesSecion';
import ServiceSection from '../../components/ServiceSection/ServiceSection';
import CtaSection from '../../components/CtaSection/CtaSection';
import FunFact from '../../components/FunFact/FunFact';
import EventSection from '../../components/EventSection/EventSection';
import TestimonialSection from '../../components/TestimonialSection/TestimonialSection';
import InstagramSection from '../../components/InstagramSection/InstagramSection';
import BlogSection from '../../components/BlogSection/BlogSection';
import PartnersSection from '../../components/PartnersSection/PartnersSection';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Logo from '../../images/logo.svg'
const HomePage = () => {
    return (
        <Fragment>
            <Navbar Logo={Logo} hclass={'wpo-site-header-s1'} />
            <Hero />
            <FeatureSection />
            <About />
            <CausesSecion hclass={"wpo-causes-section"} />
            <ServiceSection hclass={'wpo-service-section'} />
            <CtaSection/>
            <EventSection />
            <FunFact hclass={'wpo-fun-fact-section'} />
            <TestimonialSection hclass={"wpo-testimonial-section"} />
            <InstagramSection hclass={"wpo-instagram-section"} />
            <BlogSection hclass={"wpo-blog-section-s2 section-padding"} />
            <PartnersSection />
            <Footer />
            <Scrollbar />
        </Fragment>
    )
};
export default HomePage;