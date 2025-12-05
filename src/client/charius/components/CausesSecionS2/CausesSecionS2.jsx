import React from "react";
import SectionTitle from "../SectionTitle/SectionTitle";
import { Link } from "react-router-dom";
import causesData from "../../api/causes";

const ClickHandler = () => {
    window.scrollTo(10, 0);
};

const CausesSectionS3 = () => {
    return (
        <section className="wpo-causes-section-s2 section-padding">
            <div className="causes-wrap">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-6 col-md-12 col-12">
                            <SectionTitle subtitle="Featured Cause" title="Find the popular cause" />
                        </div>
                    </div>
                    <div className="row g-0 align-items-center">
                        <div className="col col-lg-6 col-md-12 col-12">
                            {causesData.slice(0, 1).map((cause, index) => (
                                <div key={index} className="causes-item">
                                    <div className="image">
                                        <img src={cause.image} alt={cause.title} />
                                    </div>
                                    <div className="content">
                                        <h2><Link onClick={ClickHandler} to={`/causes-single/${cause.slug}`}>{cause.title}</Link></h2>
                                        <p>{cause.description}</p>
                                        <div className="progress-item">
                                            <div className="progress">
                                                <div className="bar" style={{ width: `${(cause.raisedAmount / cause.goalAmount) * 100}%` }}></div>
                                            </div>
                                            <span className="cssProgress-label">{((cause.raisedAmount / cause.goalAmount) * 100).toFixed(2)}%</span>
                                            <div className="progres-label">
                                                <div className="label-on">
                                                    <p>Raised:<span>${cause.raisedAmount}</span></p>
                                                </div>
                                                <div className="label-two">
                                                    <p>Goal:<span>${cause.goalAmount}</span></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="col col-lg-6 col-md-12 col-12">
                            {causesData.slice(1, 3).map((cause, index) => (
                                <div key={index} className="causes-item">
                                    <div className="image">
                                        <img src={cause.image} alt={cause.title} />
                                    </div>
                                    <div className="content">
                                        <h2><Link to={`/causes-single/${cause.slug}`}>{cause.title}</Link></h2>
                                        <p>{cause.description}</p>
                                        <div className="progress-item">
                                            <div className="progress">
                                                <div className="bar" style={{ width: `${(cause.raisedAmount / cause.goalAmount) * 100}%` }}></div>
                                            </div>
                                            <span className="cssProgress-label">{((cause.raisedAmount / cause.goalAmount) * 100).toFixed(2)}%</span>
                                            <div className="progres-label">
                                                <div className="label-on">
                                                    <p>Raised:<span>${cause.raisedAmount}</span></p>
                                                </div>
                                                <div className="label-two">
                                                    <p>Goal:<span>${cause.goalAmount}</span></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="causes-item-btn">
                                <Link to="/causes-single" className="causes-btn" onClick={ClickHandler} >See All Causes <i className="flaticon-right-arrow-2"></i></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CausesSectionS3;
