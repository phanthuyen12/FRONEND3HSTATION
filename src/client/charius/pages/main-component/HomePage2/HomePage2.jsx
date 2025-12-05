import React, { Fragment } from 'react';
import Navbar from '../../components/Navbar/Navbar'
import Hero2 from '../../components/hero2/Hero2';
import FeatureSection from '../../components/FeatureSection/FeatureSection';
import About2 from '../../components/about2/about2';
import ServiceSection from '../../components/ServiceSection/ServiceSection';
import CtaSection2 from '../../components/CtaSection2/CtaSection2';
import CausesSectionS2 from '../../components/CausesSecionS2/CausesSecionS2';
import FunFact from '../../components/FunFact/FunFact';
import EventSection from '../../components/EventSection/EventSection';
import InstagramSection from '../../components/InstagramSection/InstagramSection';
import BlogSection from '../../components/BlogSection/BlogSection';
import PartnersSection from '../../components/PartnersSection/PartnersSection';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Logo from '../../images/logo.svg'
const HomePage2 = () => {
    return (
        <Fragment>
            <Navbar hclass={'wpo-site-header-s1 wpo-site-header-s2'} Logo={Logo} />
            <Hero2 />
            <FeatureSection />
            <About2 />
            <ServiceSection hclass={' wpo-service-section-s2'} />
            <CtaSection2 />
            <CausesSectionS2 />
            <FunFact hclass={'wpo-fun-fact-section-s2'} />
            <EventSection />
            <InstagramSection hclass={"wpo-instagram-section"} />
            <BlogSection hclass={"wpo-blog-section-s2 section-padding"} />
            <PartnersSection />
            <Footer />
            <Scrollbar />
        </Fragment>
    )
};
export default HomePage2;