import { useEffect } from "react";
import ServiceCard from "./ServiceCard";
import loadBackgroudImages from "../Common/loadBackgroudImages";

const Service1 = () => {

    const HeadingContent = {
        title1:'Nâng cao hiệu quả',
        title2:'Doanh nghiệp của bạn',
        Content:'3HStation cung cấp các giải pháp công nghệ giúp doanh nghiệp tự động hóa quy trình, tối ưu hóa vận hành và phát triển bền vững.',
      }

      useEffect(() => {
        loadBackgroudImages();
      }, []);


    return (
        <div className="service-section service" data-background="/assets/images/resource/service-bg.jpg">
		<div className="container">
			<div className="row dream1-bg">
				<div className="col-lg-6">
					<div className="row">
						<div className="col-lg-12">
							<div className="dexon-section-title white padding-lg1">
								<h1>{HeadingContent.title1}</h1>
								<h1 className="sections">{HeadingContent.title2}</h1>
								<p>{HeadingContent.Content}</p>
							</div>
						</div>
						<div className="col-lg-12">
							<div className="single-service-box upper2">
                            <ServiceCard
                                title="Workflow Tự động hóa"
                                content="Tự động hóa các quy trình nghiệp vụ, giảm thiểu thao tác thủ công, tăng hiệu quả và năng suất làm việc cho doanh nghiệp."
                                btnName="Xem thêm"
                                btnUrl="/service/service-details"
                            ></ServiceCard>
							</div>
						</div>
					</div>
				</div>
				<div className="col-lg-6">
					<div className="row">
						<div className="col-lg-12">
							<div className="single-service-box upper">
                            <ServiceCard
                                title="Khóa học Chuyên sâu"
                                content="Nâng cao kỹ năng nhân viên với các khóa học thực tế, được thiết kế bởi các chuyên gia hàng đầu trong lĩnh vực."
                                btnName="Xem thêm"
                                btnUrl="/service/service-details"
                            ></ServiceCard>
							</div>
						</div>

						<div className="col-lg-12">
							<div className="single-service-box upper3">
                            <ServiceCard
                                title="VPS Hiệu năng cao"
                                content="Hạ tầng VPS mạnh mẽ, ổn định với nhiều gói dịch vụ phù hợp với nhu cầu doanh nghiệp từ nhỏ đến lớn."
                                btnName="Xem thêm"
                                btnUrl="/service/service-details"
                            ></ServiceCard>
							</div>
						</div>

					</div>
				</div>
				<div className="service-shape">
					<div className="serivce-shape">
						<img src="/assets/images/resource/shap-2.png" alt="img" />
					</div>
					<div className="serivce-shape2">
						<img src="/assets/images/resource/shape3.png" alt="img" />
					</div>
				</div>
			</div>
		</div>
	</div>

    );
};

export default Service1;