import React from "react";
import Team from '../../api/teams'
import TeamCard from "./TeamCard";
import { Link } from "react-router-dom";
import SectionTitle from "../SectionTitle/SectionTitle";


const ClickHandler = () => {
    window.scrollTo(10, 0);
}


const TeamSection = (props) => {
    return (
        <section className={props.hclass}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-12 col-12">
                        <SectionTitle subtitle="Our Expert Team" title="Meet Our Volunteer Behind
                                the Success Story" />
                    </div>
                </div>
                <div className="volunteer-wraper">
                    <div className="row">
                        {Team.slice(0, 4).map((teams, tky) => (
                            <div className="col-lg-3 col-md-6 col-sm-6 col-12" key={tky}>
                                <TeamCard Tsubtitle={teams.subtitle} Timg={teams.img} Ttitle={teams.title} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default TeamSection;



<section className="helpass-team-section section-padding">
    <div className="container">
        <div className="row">
            <div className="col-lg-4 col-12">
                <div className="wpo-section-title">
                    <span>- our volunteer -</span>
                    <h2>Meet the
                        expert team of volunteer.</h2>
                    <Link onClick={ClickHandler} to="#" className="theme-btn">Discover More</Link>
                </div>
            </div>
        </div>
        <div className="team-wrap">
            <div className="row">
                {Team.slice(0, 3).map((team, Titem) => (
                    <div className="col-lg-4 col-md-6 col-12" key={Titem}>
                        <TeamCard Ttitle={team.title} Timg={team.img} Tsubtitle={team.subtitle} />
                    </div>
                ))}

            </div>
        </div>
    </div>
</section>