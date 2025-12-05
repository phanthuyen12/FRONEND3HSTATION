import React, { Fragment } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle'
import CausesSecion from '../../components/CausesSecion/CausesSecion';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar'
import Logo from '../../images/logo.svg'

const CausePageOn = () => {
    return (
        <Fragment>
            <Navbar Logo={Logo} hclass={'wpo-site-header-s5'} />
            <PageTitle pageTitle={'Causes'} pagesub={'Causes'} />
            <CausesSecion hclass={"wpo-causes-section s2 section-padding"} />
            <Footer />
            <Scrollbar />
        </Fragment>
    )
};
export default CausePageOn;

