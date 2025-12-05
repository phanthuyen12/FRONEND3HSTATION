import React, { Fragment } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle'
import Scrollbar from '../../components/scrollbar/scrollbar'
import Footer from '../../components/footer/Footer';
import Logo from '../../images/logo.svg'
import DonateSection from '../../components/DonateSection/DonateSection';



const EventPagetwo = () => {



    return (
        <Fragment>
            <Navbar Logo={Logo} hclass={'wpo-site-header-s5'} />
            <PageTitle pageTitle={'Donate'} pagesub={'Donate'} />
            <DonateSection/>
            <Footer />
            <Scrollbar />
        </Fragment>
    )
}

export default EventPagetwo;