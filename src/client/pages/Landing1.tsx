import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { workflowsService, vpsService, elearningService } from '../../config';

const Landing1: React.FC = () => {
    const [workflows, setWorkflows] = useState<any[]>([]);
    const [vpsPlans, setVpsPlans] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Demo data - 80 items total (40 tools + 40 courses)
    const demoTools = [
        { id: 'demo-1', name: 'Tạo video bán hàng tự động bằng AI', description: 'Tạo video quảng cáo sản phẩm chuyên nghiệp chỉ với vài click' },
        { id: 'demo-2', name: 'Viết kịch bản TikTok viral', description: 'AI viết kịch bản thu hút triệu views cho TikTok Shop' },
        { id: 'demo-3', name: 'Chỉnh sửa video tự động', description: 'Cắt ghép, thêm phụ đề, hiệu ứng tự động bằng AI' },
        { id: 'demo-4', name: 'Tạo avatar AI cho video', description: 'Tạo người dẫn chương trình ảo cho video bán hàng' },
        { id: 'demo-5', name: 'SEO YouTube tự động', description: 'Tối ưu tiêu đề, mô tả, tags để video lên top tìm kiếm' },
        { id: 'demo-6', name: 'Phân tích đối thủ YouTube', description: 'Theo dõi và học hỏi chiến lược từ kênh thành công' },
        { id: 'demo-7', name: 'Tạo thumbnail hấp dẫn', description: 'Thiết kế ảnh bìa video thu hút click tự động' },
        { id: 'demo-8', name: 'Lên lịch đăng video tối ưu', description: 'Tự động đăng video vào giờ vàng có nhiều người xem' },
        { id: 'demo-9', name: 'Viết content Facebook bán hàng', description: 'AI viết bài đăng Facebook thu hút tương tác cao' },
        { id: 'demo-10', name: 'Quản lý inbox tự động', description: 'Trả lời tin nhắn khách hàng 24/7 bằng chatbot AI' },
        { id: 'demo-11', name: 'Tạo landing page bán hàng', description: 'Thiết kế trang bán hàng chuyển đổi cao trong 5 phút' },
        { id: 'demo-12', name: 'Email marketing tự động', description: 'Gửi email chăm sóc khách hàng và remarketing' },
        { id: 'demo-13', name: 'Phân tích dữ liệu bán hàng', description: 'Dashboard theo dõi doanh số realtime' },
        { id: 'demo-14', name: 'Quản lý kho hàng thông minh', description: 'Tự động cập nhật tồn kho trên nhiều sàn' },
        { id: 'demo-15', name: 'Chăm sóc khách hàng AI', description: 'Chatbot tư vấn sản phẩm 24/7' },
        { id: 'demo-16', name: 'Tạo quảng cáo Google Ads', description: 'Viết và tối ưu quảng cáo Google tự động' },
        { id: 'demo-17', name: 'Thiết kế banner quảng cáo', description: 'Tạo hình ảnh quảng cáo đẹp mắt bằng AI' },
        { id: 'demo-18', name: 'Viết mô tả sản phẩm SEO', description: 'Mô tả sản phẩm chuẩn SEO, thu hút khách hàng' },
        { id: 'demo-19', name: 'Tạo catalog sản phẩm', description: 'Thiết kế catalog điện tử chuyên nghiệp' },
        { id: 'demo-20', name: 'Quản lý đơn hàng đa kênh', description: 'Đồng bộ đơn từ Shopee, Lazada, TikTok Shop' },
        { id: 'demo-21', name: 'Tạo Reels Instagram tự động', description: 'Biến ảnh thành video Reels hấp dẫn' },
        { id: 'demo-22', name: 'Phân tích insight Facebook', description: 'Báo cáo chi tiết hiệu quả fanpage' },
        { id: 'demo-23', name: 'Tạo hashtag trending', description: 'Gợi ý hashtag viral cho từng ngành' },
        { id: 'demo-24', name: 'Quản lý bình luận tự động', description: 'Trả lời và ẩn spam comment tự động' },
        { id: 'demo-25', name: 'Tạo voucher khuyến mãi', description: 'Thiết kế mã giảm giá thu hút khách' },
        { id: 'demo-26', name: 'Phân tích giá đối thủ', description: 'Theo dõi giá sản phẩm cạnh tranh' },
        { id: 'demo-27', name: 'Tạo nội dung blog SEO', description: 'Viết bài blog chuẩn SEO tự động' },
        { id: 'demo-28', name: 'Quản lý review sản phẩm', description: 'Thu thập và phản hồi đánh giá' },
        { id: 'demo-29', name: 'Tạo infographic marketing', description: 'Thiết kế infographic thu hút' },
        { id: 'demo-30', name: 'Phân khúc khách hàng AI', description: 'Chia nhóm khách hàng thông minh' },
        { id: 'demo-31', name: 'Tạo quiz tương tác', description: 'Quiz thu hút khách và thu thập data' },
        { id: 'demo-32', name: 'Quản lý affiliate program', description: 'Hệ thống quản lý CTV bán hàng' },
        { id: 'demo-33', name: 'Tạo chatbot Messenger', description: 'Bot tư vấn tự động trên Messenger' },
        { id: 'demo-34', name: 'Phân tích xu hướng thị trường', description: 'Dự đoán trend sản phẩm hot' },
        { id: 'demo-35', name: 'Tạo video testimonial', description: 'Biên tập review khách hàng' },
        { id: 'demo-36', name: 'Quản lý chiến dịch SMS', description: 'Gửi SMS marketing hàng loạt' },
        { id: 'demo-37', name: 'Tạo popup chuyển đổi', description: 'Popup thu thập email hiệu quả' },
        { id: 'demo-38', name: 'Phân tích ROI quảng cáo', description: 'Đo lường hiệu quả chi tiêu ads' },
        { id: 'demo-39', name: 'Tạo story Instagram', description: 'Thiết kế story bán hàng đẹp mắt' },
        { id: 'demo-40', name: 'Quản lý loyalty program', description: 'Chương trình tích điểm khách hàng' },
    ];

    const demoCourses = [
        { id: 'course-1', title: 'Làm chủ n8n Automation từ A-Z', short_description: 'Khóa học toàn diện về tự động hóa với n8n', price: 1990000, is_free: false },
        { id: 'course-2', title: 'Marketing tự động với AI', short_description: 'Ứng dụng AI vào marketing hiệu quả', price: 2490000, is_free: false },
        { id: 'course-3', title: 'Bán hàng TikTok Shop 2024', short_description: 'Chiến lược bán hàng TikTok hiệu quả', price: 1490000, is_free: false },
        { id: 'course-4', title: 'YouTube kiếm tiền triệu views', short_description: 'Xây dựng kênh YouTube từ 0 đến triệu views', price: 1990000, is_free: false },
        { id: 'course-5', title: 'Facebook Ads chuyên sâu', short_description: 'Chạy quảng cáo Facebook ROI cao', price: 2990000, is_free: false },
        { id: 'course-6', title: 'Dropshipping toàn tập', short_description: 'Kinh doanh online không cần vốn', price: 1790000, is_free: false },
        { id: 'course-7', title: 'SEO Google top 1', short_description: 'Đưa website lên top Google', price: 2490000, is_free: false },
        { id: 'course-8', title: 'Content Marketing thực chiến', short_description: 'Viết content thu hút và bán hàng', price: 1290000, is_free: false },
        { id: 'course-9', title: 'Email Marketing Pro', short_description: 'Xây dựng hệ thống email tự động', price: 990000, is_free: false },
        { id: 'course-10', title: 'Chatbot AI cho doanh nghiệp', short_description: 'Xây dựng chatbot thông minh', price: 1490000, is_free: false },
        { id: 'course-11', title: 'Affiliate Marketing 2024', short_description: 'Kiếm tiền với tiếp thị liên kết', price: 1190000, is_free: false },
        { id: 'course-12', title: 'Shopee bán hàng hiệu quả', short_description: 'Chiến lược bán hàng Shopee', price: 890000, is_free: false },
        { id: 'course-13', title: 'Lazada từ cơ bản đến nâng cao', short_description: 'Làm chủ sàn Lazada', price: 890000, is_free: false },
        { id: 'course-14', title: 'Instagram Marketing 2024', short_description: 'Bán hàng hiệu quả trên Instagram', price: 1290000, is_free: false },
        { id: 'course-15', title: 'Zalo Marketing Pro', short_description: 'Marketing trên Zalo hiệu quả', price: 990000, is_free: false },
        { id: 'course-16', title: 'Google Shopping Ads', short_description: 'Quảng cáo sản phẩm trên Google', price: 1790000, is_free: false },
        { id: 'course-17', title: 'Thiết kế Canva chuyên nghiệp', short_description: 'Thiết kế marketing với Canva', price: 690000, is_free: false },
        { id: 'course-18', title: 'Video Marketing với CapCut', short_description: 'Dựng video bán hàng chuyên nghiệp', price: 790000, is_free: false },
        { id: 'course-19', title: 'Livestream bán hàng đỉnh cao', short_description: 'Kỹ năng livestream bán hàng', price: 1490000, is_free: false },
        { id: 'course-20', title: 'Xây dựng thương hiệu cá nhân', short_description: 'Personal branding hiệu quả', price: 1990000, is_free: false },
        { id: 'course-21', title: 'Telegram Marketing 2024', short_description: 'Bán hàng và xây dựng cộng đồng trên Telegram', price: 890000, is_free: false },
        { id: 'course-22', title: 'Pinterest Marketing cho E-commerce', short_description: 'Tăng traffic từ Pinterest', price: 790000, is_free: false },
        { id: 'course-23', title: 'LinkedIn B2B Marketing', short_description: 'Marketing B2B hiệu quả trên LinkedIn', price: 1590000, is_free: false },
        { id: 'course-24', title: 'Twitter/X Marketing Strategy', short_description: 'Xây dựng thương hiệu trên Twitter', price: 690000, is_free: false },
        { id: 'course-25', title: 'Snapchat Ads cho Gen Z', short_description: 'Quảng cáo hiệu quả đến Gen Z', price: 990000, is_free: false },
        { id: 'course-26', title: 'Influencer Marketing Mastery', short_description: 'Làm việc với KOLs hiệu quả', price: 1790000, is_free: false },
        { id: 'course-27', title: 'Conversion Rate Optimization', short_description: 'Tối ưu tỷ lệ chuyển đổi website', price: 1990000, is_free: false },
        { id: 'course-28', title: 'Growth Hacking 2024', short_description: 'Chiến lược tăng trưởng nhanh', price: 2490000, is_free: false },
        { id: 'course-29', title: 'Retargeting & Remarketing Pro', short_description: 'Chốt đơn từ khách cũ', price: 1290000, is_free: false },
        { id: 'course-30', title: 'Customer Journey Mapping', short_description: 'Thiết kế hành trình khách hàng', price: 1490000, is_free: false },
        { id: 'course-31', title: 'Marketing Analytics với GA4', short_description: 'Phân tích dữ liệu Google Analytics 4', price: 1590000, is_free: false },
        { id: 'course-32', title: 'Copywriting bán hàng đỉnh cao', short_description: 'Viết content bán hàng triệu đô', price: 1990000, is_free: false },
        { id: 'course-33', title: 'Photoshop cho Marketing', short_description: 'Thiết kế hình ảnh marketing chuyên nghiệp', price: 890000, is_free: false },
        { id: 'course-34', title: 'Premiere Pro - Video Editing', short_description: 'Dựng video quảng cáo chuyên nghiệp', price: 1290000, is_free: false },
        { id: 'course-35', title: 'After Effects - Motion Graphics', short_description: 'Tạo hiệu ứng video đẹp mắt', price: 1590000, is_free: false },
        { id: 'course-36', title: 'Figma UI/UX Design', short_description: 'Thiết kế giao diện website/app', price: 1490000, is_free: false },
        { id: 'course-37', title: 'WordPress E-commerce', short_description: 'Xây dựng website bán hàng với WooCommerce', price: 1190000, is_free: false },
        { id: 'course-38', title: 'Shopify Store Setup', short_description: 'Mở shop Shopify từ A-Z', price: 1390000, is_free: false },
        { id: 'course-39', title: 'Amazon FBA 2024', short_description: 'Bán hàng trên Amazon toàn cầu', price: 2990000, is_free: false },
        { id: 'course-40', title: 'Etsy Handmade Business', short_description: 'Kinh doanh handmade trên Etsy', price: 990000, is_free: false },
    ];

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [workflowsData, vpsData, coursesData] = await Promise.all([
                    workflowsService.fetchClientWorkflows({ limit: 40 }),
                    vpsService.fetchClientPlans(),
                    elearningService.getClientCourses({ limit: 40 }),
                ]);

                const apiWorkflows = workflowsData.data || [];
                const apiCourses = coursesData.data || [];

                // Combine API data with demo data to ensure we have enough items
                const combinedWorkflows = [...apiWorkflows];
                const combinedCourses = [...apiCourses];

                // Add demo data if we don't have enough (minimum 20 items each)
                if (combinedWorkflows.length < 20) {
                    combinedWorkflows.push(...demoTools.slice(0, 20 - combinedWorkflows.length));
                }
                if (combinedCourses.length < 20) {
                    combinedCourses.push(...demoCourses.slice(0, 20 - combinedCourses.length));
                }

                setWorkflows(combinedWorkflows);
                setVpsPlans(vpsData.slice(0, 3) || []);
                setCourses(combinedCourses);
            } catch (error) {
                console.error('Error loading data:', error);
                // Use demo data as complete fallback on error
                setWorkflows(demoTools);
                setCourses(demoCourses);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const toolCategories = [
        {
            title: 'KIẾM TIỀN TỪ TẠO VIDEO AI',
            tools: workflows.slice(0, 10).map(w => ({
                icon: (
                    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
                        <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                ),
                title: w.name,
                description: w.description,
                id: w.id,
            })),
        },
        {
            title: 'KIẾM TIỀN TỪ YOUTUBE',
            tools: workflows.slice(10, 20).map(w => ({
                icon: (
                    <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                ),
                title: w.name,
                description: w.description,
                id: w.id,
            })),
        },
        {
            title: 'KHÓA HỌC CHUYÊN SÂU',
            tools: courses.slice(0, 10).map(c => ({
                icon: (
                    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
                        <path d="M12 14l9-5-9-5-9 5 9 5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                ),
                title: c.title,
                description: c.short_description || c.description,
                id: c.id,
            })),
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-slate-100 via-white to-slate-50 py-16 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>

                <div className="relative max-w-7xl mx-auto px-4">
                    {/* Logo & Title */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-4 mb-6 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                                <div className="relative w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform">
                                    <span className="text-white text-3xl font-black">3H</span>
                                </div>
                            </div>
                            <div className="text-left">
                                <div className="text-3xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">3HSTATION</div>
                                <div className="text-sm text-slate-600 font-medium">Xây kênh bán hàng triệu views</div>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-4 leading-tight">
                            CÔNG CỤ XÂY KÊNH BÁN HÀNG<br />
                            <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">TỰ ĐỘNG</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-red-600 font-bold mb-8">
                            ĐÃ GIÚP HƠN 1.000 SHOP ĐẠT TỚI THIỂU 1 TRIỆU VIEWS TRỞ LÊN
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                            <Link
                                to="/register"
                                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                                ĐĂNG NHẬP TẠI ĐÂY
                            </Link>
                            <Link
                                to="/courses"
                                className="group px-8 py-4 bg-white border-2 border-red-600 text-red-600 rounded-xl font-bold shadow-lg hover:bg-red-50 hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                BẢNG CHỨNG HIỆU QUẢ
                            </Link>
                        </div>
                    </div>

                    {/* Tools Grid */}
                    {toolCategories.map((category, catIdx) => (
                        <div key={catIdx} className="mb-16">
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full"></div>
                                {category.title}
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {category.tools.map((tool, idx) => (
                                    <div
                                        key={idx}
                                        className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 border-2 border-slate-100 hover:border-yellow-400 hover:-translate-y-1"
                                    >
                                        <div className="flex gap-5">
                                            <div className="relative flex-shrink-0">
                                                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity"></div>
                                                <div className="relative w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                                                    {tool.icon}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-yellow-600 transition-colors">
                                                    {tool.title}
                                                </h3>
                                                <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                                                    {tool.description}
                                                </p>
                                                <div className="flex gap-3">
                                                    <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                        </svg>
                                                        SỬ DỤNG
                                                    </button>
                                                    <button className="px-5 py-2.5 bg-white border-2 border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 flex items-center gap-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        XEM DEMO
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8 mb-8">
                        <div>
                            <h4 className="font-bold mb-4">MỘT SẢN PHẨM CỦA 3HSTATION</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li>— Chính sách bảo mật</li>
                                <li>— Hướng dẫn đăng ký và sử dụng</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4">THỜI GIAN LÀM VIỆC</h4>
                            <p className="text-sm text-slate-400">
                                7h30 đến 17h30 các ngày trong tuần (Chủ nhật nghỉ)
                            </p>
                            <p className="text-yellow-400 font-bold mt-2">
                                Hotline: 0869895748 (Mr. Alen)
                            </p>
                            <p className="text-sm text-slate-400 mt-2">
                                3hstation@gmail.com
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Ứng dụng tự động hóa n8n hàng đầu Việt Nam đã được hàng nghìn doanh nghiệp tin dùng.
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
                        <p>© 2025 3HSTATION. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* Floating Action Buttons */}
            <div className="fixed right-6 bottom-6 flex flex-col gap-3 z-50">
                <a
                    href="https://m.me/3hstation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 bg-blue-600 rounded-full shadow-lg hover:shadow-2xl transition-all flex items-center justify-center text-white transform hover:scale-110"
                >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3 .97 4.29L2 22l5.71-.97C9 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
                    </svg>
                </a>
                <a
                    href="tel:0869895748"
                    className="w-14 h-14 bg-green-500 rounded-full shadow-lg hover:shadow-2xl transition-all flex items-center justify-center text-white transform hover:scale-110"
                >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
                    </svg>
                </a>
            </div>
        </div>
    );
};

export default Landing1;
