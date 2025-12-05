import React, { Fragment } from 'react';
import Navbar from '../../components/Navbar/Navbar'
import Hero4 from '../../components/Hero4/Hero4';
import ServiceSection from '../../components/ServiceSection/ServiceSection';
import AboutSection4 from '../../components/about4/about4';
import CtaSection3 from '../../components/CtaSection3/CtaSection3';
import CausesSectionS3 from '../../components/CausesSecionS2/CausesSecionS2';
import FunFact from '../../components/FunFact/FunFact';
import TestimonialSection from '../../components/TestimonialSection/TestimonialSection';
import InstagramSection from '../../components/InstagramSection/InstagramSection';
import EventSection from '../../components/EventSection/EventSection';
import BlogSection from '../../components/BlogSection/BlogSection';
import PartnersSection from '../../components/PartnersSection/PartnersSection';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Logo from '../../images/logo.svg'

const HomePage4 = () => {
    return (
        <Fragment>
            <Navbar hclass="wpo-site-header-s1 wpo-site-header-s4" Logo={Logo} />
            <Hero4 />
            <ServiceSection hclass={"wpo-service-section s2"} />
            <AboutSection4 />
            <CtaSection3 />
            <CausesSectionS3 />
            <FunFact hclass={"wpo-fun-fact-section-s4"} />
            <TestimonialSection hclass={"wpo-testimonial-section pt-0 pb-0"}/>
            <InstagramSection hclass={"wpo-instagram-section section-padding pb-0"}  />
            <EventSection />
            <BlogSection />
            <PartnersSection />
            <Footer />
            <Scrollbar />
        </Fragment>
    )
};
export default HomePage4;