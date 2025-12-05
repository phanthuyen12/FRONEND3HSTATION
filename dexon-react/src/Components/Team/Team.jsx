import { useEffect } from 'react';
import data from '../../Data/team1.json';
import loadBackgroudImages from '../Common/loadBackgroudImages';
import Slider from 'react-slick';
import brand from '../../Data/brand.json';

const Team = () => {

    useEffect(() => {
        loadBackgroudImages();
      }, []);

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


    return (

        <div className="team-section upper" data-background="/assets/images/resource/team-bg.jpg">
		<div className="container">
			<div className="row">
				<div className="col-lg-12">
					<div className="dexon-section-title text-center padding-lg">
						<h1> Meet the Dexon Trusted <br/> Team Member</h1>
					</div>
				</div>
			</div>
			<div className="row">
            {data.slice(0,3).map((item, i) => (
				<div key={i} className="col-lg-4 col-md-6">
					<div className="single-team-box">
						<div className="team-thumb">
							<img src={item.img} alt="" />
						</div>
						<div className="team-content">
							<h3 className="team-title"> {item.title} </h3>
							<p className="team-text"> {item.desc} </p>
						</div>
					</div>
				</div>
                ))}
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
	</div>
    );
};

export default Team;