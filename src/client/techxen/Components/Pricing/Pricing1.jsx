import SectionTitle from "../Common/SectionTitle";
import PricingCard1 from "./PricingCard1";

const planTitles = ["Gói Cơ Bản", "Gói Tiêu Chuẩn", "Gói Cao Cấp"];
const planDescriptions = [
  "Ideal cho cá nhân và startup cần VPS cơ bản để bắt đầu.",
  "Phù hợp doanh nghiệp đang phát triển, cần thêm tài nguyên và hỗ trợ.",
  "Dành cho hệ thống lớn, yêu cầu hiệu năng và bảo mật cao.",
];

const Pricing1 = ({ plans = [], loading = false }) => {
  const hasPlans = Array.isArray(plans) && plans.length > 0;

  const formatVnd = (value) => {
    const num = Number(value);
    if (Number.isFinite(num)) {
      return num.toLocaleString("vi-VN") + " VNĐ";
    }
    return `${value} VNĐ`;
  };

  return (
    <div className="pricing sp">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 m-auto text-center">
            <div className="heading1">
              <SectionTitle
                SubTitle="Gói VPS H3Station"
                Title="Chọn cấu hình phù hợp ngân sách và nhu cầu của bạn"
              ></SectionTitle>
            </div>
          </div>
        </div>

        <div className="space30"></div>
        <div className="row">
          {loading && !hasPlans && (
            <div className="col-12 text-center text-muted">Đang tải gói VPS...</div>
          )}

          {!loading &&
            hasPlans &&
            plans.slice(0, 3).map((plan, idx) => (
              <PricingCard1
                key={plan.id}
                addClass={`single-pricing-box ${idx === 1 ? "active" : ""}`}
                popularTitle={idx === 1 || plan.popular ? "Phổ biến nhất" : ""}
                title={planTitles[idx] || "Gói VPS"}
                price={formatVnd(plan.price)}
                monthly="tháng"
                content={planDescriptions[idx] || "VPS hiệu năng ổn định cho mọi nhu cầu."}
                featuretitle="Thông số chính:"
                featurelist={[
                  `CPU: ${plan.cpu}`,
                  `RAM: ${plan.ram}`,
                  `SSD: ${plan.ssd}`,
                  `Băng thông: ${plan.bandwidth}`,
                ]}
                btnname="Đặt hàng"
                btnUrl="#"
              ></PricingCard1>
            ))}

          {!loading && !hasPlans && (
            <>
              <PricingCard1
                addClass="single-pricing-box"
                popularTitle=""
                title="Gói Cơ Bản"
                price="99.000 VNĐ"
                monthly="tháng"
                content="Ideal cho startup và cá nhân cần VPS cơ bản."
                featuretitle="Thông số chính:"
                featurelist={[
                  "1 vCPU, 1GB RAM, 20GB SSD",
                  "Băng thông phù hợp website nhỏ",
                  "Hỗ trợ kỹ thuật qua ticket",
                ]}
                btnname="Đặt hàng"
                btnUrl="#"
              ></PricingCard1>

              <PricingCard1
                addClass="single-pricing-box active"
                popularTitle="Phổ biến nhất"
                title="Gói Tiêu Chuẩn"
                price="199.000 VNĐ"
                monthly="tháng"
                content="Phù hợp doanh nghiệp vừa cần hiệu năng tốt và ổn định."
                featuretitle="Thông số chính:"
                featurelist={[
                  "2 vCPU, 4GB RAM, 60GB SSD",
                  "Băng thông cao, phù hợp nhiều user",
                  "Giám sát & hỗ trợ ưu tiên",
                ]}
                btnname="Đặt hàng"
                btnUrl="#"
              ></PricingCard1>

              <PricingCard1
                addClass="single-pricing-box"
                popularTitle=""
                title="Gói Cao Cấp"
                price="299.000 VNĐ"
                monthly="tháng"
                content="Dành cho hệ thống lớn, yêu cầu bảo mật và uptime cao."
                featuretitle="Thông số chính:"
                featurelist={[
                  "4 vCPU, 8GB RAM, 160GB SSD",
                  "Uptime cao, tài nguyên mạnh",
                  "Hỗ trợ 24/7 & tư vấn tối ưu hạ tầng",
                ]}
                btnname="Đặt hàng"
                btnUrl="#"
              ></PricingCard1>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pricing1;
