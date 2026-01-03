import React, { useState } from 'react';

interface Project {
    id: number;
    title: string;
    description: string;
    image: string;
    category: string;
    client: string;
    technologies: string[];
    results: string[];
}

const ProjectsShowcase: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const projects: Project[] = [
        {
            id: 1,
            title: 'Hệ thống tự động hóa Marketing cho E-commerce',
            description: 'Tự động hóa toàn bộ quy trình marketing từ thu thập leads, gửi email, đến chăm sóc khách hàng',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
            category: 'E-commerce',
            client: 'ABC Shop',
            technologies: ['n8n', 'Gmail API', 'Facebook API', 'Google Sheets'],
            results: [
                'Tăng 300% hiệu quả marketing',
                'Tiết kiệm 70% thời gian xử lý',
                'Tự động hóa 15+ quy trình',
            ],
        },
        {
            id: 2,
            title: 'Workflow tự động xử lý đơn hàng',
            description: 'Kết nối Shopee, Lazada, TikTok Shop để xử lý đơn hàng tự động và đồng bộ kho',
            image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
            category: 'Logistics',
            client: 'XYZ Trading',
            technologies: ['n8n', 'Shopee API', 'Lazada API', 'MySQL'],
            results: [
                'Xử lý 1000+ đơn/ngày tự động',
                'Giảm 90% lỗi nhập liệu',
                'Đồng bộ real-time 3 sàn',
            ],
        },
        {
            id: 3,
            title: 'Chatbot hỗ trợ khách hàng 24/7',
            description: 'AI Chatbot tích hợp Messenger, Zalo, Telegram để tư vấn và hỗ trợ khách hàng',
            image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800',
            category: 'Customer Service',
            client: 'Tech Support Co.',
            technologies: ['n8n', 'OpenAI GPT', 'Messenger API', 'Zalo API'],
            results: [
                'Phản hồi tức thì 24/7',
                'Giải quyết 80% câu hỏi tự động',
                'Tăng 250% satisfaction rate',
            ],
        },
        {
            id: 4,
            title: 'Hệ thống báo cáo tự động',
            description: 'Tự động thu thập dữ liệu, phân tích và gửi báo cáo hàng ngày cho management',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
            category: 'Analytics',
            client: 'Digital Agency',
            technologies: ['n8n', 'Google Analytics', 'Data Studio', 'Slack'],
            results: [
                'Báo cáo tự động mỗi sáng',
                'Tiết kiệm 10h/tuần',
                'Dữ liệu real-time chính xác',
            ],
        },
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % projects.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + projects.length) % projects.length);
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    return (
        <>
            {/* Projects Section */}
            <div className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16 animate-fade-in-up">
                        <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold mb-4">
                            🏆 Dự án tiêu biểu
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">
                            Câu chuyện thành công
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Hơn 100+ dự án tự động hóa thành công cho các doanh nghiệp
                        </p>
                    </div>

                    {/* Carousel */}
                    <div className="relative max-w-5xl mx-auto">
                        {/* Main Slide */}
                        <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                            <div
                                className="flex transition-transform duration-500 ease-out"
                                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                            >
                                {projects.map((project) => (
                                    <div key={project.id} className="min-w-full">
                                        <div className="relative h-96 md:h-[500px]">
                                            <img
                                                src={project.image}
                                                alt={project.title}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>

                                            {/* Content Overlay */}
                                            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                                                <span className="inline-block px-3 py-1 bg-yellow-500 text-slate-900 rounded-full text-sm font-semibold mb-4">
                                                    {project.category}
                                                </span>
                                                <h3 className="text-2xl md:text-4xl font-black mb-3">
                                                    {project.title}
                                                </h3>
                                                <p className="text-lg text-slate-200 mb-6 max-w-2xl">
                                                    {project.description}
                                                </p>
                                                <button
                                                    onClick={() => setSelectedProject(project)}
                                                    className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-slate-900 rounded-xl font-bold hover:shadow-xl hover:shadow-yellow-500/50 transition-all transform hover:scale-105"
                                                >
                                                    Xem chi tiết →
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Navigation Arrows */}
                            <button
                                onClick={prevSlide}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
                            >
                                <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
                            >
                                <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        {/* Dots Indicator */}
                        <div className="flex justify-center gap-2 mt-6">
                            {projects.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`w-3 h-3 rounded-full transition-all ${index === currentSlide
                                            ? 'bg-yellow-500 w-8'
                                            : 'bg-slate-300 hover:bg-slate-400'
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Thumbnails */}
                        <div className="grid grid-cols-4 gap-4 mt-8">
                            {projects.map((project, index) => (
                                <button
                                    key={project.id}
                                    onClick={() => goToSlide(index)}
                                    className={`relative rounded-xl overflow-hidden transition-all transform hover:scale-105 ${index === currentSlide
                                            ? 'ring-4 ring-yellow-500 shadow-xl'
                                            : 'opacity-60 hover:opacity-100'
                                        }`}
                                >
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-24 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-2">
                                        <span className="text-white text-xs font-semibold line-clamp-2">
                                            {project.title}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Project Detail Modal */}
            {selectedProject && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-60 p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-fade-in-up">
                        {/* Modal Header */}
                        <div className="relative h-64">
                            <img
                                src={selectedProject.image}
                                alt={selectedProject.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                            <button
                                onClick={() => setSelectedProject(null)}
                                className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all"
                            >
                                <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <div className="absolute bottom-6 left-6 right-6">
                                <span className="inline-block px-3 py-1 bg-yellow-500 text-slate-900 rounded-full text-sm font-semibold mb-3">
                                    {selectedProject.category}
                                </span>
                                <h3 className="text-3xl font-black text-white">
                                    {selectedProject.title}
                                </h3>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8">
                            <div className="grid md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <h4 className="text-lg font-bold text-slate-900 mb-3">Khách hàng</h4>
                                    <p className="text-slate-600">{selectedProject.client}</p>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-slate-900 mb-3">Công nghệ</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedProject.technologies.map((tech, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h4 className="text-lg font-bold text-slate-900 mb-3">Mô tả dự án</h4>
                                <p className="text-slate-600 leading-relaxed">
                                    {selectedProject.description}
                                </p>
                            </div>

                            <div>
                                <h4 className="text-lg font-bold text-slate-900 mb-4">Kết quả đạt được</h4>
                                <div className="grid md:grid-cols-3 gap-4">
                                    {selectedProject.results.map((result, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border border-yellow-200"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <p className="text-sm font-semibold text-slate-900">{result}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-slate-200">
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className="w-full px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-slate-900 rounded-xl font-bold hover:shadow-xl transition-all"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProjectsShowcase;
