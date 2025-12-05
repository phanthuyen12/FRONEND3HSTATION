import React from 'react'
import CountUp from 'react-countup';

const FunFact = (props) => {
    return (
        <section className={" section-padding " + props.hclass}>
            <div className="container">
                <div className="fun-fact-wrap">
                    <div className="row">
                        <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                            <div className="info">
                                <h3><span><CountUp end={260} enableScrollSpy /></span></h3>
                                <p>Total
                                    Campaigns</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                            <div className="info">
                                <h3><span><CountUp end={26} enableScrollSpy />M</span></h3>
                                <p>Total
                                    Fund Raised</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                            <div className="info">
                                <h3><span><CountUp end={120} enableScrollSpy /></span></h3>
                                <p>Happy
                                    Volunteers</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                            <div className="info">
                                <h3><span><CountUp end={15} enableScrollSpy /></span></h3>
                                <p>Years of
                                    Fund Raising</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default FunFact;




