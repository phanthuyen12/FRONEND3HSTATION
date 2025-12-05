import { useEffect } from 'react';
import counter from '../../Data/counter.json';
import data from '../../Data/services2.json';
import SectionTitle from '../Common/SectionTitle';
import loadBackgroudImages from '../Common/loadBackgroudImages';
import { Link } from 'react-router-dom';

const About4 = () => {

    useEffect(() => {
        loadBackgroudImages();
      }, []);

    return (
        <div className="about-section style-three" data-background="/assets/images/resource/about-bg3.jpg">
		<div className="container">
			<div className="row align-items-center">
				<div className="col-lg-6 col-md-12">
					<div className="about-left-thumb">
						<img src="/assets/images/resource/about7.png" alt="" />
					</div>
				</div>
				<div className="col-lg-6">
					<div className="dexon-section-title">
						<h1>Specialize in Companies </h1>
						<h1>Promote your Business</h1>
						<h1>to Next Levels</h1>
						<p>Ullamcorper risus ultrices risus lorem. Mollis libero in pellentesque potenti. Vulputate ut aliquam, consectetur turpis odio  prospective value for proact paradigms. Assertively target real-time <br/> <span>
						Enthusiastically negotiate highly efficient manufactured products whereas distributed services. Conveniently impact e-business
						</span></p>
					</div>
					<div className="about-button">
						<Link className="dexon-button" to="/service/service-details">Learn More <i className="bi bi-arrow-right-short"></i> </Link>
					</div>
				</div>
			</div>
			<div className="row counter-bg">
            {counter.map((item, i) => (
				<div key={i} className="col-lg-3">
					<div className="single-counter-box">
						<div className="counter-title">
							<h1 className="counter">{item.number}</h1>
							<h1>{item.symbol}</h1>
						</div>
						<div className="counter-text">
							<p>{item.desc}</p>
						</div>
					</div>
				</div>
                ))}

			</div>
			<div className="row">
				<div className="col-lg-12">
					<div className="dexon-section-title text-center padding-lg">
                        <SectionTitle
                            Title="What We Do For SEO Services"
                            Content="Distinctively supply exceptional services after uniquely integrate alternative markets rather emerging initiatives."
                        ></SectionTitle>
					</div>
				</div>
                {data.map((item, i) => (
				<div key={i} className="col-lg-4 col-md-6">
					<div className="single-choose-us-box">
						<div className="choose-icon">
							<img src={item.icon} alt="" />
						</div>
						<div className="choose-content">
							<h3> {item.title} </h3>
							<p> {item.desc} </p>
						</div>
					</div>
				</div>
                ))}
				
			</div>
		</div>
	</div>
    );
};

export default About4;