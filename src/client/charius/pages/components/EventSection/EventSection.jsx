import Slider from 'react-slick';
import { Link } from "react-router-dom";
import SectionTitle from "../SectionTitle/SectionTitle";
import Events from "../../api/events";


const EventSection = (props) => {

    const ClickHandlar = () => {
        window.scrollTo(10, 0);
    }


    return (
        <section className="wpo-event-section section-padding">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-12 col-12">
                        <SectionTitle subtitle="Let’s Help Them together!" title="Join Our Upcoming
                                Events"/>
                    </div>
                </div>
                <div className="event-wrap">
                    <div className="row">
                        {
                            Events.slice(0, 3).map((event, ei) => (
                                <div className="col col-lg-4 col-md-6 col-12" key={ei}>
                                    <div className="event-card">
                                        <div className="top-date">
                                            <span>{event.day}</span> {event.manth}
                                            <div className="shape">
                                                <svg width="19" height="14" viewBox="0 0 19 14" fill="none">
                                                    <path d="M18.9999 14L0.5 14L18.9999 -3.6902e-05L18.9999 14Z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="image">
                                            <img src={event.pimg} alt="" />
                                        </div>
                                        <div className="text">
                                            <h3>
                                                <Link onClick={ClickHandlar} to={`/event-single/${event.slug}`}>{event.title}</Link>
                                            </h3>
                                            <div className="event-info">
                                                <span><i className="ti-time"></i>{event.time}</span>
                                                <span><i className="ti-location-pin"></i>{event.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </section>
    )
}

export default EventSection;









