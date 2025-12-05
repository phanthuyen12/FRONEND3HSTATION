import { useEffect } from "react";
import SectionTitle from "../Common/SectionTitle";
import loadBackgroudImages from "../Common/loadBackgroudImages";
import Slider from "react-slick";
import data from '../../Data/testimonial1.json';
import CounterCard from "./CounterCard";
import { Link } from "react-router-dom";

const Testimonial1 = () => {

    useEffect(() => {
        loadBackgroudImages();
      }, []);

      const settings = {
        dots: false,
        infinite: true,
        speed: 600,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false,
        swipeToSlide: true,
        responsive: [
          {
            breakpoint: 1399,
            settings: {
              slidesToShow: 3,
            }
          },
          {
            breakpoint: 1199,
            settings: {
              slidesToShow: 2,
            }
          },{
            breakpoint: 575,
            settings: {
              slidesToShow: 1,
            }
          }
        ]
      };     

    return (
        <div className="testimoonial-section" data-background="/assets/images/resource/testi-bg.jpg">
		<div className="container">
			<div className="row dream-bg center">
				<div className="col-lg-12">
					<div className="dexon-section-title padding-lg text-center dreamit">
                        <SectionTitle
                            Title="What Say Our Customers <br> About Dexon"
                            Content="Distinctively supply exceptional services after uniquely integrate alternative markets rather emerging initiatives."
                        ></SectionTitle>
					</div>
				</div>
				<div className="dream-shape">
					<img src="/assets/images/resource/border2.png" alt="" />
				</div>
				<div className="testi-all-shape">
					<div className="testi-shape1">
						<img src="/assets/images/resource/sml-shape2.png" alt="" />
					</div>
					<div className="testi-shape">
						<img src="/assets/images/resource/shape4.png" alt="" />
					</div>
				</div>
			</div>
			<div className="row">
				<div className="testi-list owl-carousel cs_slider_gap_30">
                    <Slider {...settings}>
                    {data.map((item, index)=>(
					<div key={index} className="col-lg-12">
						<div className="testimonial-single-box">
							<div className="testi-people">
								<img src={item.image} alt="" />
							</div>
							<div className="people-name">
								<h2> {item.title} </h2>
								<span>{item.subTitle}</span>
							</div>
							<div className="testi-description">
								<p>“{item.desc}”</p>
							</div>
							<div className="company-logo">
								<a href="#"><img src={item.icon} alt="" /></a>
							</div>
							<div className="company-rating">
								<ul>
									<li><i className="bi bi-star-fill"></i></li>
									<li><i className="bi bi-star-fill"></i></li>
									<li><i className="bi bi-star-fill"></i></li>
									<li><i className="bi bi-star-fill"></i></li>
									<li><i className="bi bi-star-half"></i></li>
								</ul>
							</div>
						</div>
					</div>
                    ))}
                    </Slider>
				</div>
			</div>
			<div className="row align-items-center about-bg2">
				<div className="col-lg-6">
					<div className="dexon-section-title">
                    <SectionTitle
                            Title="We use various marketing <br> channels to reach Sales"
                            Content="Ullamcorper risus ultrices risus lorem. Mollis libero in pellentesque potenti. Vulputate ut aliquam, consectetur turpis odio."
                     ></SectionTitle>
					</div>
					<div className="about-counter-style">
						<div className="row">
                            <CounterCard
                                number="50"
                                content="Content Strategy"                           
                            ></CounterCard>
                            <CounterCard
                                number="70"
                                content="Audience Growup"                           
                            ></CounterCard>
						</div>
					</div>
					<div className="dexon-button">
						<Link className="dexon-button" to="/about">Learn More <i className="bi bi-arrow-right-short"></i></Link>
					</div>
				</div>
				<div className="col-lg-6">
					<div className="about-thumb2">
						<img src="/assets/images/resource/about2.png" alt="" />
						<div className="about-shape">
							<img src="/assets/images/resource/shape-2.png" alt="" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

    );
};

export default Testimonial1;