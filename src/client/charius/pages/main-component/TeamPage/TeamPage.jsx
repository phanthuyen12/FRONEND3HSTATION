import React, { Fragment } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle'
import TeamSectionS2 from '../../components/TeamSectionS2/TeamSectionS2';
import Scrollbar from '../../components/scrollbar/scrollbar'
import Footer from '../../components/footer/Footer';
import Logo from '../../images/logo.svg'
const TeamPage = () => {
    return (
        <Fragment>
            <Navbar Logo={Logo} hclass={'wpo-site-header-s5'} />
            <PageTitle pageTitle={'Volunteer'} pagesub={'Volunteer'} />
            <TeamSectionS2/>
            <Footer />
            <Scrollbar />
        </Fragment>
    )
};
export default TeamPage;
