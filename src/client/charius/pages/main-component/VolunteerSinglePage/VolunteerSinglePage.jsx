
import React, { Fragment } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle'
import VolunteerSingelSection from '../../components/VolunteerSingelSection/VolunteerSingelSection';
import Scrollbar from '../../components/scrollbar/scrollbar'
import Footer from '../../components/footer/Footer';
import Logo from "../../images/logo.svg"

const CausePageOn = () => {
    return (
        <Fragment>
            <Navbar Logo={Logo} hclass={'wpo-site-header-s5'} />
            <PageTitle pageTitle={'Our Volunteer'} pagesub={'Volunteer'} />
            <VolunteerSingelSection />
            <Footer />
            <Scrollbar />
        </Fragment>
    )
};
export default CausePageOn;


