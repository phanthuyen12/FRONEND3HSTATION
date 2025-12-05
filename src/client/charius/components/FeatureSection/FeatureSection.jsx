import React from 'react';


const featuresData = [
    {
        iconClass: 'flaticon-volunteer',
        title: 'Become a volunteer',
        description: 'Alone, I can do little. Together, we can do anything.'
    },
    {
        iconClass: 'flaticon-solidarity',
        title: 'Quick fundraising',
        description: 'Alone, I can do little. Together, we can do anything.'
    },
    {
        iconClass: 'flaticon-charity',
        title: 'Start donating',
        description: 'Alone, I can do little. Together, we can do anything.'
    }
];


const FeatureSection = () => {
    return (
        <section className="wpo-features-area">
            <div className="container">
                <div className="features-wrap">
                    <div className="row">
                        {featuresData.map((feature, index) => (
                            <div className="col col-lg-4 col-md-6 col-12" key={index}>
                                <div className="feature-item-wrap">
                                    <div className="feature-item">
                                        <div className="feature-icon">
                                            <div className="icon">
                                                <i className={`fi ${feature.iconClass}`}></i>
                                            </div>
                                        </div>
                                        <div className="feature-text">
                                            <h2>{feature.title}</h2>
                                            <p>{feature.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )

}

export default FeatureSection;