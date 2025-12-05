import { useEffect } from 'react';
import data from '../../Data/feature2.json';
import SectionTitle from '../Common/SectionTitle';
import loadBackgroudImages from '../Common/loadBackgroudImages';

const Feature2 = () => {

    useEffect(() => {
        loadBackgroudImages();
      }, []);

    return (
        <div className="feature-section style-two" data-background="/assets/images/resource/feature-bg2.jpg">
		<div className="container">
			<div className="row dream-bg">
				<div className="col-lg-12">
					<div className="dexon-section-title white padding-lg text-center">
                        <SectionTitle
                            Title="What are the Gains you Receive <br> Every SEO Campaign?"
                            Content="Distinctively supply exceptional services after uniquely integrate alternative markets rather emerging initiatives."
                        ></SectionTitle>
					</div>
				</div>
				<div className="dream-shape2">
					<img src="/assets/images/resource/shape2.png" alt="" />
				</div>
			</div>
			<div className="row">
            {data.map((item, i) => (
				<div key={i} className="col-lg-4 col-md-6">
					<div className="feature-single-box">
						<div className="feature-icon">
							<img src={item.icon} alt="" />
						</div>
						<div className="feature-content">
							<h2>{item.title}</h2>
							<p>{item.desc} </p>
						</div>
					</div>
				</div>
                ))}
			</div>
		</div>
	</div>
    );
};

export default Feature2;