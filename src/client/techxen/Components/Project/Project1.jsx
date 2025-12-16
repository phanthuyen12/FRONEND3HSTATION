import { Link } from "react-router-dom";
import Slider from "react-slick";
import data from "../../Data/Home1/project1.json";
import SectionTitle from "../Common/SectionTitle";

const Project1 = ({ courses = [], loading = false }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 2000,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    swipeToSlide: true,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1399,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const hasCourses = Array.isArray(courses) && courses.length > 0;

  return (
    <div className="project sp">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 m-auto text-center">
            <div className="heading1">
              <SectionTitle
                SubTitle="Khoá học H3Station"
                Title={"Nâng cao kỹ năng<br/>với nội dung học tập thực chiến"}
              ></SectionTitle>
            </div>
          </div>
        </div>

        <div className="space30"></div>
        <div className="row">
          <div className="project-slider cs_slider_gap_30">
            {loading && !hasCourses && (
              <div className="col-12 text-center text-muted">Đang tải khoá học...</div>
            )}

            {!loading && hasCourses && (
              <Slider {...settings}>
                {courses.slice(0, 6).map((course, i) => (
                  <div key={course.id || course.title || i} className="single-slider">
                    <div className="slider-img">
                      <img
                        src={course.thumbnail_url || course.thumbnail || "/assets/img/project/project1.png"}
                        alt={course.title}
                      />
                    </div>
                    <div className="heading">
                      <h3>
                        <Link to="/project/project-details">{course.title}</Link>
                      </h3>
                      <Link to="/project/project-details" className="learn">
                        View Course{" "}
                        <span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="30"
                            fill="currentColor"
                            className="bi bi-arrow-right-short"
                            viewBox="0 0 16 16"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"
                            />
                          </svg>
                        </span>
                      </Link>
                    </div>
                  </div>
                ))}
              </Slider>
            )}

            {!loading && !hasCourses && (
              <Slider {...settings}>
                {data.map((item, i) => (
                  <div key={i} className="single-slider">
                    <div className="slider-img">
                      <img src={item.img} alt="" />
                    </div>
                    <div className="heading">
                      <h3>
                        <Link to="/project/project-details">{item.title}</Link>
                      </h3>
                      <Link to="/project/project-details" className="learn">
                        {item.btnName}{" "}
                        <span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="30"
                            fill="currentColor"
                            className="bi bi-arrow-right-short"
                            viewBox="0 0 16 16"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"
                            />
                          </svg>
                        </span>
                      </Link>
                    </div>
                  </div>
                ))}
              </Slider>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Project1;