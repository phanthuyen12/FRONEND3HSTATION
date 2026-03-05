import { useEffect, useState } from "react";
import Slider from "react-slick";
import SectionTitle from "../Common/SectionTitle";
import VPSCard from "./VPSCard";

const VPSList = () => {
    const [vpsPlans, setVpsPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // API base URL - có thể config sau
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000api';

    useEffect(() => {
        const fetchVPSPlans = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/client/vps/plans`);
                
                if (!response.ok) {
                    throw new Error('Không thể tải danh sách VPS');
                }
                
                const result = await response.json();
                
                if (result.success && result.data) {
                    setVpsPlans(result.data.data || result.data || []);
                } else {
                    setVpsPlans([]);
                }
            } catch (err) {
                console.error('Error fetching VPS plans:', err);
                setError(err.message);
                // Fallback data nếu API không hoạt động
                setVpsPlans([]);
            } finally {
                setLoading(false);
            }
        };

        fetchVPSPlans();
    }, [API_BASE_URL]);

    // Cấu hình slider - chỉ dùng khi có hơn 3 items
    const shouldUseSlider = vpsPlans.length > 3;
    
    const sliderSettings = {
        dots: false,
        infinite: true,
        speed: 2000,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,
        swipeToSlide: true,
        autoplay: true,
        autoplaySpeed: 3000,
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
            },
            {
                breakpoint: 575,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    };

    if (loading) {
        return (
            <div className="vps-list sp">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 m-auto text-center">
                            <p>Đang tải danh sách VPS...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="vps-list sp">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 m-auto text-center">
                            <p className="text-danger">Lỗi: {error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (vpsPlans.length === 0) {
        return null;
    }

    return (
        <div className="vps-list sp">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 m-auto text-center">
                        <div className="heading1">
                            <SectionTitle
                                SubTitle="Gói VPS"
                                Title="Chọn gói VPS phù hợp với nhu cầu của bạn"
                            ></SectionTitle>
                        </div>
                    </div>
                </div>

                <div className="space30"></div>
                
                {shouldUseSlider ? (
                    <div className="row">
                        <div className="vps-slider cs_slider_gap_30">
                            <Slider {...sliderSettings}>
                                {vpsPlans.map((plan) => (
                                    <div key={plan.id} className="single-slider">
                                        <VPSCard 
                                            plan={plan}
                                            inSlider={true}
                                        />
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </div>
                ) : (
                    <div className="row">
                        {vpsPlans.map((plan) => (
                            <VPSCard 
                                key={plan.id}
                                plan={plan}
                                addClass={vpsPlans.length === 1 ? "col-lg-12" : vpsPlans.length === 2 ? "col-lg-6" : "col-lg-4"}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VPSList;

