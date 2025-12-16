import { Link } from "react-router-dom";

const VPSCard = ({ plan, addClass = "", inSlider = false }) => {
    const formatPrice = (price) => {
        const numPrice = parseFloat(price) || 0;
        return new Intl.NumberFormat('vi-VN').format(numPrice);
    };

    const cardContent = (
        <div className={`single-pricing-box ${plan.popular ? 'active' : ''}`}>
            {plan.popular && (
                <div className="most-popular">
                    <p>Phổ biến</p>
                </div>
            )}
            
            {plan.discountLabel && (
                <div className="discount-badge" style={{ position: 'absolute', top: '10px', right: '10px', background: '#ff6b6b', color: 'white', padding: '5px 10px', borderRadius: '5px', fontSize: '12px' }}>
                    <p>{plan.discountLabel}</p>
                </div>
            )}

            <p className="title">{plan.name}</p>
            <h2>{formatPrice(plan.price)}<span>/ {plan.unit || 'tháng'}</span></h2>
            <p className="pera">Gói VPS hiệu năng cao với cấu hình mạnh mẽ</p>

            <div className="border"></div>

            <h4>Thông số kỹ thuật:</h4>
            <ul className="list">
                <li><span><i className="bi bi-check-lg"></i></span> <strong>CPU:</strong> {plan.cpu}</li>
                <li><span><i className="bi bi-check-lg"></i></span> <strong>RAM:</strong> {plan.ram}</li>
                <li><span><i className="bi bi-check-lg"></i></span> <strong>SSD:</strong> {plan.ssd}</li>
                <li><span><i className="bi bi-check-lg"></i></span> <strong>Bandwidth:</strong> {plan.bandwidth}</li>
            </ul>

            <div className="space30"></div>
            <div className="button">
                <Link className="theme-btn1" to={`/vps/${plan.id}`}>
                    Chọn gói <span><i className="bi bi-arrow-right"></i></span>
                </Link>
            </div>
        </div>
    );

    if (inSlider) {
        return cardContent;
    }

    return (
        <div className={addClass || "col-lg-4"} data-aos="fade-up" data-aos-duration="1100">
            {cardContent}
        </div>
    );
};

export default VPSCard;

