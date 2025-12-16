import { Link } from "react-router-dom";
import SectionTitle from "../Common/SectionTitle";
import { useEffect } from "react";
import loadBackgroudImages from "../Common/loadBackgroudImages";

const Cta = () => {

    const CallContent = {
        icon:'/assets/images/resource/call.png',
        title2:'+98 069 (2350) 020',
        Content:'Whats App/Call',
      }    

      useEffect(() => {
        loadBackgroudImages();
      }, []);
      

    return (
        <div className="call-to-action" data-background="/assets/images/resource/call-bg.png">
		<div className="container">
			<div className="row dream1-bg">
				<div className="col-lg-6">
					<div className="dexon-section-title white">
                    <SectionTitle
                            Title="Sẵn sàng bắt đầu với <br> 3HStation?"
                            Content="Tham gia cùng hàng nghìn doanh nghiệp đã tin tưởng sử dụng 3HStation để tự động hóa quy trình, nâng cao kỹ năng và tối ưu hóa hạ tầng công nghệ."
                    ></SectionTitle>
					</div>
					<div className="dexon-button">
						<Link className="dexon-button" to="/contact">Liên hệ ngay <i className="bi bi-arrow-right-short"></i></Link>
					</div>
				</div>
				<div className="col-lg-3"></div>
				<div className="col-lg-3">
					<div className="call-info">
						<div className="call-icon">
							<img src={CallContent.icon} alt="" />
						</div>
						<div className="call-number">
							<h1>{CallContent.title2}</h1>
						</div>
						<div className="call-text">
							<span>({CallContent.Content})</span>
						</div>
					</div>
				</div>
				<div className="call-to-all-shape">
					<div className="call-shape">
						<img src="/assets/images/resource/line.png" alt="" />
					</div>
					<div className="call-shape2">
						<img src="/assets/images/resource/shap2.png" alt="" />
					</div>
					<div className="call-shape3">
						<img src="/assets/images/resource/shap1.png" alt="" />
					</div>
				</div>
			</div>
		</div>
	</div>
    );
};

export default Cta;