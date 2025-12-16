import { Link } from "react-router-dom";

const Cta1 = () => {
    return (
        <div className="cta">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-7">
                <div className="heading1-w">
                  <h2 className="title tg-element-title">H3STATION sẵn sàng đồng hành cùng doanh nghiệp của bạn</h2>
                  <div className="space16"></div>
                  <p data-aos="fade-right" data-aos-duration="700" >Liên hệ ngay để được tư vấn giải pháp VPS, server và tự động hóa n8n tối ưu cho quy trình của bạn. Đội ngũ H3Station hỗ trợ triển khai nhanh, bảo trì trọn vòng đời.</p>
                </div>
              </div>

              <div className="col-lg-5">
                <div className="buttons">
                  <Link className="cta-btn1" to="/contact">Đặt lịch tư vấn <span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-arrow-right-short" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"/>
                      </svg>
                    </span></Link>
                  <Link className="cta-btn2" to="/service">Xem gói dịch vụ <span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-arrow-right-short" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"/>
                      </svg>                   
                    </span></Link>
                </div>
              </div>
            </div>
          </div>
        </div>

    );
};

export default Cta1;