import { Link } from "react-router-dom";

const Mission1 = () => {
    return (
        <div className="solution sp bg1">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="heading1">
                  <span className="span"><img src="/assets/img/icons/span1.png" alt="" /> Our Mission</span>
                  <h2>Innovating for Success: Our Technology Mission</h2>
                  <div className="space16"></div>
                  <p>H3Station đặt mục tiêu mang đến hạ tầng số và giải pháp tự động hóa giúp doanh nghiệp tăng trưởng, vận hành hiệu quả và bền vững. Chúng tôi muốn trở thành đối tác tin cậy khi bạn cần mở rộng hoặc tối ưu hệ thống.</p>
                  <div className="space16"></div>
                  <p>Chúng tôi tin rằng công nghệ phải phục vụ mục tiêu kinh doanh. Bằng kinh nghiệm về VPS, cloud và n8n, H3Station giúp bạn triển khai nhanh, bảo mật dữ liệu và duy trì hệ thống ổn định 24/7.</p>

                  <div className="space30"></div>
                  <div className="">
                    <Link className="theme-btn1" to="/contact">Get A Quote <span><i className="bi bi-arrow-right"></i></span></Link>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="solution-images">
                  <div className="image1">
                    <img src="/assets/img/others/solution-img1.png" alt="" />
                  </div>
                  <div className="image2">
                    <img src="/assets/img/others/solution-img2.png" alt="" />
                  </div>
                  <div className="image3">
                    <img src="/assets/img/others/solution-img3.png" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
};

export default Mission1;