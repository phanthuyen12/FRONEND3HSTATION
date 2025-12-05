import React from "react";
import Team from '../../api/teams'
import TeamCard from "../TeamSection/TeamCard";
import { Link } from "react-router-dom";


const ClickHandler = () => {
    window.scrollTo(10, 0);
}


const TeamSectionS2 = (props) => {
    return (
        <section className="helpass-team-section-s2 section-padding">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-12">
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
                        {Team.slice(0, 4).map((team, Titem) => (
                            <div className="col-lg-3 col-md-6 col-12" key={Titem}>
                                <TeamCard Ttitle={team.title} Timg={team.img} Tsubtitle={team.subtitle} />
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </section>

    );
}

export default TeamSectionS2;
