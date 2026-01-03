import React, { useState } from 'react';

const NewSections: React.FC = () => {
    const [email, setEmail] = useState('');

    const workflowSteps = [
        {
            icon: '💡',
            title: 'Phân tích & Lên ý tưởng',
            description: 'Chúng tôi phân tích quy trình hiện tại và đề xuất giải pháp tự động hóa tối ưu nhất',
            color: 'from-red-400 to-pink-500',
        },
        {
            icon: '🎨',
            title: 'Thiết kế & Phát triển',
            description: 'Xây dựng workflow với n8n, tích hợp các công cụ và tối ưu hóa hiệu suất',
            color: 'from-yellow-400 to-orange-500',
        },
        {
            icon: '🚀',
            title: 'Kiểm thử & Triển khai',
            description: 'Test kỹ lưỡng, đào tạo team và triển khai lên môi trường production',
            color: 'from-green-400 to-emerald-500',
        },
    ];

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Đã đăng ký với email: ${email}`);
        setEmail('');
    };

    return (
        <>
            {/* About Us Section */}
            <div className="py-24 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-10 right-10 w-32 h-32 bg-yellow-100 rounded-full opacity-50"></div>
                <div className="absolute bottom-10 left-10 w-40 h-40 bg-yellow-50 rounded-full opacity-50"></div>

                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left - Illustration */}
                        <div className="relative">
                            <div className="relative z-10">
                                <img
                                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800"
                                    alt="Team collaboration"
                                    className="rounded-2xl shadow-2xl"
                                />
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl opacity-20 blur-2xl"></div>
                        </div>

                        {/* Right - Content */}
                        <div>
                            <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold mb-4">
                                VỀ CHÚNG TÔI
                            </span>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                                CHÚNG TÔI CÓ THỂ GIÚP
                                <br />
                                <span className="text-yellow-600">MỤC TIÊU KINH DOANH</span>
                                <br />
                                CỦA BẠN
                            </h2>
                            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                                3HSTATION là đối tác tin cậy của hơn 1000+ doanh nghiệp trong việc tự động hóa quy trình làm việc.
                                Chúng tôi kết hợp công nghệ n8n hiện đại với kinh nghiệm thực tế để mang lại giải pháp tối ưu nhất.
                            </p>
                            <p className="text-slate-600 mb-8 leading-relaxed">
                                Với đội ngũ chuyên gia giàu kinh nghiệm, chúng tôi cam kết mang đến dịch vụ chất lượng cao,
                                hỗ trợ 24/7 và giải pháp phù hợp với từng nhu cầu cụ thể của doanh nghiệp bạn.
                            </p>

                            {/* Signature */}
                            <div className="mb-8">
                                <div className="text-2xl font-bold text-slate-900 mb-1" style={{ fontFamily: 'cursive' }}>
                                    Nguyễn Văn A
                                </div>
                                <div className="text-sm font-semibold text-slate-600">CEO 3HSTATION</div>
                            </div>

                            <button className="group px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-slate-900 rounded-xl font-bold hover:shadow-xl hover:shadow-yellow-500/50 transition-all inline-flex items-center gap-2">
                                TÌM HIỂU THÊM
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Work Flow Section */}
            <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold mb-4">
                            QUY TRÌNH
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                            QUY TRÌNH LÀM VIỆC
                        </h2>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left - Steps */}
                        <div className="space-y-8">
                            {workflowSteps.map((step, idx) => (
                                <div key={idx} className="flex gap-6 group">
                                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg`}>
                                        {step.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                                        <p className="text-slate-600 leading-relaxed">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Right - Illustration */}
                        <div className="relative">
                            <div className="relative z-10">
                                <img
                                    src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800"
                                    alt="Developer working"
                                    className="rounded-2xl shadow-2xl"
                                />
                            </div>
                            {/* Decorative code tags */}
                            <div className="absolute -top-6 -right-6 bg-slate-900 text-yellow-400 px-4 py-2 rounded-lg font-mono text-sm shadow-xl">
                                &lt;/&gt; CSS
                            </div>
                            <div className="absolute top-1/4 -left-6 bg-slate-900 text-green-400 px-4 py-2 rounded-lg font-mono text-sm shadow-xl">
                                HTML
                            </div>
                            <div className="absolute bottom-1/4 -right-6 bg-slate-900 text-blue-400 px-4 py-2 rounded-lg font-mono text-sm shadow-xl">
                                C++
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Newsletter Section */}
            <div className="py-24 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full"></div>
                </div>

                {/* Floating icons */}
                <div className="absolute top-20 left-20 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl animate-bounce" style={{ animationDuration: '3s' }}>
                    <span className="text-2xl">🎯</span>
                </div>
                <div className="absolute top-40 right-32 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>
                    <span className="text-2xl">📊</span>
                </div>
                <div className="absolute bottom-32 left-40 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl animate-bounce" style={{ animationDuration: '2s', animationDelay: '1s' }}>
                    <span className="text-2xl">📝</span>
                </div>
                <div className="absolute bottom-40 right-20 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl animate-bounce" style={{ animationDuration: '2.8s', animationDelay: '0.3s' }}>
                    <span className="text-2xl">💼</span>
                </div>
                <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl animate-bounce" style={{ animationDuration: '3.2s', animationDelay: '0.7s' }}>
                    <span className="text-2xl">🔔</span>
                </div>
                <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl animate-bounce" style={{ animationDuration: '2.3s', animationDelay: '1.2s' }}>
                    <span className="text-2xl">💡</span>
                </div>

                <div className="relative max-w-4xl mx-auto px-4 text-center">
                    <span className="inline-block px-4 py-2 bg-white/30 backdrop-blur-sm text-slate-900 rounded-full text-sm font-semibold mb-6">
                        NEWSLETTER
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                        ĐĂNG KÝ NHẬN
                        <br />
                        NEWSLETTER CỦA CHÚNG TÔI
                    </h2>
                    <p className="text-lg text-slate-900 mb-8 max-w-2xl mx-auto">
                        Nhận tin tức mới nhất về tự động hóa, tips & tricks, và các ưu đãi đặc biệt từ 3HSTATION
                    </p>

                    <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
                        <div className="flex gap-3">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Nhập email của bạn"
                                required
                                className="flex-1 px-6 py-4 rounded-xl border-2 border-white/30 bg-white/20 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:border-white transition-all"
                            />
                            <button
                                type="submit"
                                className="px-8 py-4 bg-slate-900 text-yellow-400 rounded-xl font-bold hover:bg-slate-800 transition-all whitespace-nowrap"
                            >
                                ĐĂNG KÝ NGAY
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Business Help Section */}
            <div className="py-24 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-20 right-20 w-64 h-64 bg-yellow-100 rounded-full opacity-30"></div>
                <div className="absolute bottom-20 left-20 w-48 h-48 bg-yellow-50 rounded-full opacity-40"></div>

                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left - Content */}
                        <div>
                            <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold mb-4">
                                CHÚNG TÔI TẠO Ý TƯỞNG
                            </span>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                                CHÚNG TÔI CÓ THỂ GIÚP
                                <br />
                                <span className="text-yellow-600">DOANH NGHIỆP</span> CỦA BẠN
                            </h2>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                Từ ý tưởng đến triển khai, chúng tôi đồng hành cùng bạn trong mọi bước của hành trình tự động hóa.
                                Với công nghệ tiên tiến và đội ngũ chuyên gia, chúng tôi biến mọi quy trình phức tạp thành đơn giản.
                            </p>

                            <button className="group px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-slate-900 rounded-xl font-bold hover:shadow-xl hover:shadow-yellow-500/50 transition-all inline-flex items-center gap-2">
                                TÌM HIỂU THÊM
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                        </div>

                        {/* Right - Isometric Illustration */}
                        <div className="relative">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-6">
                                    <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-yellow-200 transform hover:scale-105 transition-transform">
                                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center mb-4">
                                            <span className="text-3xl">💻</span>
                                        </div>
                                        <h4 className="font-bold text-slate-900 mb-2">Web Development</h4>
                                        <p className="text-sm text-slate-600">Xây dựng website hiện đại</p>
                                    </div>
                                    <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-yellow-200 transform hover:scale-105 transition-transform">
                                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center mb-4">
                                            <span className="text-3xl">📱</span>
                                        </div>
                                        <h4 className="font-bold text-slate-900 mb-2">Mobile Apps</h4>
                                        <p className="text-sm text-slate-600">Ứng dụng di động</p>
                                    </div>
                                </div>
                                <div className="space-y-6 mt-12">
                                    <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-yellow-200 transform hover:scale-105 transition-transform">
                                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center mb-4">
                                            <span className="text-3xl">🔄</span>
                                        </div>
                                        <h4 className="font-bold text-slate-900 mb-2">Automation</h4>
                                        <p className="text-sm text-slate-600">Tự động hóa quy trình</p>
                                    </div>
                                    <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-yellow-200 transform hover:scale-105 transition-transform">
                                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center mb-4">
                                            <span className="text-3xl">📊</span>
                                        </div>
                                        <h4 className="font-bold text-slate-900 mb-2">Analytics</h4>
                                        <p className="text-sm text-slate-600">Phân tích dữ liệu</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NewSections;
