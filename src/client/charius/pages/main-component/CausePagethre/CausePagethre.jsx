import React, { Fragment } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle'
import CausesSecionS3 from '../../components/CausesSecionS3/CausesSecionS3';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar'
import Logo from "../../images/logo.svg"

const CausePageOn = () => {
    return (
        <Fragment>
            <Navbar Logo={Logo} hclass={'wpo-site-header-s5'} />
            <PageTitle pageTitle={'Causes'} pagesub={'Causes'} />
            <CausesSecionS3 hclass={"wpo-causes-section-s3 s2 section-padding"} />
            <Footer />
            <Scrollbar />
        </Fragment>
    )
};
export default CausePageOn;

