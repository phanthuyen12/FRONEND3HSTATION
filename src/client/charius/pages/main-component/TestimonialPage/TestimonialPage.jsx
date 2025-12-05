import React, { Fragment } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle'
import TestimonialSection from '../../components/TestimonialSection/TestimonialSection';
import BlogSection from '../../components/BlogSection/BlogSection';
import PartnersSection from '../../components/PartnersSection/PartnersSection';
import Scrollbar from '../../components/scrollbar/scrollbar'
import Footer from '../../components/footer/Footer';
import Logo from '../../images/logo.svg'
const ServicePage = () => {
    return (
        <Fragment>
            <Navbar Logo={Logo} hclass={'wpo-site-header-s5'} />
            <PageTitle pageTitle={'Testimonial'} pagesub={'Testimonial'} />
            <TestimonialSection />
            <BlogSection />
            <PartnersSection />
            <Footer />
            <Scrollbar />
        </Fragment>
    )
};
export default ServicePage;
