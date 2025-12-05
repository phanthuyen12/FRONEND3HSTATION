import { useEffect } from 'react';
import data from '../../Data/feature3.json';
import SectionTitle from '../Common/SectionTitle';
import loadBackgroudImages from '../Common/loadBackgroudImages';

const Feature3 = () => {
    
    useEffect(() => {
        loadBackgroudImages();
      }, []);

    return (
        <div className="why-choose-us" data-background="/assets/images/resource/why-chs.jpg">
		<div className="container">
			<div className="row">
				<div className="col-lg-12">
					<div className="dexon-section-title text-center white padding-lg about-chosse-content">
                        <SectionTitle
                            Title="What the Benefits You will <br> Get From Dexon"
                            Content="Distinctively supply exceptional services after uniquely integrate alternative markets rather emerging initiatives."
                        ></SectionTitle>
					</div>
				</div>
			</div>
			<div className="row">
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

export default Feature3;