import React, { Fragment } from 'react';
import Topbar from '../../components/Topbar/Topbar';
import Navbar from '../../components/Navbar/Navbar'
import Hero3 from '../../components/hero3/hero3';
import AboutSection3 from '../../components/about3/about3';
import FunFact from '../../components/FunFact/FunFact';
import CausesSecionS3 from '../../components/CausesSecionS3/CausesSecionS3';
import InstagramSection from '../../components/InstagramSection/InstagramSection';
import TestimonialSection from '../../components/TestimonialSection/TestimonialSection';
import EventSection from '../../components/EventSection/EventSection';
import TeamSection from '../../components/TeamSection/TeamSection';
import CtaSection from '../../components/CtaSection/CtaSection';
import BlogSection from '../../components/BlogSection/BlogSection';
import PartnersSection from '../../components/PartnersSection/PartnersSection';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Logo from '../../images/logo.svg'
const HomePage3 = () => {
    return (
        <Fragment>
            <Topbar />
            <Navbar Logo={Logo} hclass="wpo-site-header-s3" />
            <Hero3 />
            <AboutSection3 />
            <FunFact hclass="wpo-fun-fact-section-s3" />
            <CausesSecionS3 hclass={"wpo-causes-section-s3"} />
            <InstagramSection hclass="wpo-instagram-section-s2" />
            <TestimonialSection hclass="wpo-testimonial-section-s2" />
            <EventSection />
            <TeamSection hclass="wpo-volunteer-section" />
            <CtaSection />
            <BlogSection hclass="wpo-blog-section-s2 section-padding" />
            <PartnersSection />
            <Footer />
            <Scrollbar />
        </Fragment>
    )
};
export default HomePage3;