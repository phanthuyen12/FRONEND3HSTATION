import Slider from 'react-slick';
import brand from '../../Data/brand.json';
import { Link } from 'react-router-dom';
import VideoModal from '../VideoModal/VideoModal';
import { useState } from 'react';

const Choose = () => {

    const settings = {
        dots: false,
        infinite: true,
        speed: 600,
        slidesToShow: 5,
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
        <div className="why-choose-us style-two">
		<div className="container">
			<div className="row">
				<div className="col-lg-8">
					<div className="dexon-section-title padding-lg">
						<h1> Some Reason for Choose </h1>
						<h1 className="sections">Dexon Services</h1>
					</div>	
				</div>
				<div className="col-lg-4">
					<div className="rs-video text-right">
						<div className="animate-border" onClick={handelClick}>
							<span className="video-vemo-icon venobox vbox-item" data-vbtype="youtube" data-autoplay="true" >
							<i className="bi bi-play"></i></span>
							<span className="video-title">Watch Video</span>
						</div>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col-lg-6 col-md-6">
					<div className="single-choose-us-box2">
						<div className="choose-thumb">
							<img src="/assets/images/resource/choose1.jpg" alt="" />
							<div className="choose-button">
								<Link to="/service/service-details">Colaborating Group Work</Link>
							</div>
						</div>
					</div>
				</div>
				<div className="col-lg-6 col-md-6">
					<div className="single-choose-us-box2">
						<div className="choose-thumb">
							<img src="/assets/images/resource/choose2.jpg" alt="" />
							<div className="choose-button">
                            <Link to="/service/service-details">Market Analysis Properly</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="row brand-bg">
				<div className="brand-list owl-carousel">
                <Slider {...settings}>
                    {brand.map((item, index)=>(
					<div key={index} className="col-lg-12">
						<div className="brand-thumb">
							<img src={item.img} alt="" />
						</div>
					</div>
                    ))}
                    </Slider>                                                                                             
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

export default Choose;