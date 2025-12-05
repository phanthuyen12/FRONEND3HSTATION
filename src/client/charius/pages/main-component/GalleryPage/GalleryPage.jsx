import React, { Fragment } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle'
import GallerySection from '../../components/GallerySection/Gallerysection';

import Scrollbar from '../../components/scrollbar/scrollbar'
import Footer from '../../components/footer/Footer';
import Logo from '../../images/logo.svg'
import BlogSection from '../../components/BlogSection/BlogSection';
import PartnersSection from '../../components/PartnersSection/PartnersSection';
const GalleryPage = () => {
    return (
        <Fragment>
            <Navbar Logo={Logo} hclass={'wpo-site-header-s5'} />
            <PageTitle pageTitle={'Gallery'} pagesub={'Gallery'} />
            <GallerySection />
            <BlogSection />
            <PartnersSection />
            <Footer />
            <Scrollbar />
        </Fragment>
    )
}

export default GalleryPage;


