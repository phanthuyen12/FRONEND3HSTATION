import { Link } from "react-router-dom";
import SectionTitle from "../Common/SectionTitle";

const Blog1 = ({ workflows = [] }) => {
  const hasWorkflows = Array.isArray(workflows) && workflows.length > 0;

  return (
    <div className="blog sp">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 m-auto text-center">
            <div className="heading1">
              <SectionTitle
                SubTitle="Blog & Latest News"
                Title="Latest News & Blog"
              ></SectionTitle>
            </div>
          </div>
        </div>
        <div className="space30"></div>
        <div className="row">
          {!hasWorkflows && (
            <div className="col-12 text-center text-muted">
              Chưa có workflow nào.
            </div>
          )}

          {hasWorkflows &&
            workflows.slice(0, 3).map((wf, idx) => (
              <div className="col-lg-4" key={wf.id || wf.name || idx}>
                <div
                  className="blog-box"
                  data-aos="zoom-in-up"
                  data-aos-duration={1100 - idx * 200}
                >
                  <div className="image image-anime">
                    <img
                      src={wf.image || wf.thumbnail || `/assets/img/blog/blog-img${idx + 1}.png`}
                      alt={wf.name || ""}
                    />
                  </div>
                  <div className="heading">
                    <div className="tags">
                      {/* Giữ đúng cấu trúc 2 tag nhưng dùng label chung */}
                      <a href="#">
                        <img src="/assets/img/icons/blog-icon1.png" alt="" /> n8n Workflow
                      </a>
                      <a href="#">
                        <img src="/assets/img/icons/blog-icon2.png" alt="" /> H3Station
                      </a>
                    </div>
                    <h4>
                      <a href="#">{wf.name}</a>
                    </h4>
                    <a href="#" className="learn">
                      Learn More{" "}
                      <span>
                        <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Blog1;