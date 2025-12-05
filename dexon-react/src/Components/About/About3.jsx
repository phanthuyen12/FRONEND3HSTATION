import Slider from "react-slick";
import data from '../../Data/testimonial3.json';
import counter from '../../Data/counter.json';
import { useState } from "react";
import VideoModal from "../VideoModal/VideoModal";

const About3 = () => {

    const settings = {
        dots: false,
        infinite: true,
        speed: 600,
        slidesToShow: 1,
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

	  const [iframeSrc, setIframeSrc] = useState('about:blank');
	  const [toggle, setToggle] = useState(false);
	
	  const handelClick = () => {
		setIframeSrc("https://www.youtube.com/embed/rRid6GCJtgc");
		setToggle(!toggle);
	  };
	  const handelClose = () => {
		setIframeSrc('about:blank');
		setToggle(!toggle);
	  };


    return (
        <div className="about-section style-two">
		<div className="container">
			<div className="row about-bg3">
				<div className="col-lg-8">
					<div className="dexon-section-title">
						<h1> Growing your Revenue using </h1>
						<h1 className="sections">Dexon Services</h1>
					</div>
					<div className="rs-video">
						<div className="animate-border" onClick={handelClick}>
							<span className="video-vemo-icon venobox vbox-item" data-vbtype="youtube" data-autoplay="true">
							<i className="bi bi-play"></i></span>
							<span className="video-title">Watch Video</span>
						</div>
					</div>
				</div>
				<div className="col-lg-4">
					<div className="about-top-thumb">
						<img src="/assets/images/resource/abt-tp.jpg" alt="" />
					</div>
				</div>
			</div>
			<div className="row align-items-center">
				<div className="col-lg-6 col-md-12">
					<div className="about-left-thumb">
						<img src="/assets/images/resource/about4.png" alt="" />
					</div>
				</div>
				<div className="col-lg-6">
					<div className="row">
						<div className="about-testi-scroll">
							<div className="about-scroll1">
                            <Slider {...settings}>
                            {data.map((item, index)=>(
							<div key={index} className="col-lg-12">
								<div className="testimonial-single-box2">
									<div className="testi-people">
										<img src={item.image} alt="" />
									</div>
									<div className="people-name">
										<h2> {item.title} </h2>
										<span>{item.subTitle}</span>
									</div>
									<div className="testi-description">
										<div className="quote-icon">
											<i className="bi bi-quote"></i>
										</div>
										
										<p> {item.desc}</p>
									</div>
								</div>
							</div>
                            ))}
                            </Slider>
						</div>
						</div>
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
				<div className="abouts-shape">
					<div className="dream-shape5">
						<img src="/assets/images/resource/icon.png" alt="" />
					</div>
				</div>
			</div>
		</div>

        <VideoModal
          isTrue={toggle}
          iframeSrc={iframeSrc}
          handelClose={handelClose}        
        ></VideoModal>
	</div>
	
    );
};

export default About3;