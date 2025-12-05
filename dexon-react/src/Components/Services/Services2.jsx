import { Link } from "react-router-dom";
import data from '../../Data/services1.json';
import parse from 'html-react-parser';

const Services2 = () => {

    const HeadingContent = {
        subtitle:'Improve your Business',
        title:'SEO Solutions What <br> We Provide',
        Content:'Ullamcorper risus ultrices risus lorem. Mollis libero in pellentesque Vulputate ut aliquam, consectetur turpis',
        btnurl:'/service',
        mainImg:'/assets/images/resource/servc-thumb.png'
      }   

    return (
        <div className="service-section style-two">
		<div className="container">
			<div className="row">
				<div className="col-lg-5">
					<div className="dexon-section-title white padding-lg">
						<h4>{HeadingContent.subtitle}</h4>
						<h1>{parse(HeadingContent.title)}</h1>
					</div>
				</div>
				<div className="col-lg-7">
					<div className="dexon-desc">
						<p>{HeadingContent.Content}</p>
					</div>
					<div className="services-icon">
						<a href={HeadingContent.btnurl}><i className="bi bi-arrow-right-short"></i></a>
					</div>
				</div>
			</div>
			<div className="row service-bg">
				<div className="col-lg-5">
					<div className="serivce-thumb">
						<img src={HeadingContent.mainImg} alt="" />
					</div>
				</div>
				<div className="col-lg-7">
					<div className="row">
                    {data.map((item, i) => (
						<div key={i} className="col-lg-12">
							<div className="single-service-box2">
								<div className="service-icon">
									<img src={item.icon} alt="" />
								</div>
								<div className="service-content">
									<h2 className="service-title">{item.title}</h2>
									<p className="service-desc">{item.desc}</p>
									<div className="right-arrow">
										<Link to="/service"><i className="bi bi-arrow-right-short"></i></Link>
									</div>
								</div>
							</div>
						</div>
                        ))}
					</div>
				</div>
			</div>
		</div>
	</div>
    );
};

export default Services2;