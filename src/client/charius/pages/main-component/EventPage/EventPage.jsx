import React, { Fragment } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle'
import EventSection from '../../components/EventSection/EventSection';
import Scrollbar from '../../components/scrollbar/scrollbar'
import Footer from '../../components/footer/Footer';
import Logo from '../../images/logo.svg'



const EventPageTwo = () => {



    return (
        <Fragment>
            <Navbar Logo={Logo} hclass={'wpo-site-header-s5'} />
            <PageTitle pageTitle={'Event'} pagesub={'Event'} />
            <EventSection />
            <Footer />
            <Scrollbar />
        </Fragment>
    )
}

export default EventPageTwo;