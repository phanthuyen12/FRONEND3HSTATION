export interface DisclaimerSection {
  id: string;
  title: string;
  summary: string;
  points: string[];
}

export interface DisclaimerContent {
  title: string;
  subtitle: string;
  sections: DisclaimerSection[];
  highlights: string[];
}

export const disclaimerSections: DisclaimerSection[] = [
  {
    id: 'khao-sat-mmo',
    title: 'Rủi ro MMO & Đầu tư',
    summary: 'Thông tin học tập và phương pháp chia sẻ chỉ mang tính chất tham khảo, không cam kết lợi nhuận.',
    points: [
      'Mọi kiến thức về Make Money Online (MMO), đầu tư hoặc tối ưu quy trình được chia sẻ trên hệ thống đều mang tính chất chia sẻ kinh nghiệm thực tế.',
      'Chúng tôi hoàn toàn không đưa ra lời khuyên tài chính, lời khuyên đầu tư hay cam kết chắc chắn về bất kỳ mức doanh thu, lợi nhuận cụ thể nào.',
      'Kết quả đạt được phụ thuộc hoàn toàn vào nỗ lực, kỹ năng, kinh nghiệm cá nhân và sự biến động không ngừng của thị trường.'
    ]
  },
  {
    id: 'van-hanh-vps-tool',
    title: 'Vận hành VPS & Tool',
    summary: 'Người dùng tự chịu trách nhiệm về nội dung và hành vi thiết lập trên VPS cũng như phần mềm.',
    points: [
      'Hệ thống cung cấp hạ tầng VPS và công cụ (tool) automation phục vụ cho công việc, học viên/người dùng tự chịu trách nhiệm pháp lý đối với nội dung chạy trên máy chủ đó.',
      'Chúng tôi không chịu trách nhiệm trong trường hợp mất mát dữ liệu do cấu hình sai, bị tấn công mạng từ phía người dùng, hoặc các trường hợp bất khả kháng.',
      'Người dùng cần chủ động thực hiện sao lưu (backup) dữ liệu định kỳ để tránh các rủi ro hư hỏng dữ liệu không mong muốn.'
    ]
  },
  {
    id: 'tai-khoan-ben-thu-ba',
    title: 'Quy tắc bên thứ ba',
    summary: 'Rủi ro liên quan đến chính sách quét hoặc chặn tài khoản của các nền tảng mạng xã hội lớn.',
    points: [
      'Việc sử dụng các công cụ tự động hóa hoặc cào dữ liệu trên các nền tảng (Facebook, TikTok, Google, Instagram...) có thể vi phạm điều khoản của họ.',
      'Người dùng tự nhận thức và chịu trách nhiệm trước rủi ro tài khoản mạng xã hội hoặc tài nguyên quảng cáo bị khóa, hạn chế hoặc vô hiệu hóa.',
      'AETRADING không bảo hành, không đền bù cho các thiệt hại gián tiếp phát sinh từ các chiến dịch MMO bị gián đoạn do chính sách quét của bên thứ ba.'
    ]
  },
  {
    id: 'noi-dung-ban-quyen',
    title: 'Nội dung & Bản quyền',
    summary: 'Quyền điều chỉnh dịch vụ và bảo vệ tài nguyên trí tuệ của hệ sinh thái AETRADING.',
    points: [
      'Chúng tôi bảo lưu quyền cập nhật, chỉnh sửa, thay thế hoặc ngừng cung cấp một phần nội dung khóa học, tính năng phần mềm để phù hợp với thực tế.',
      'Học viên cam kết không sử dụng tài nguyên số (video, tài liệu, mã nguồn, workflow...) vào mục đích thương mại hóa trái phép hoặc chia sẻ công cộng.',
      'Mọi tranh chấp phát sinh sẽ được ưu tiên giải quyết qua thương lượng thiện chí giữa hai bên nhằm đảm bảo quyền lợi tốt nhất.'
    ]
  }
];

export const disclaimerHighlights = [
  'Nội dung chia sẻ mang tính chất giáo dục và tham khảo, người dùng tự chịu trách nhiệm khi áp dụng thực tế.',
  'Chúng tôi không chịu trách nhiệm cho bất kỳ tổn thất tài chính hay gián đoạn công việc nào của người dùng.',
  'Điều khoản miễn trừ trách nhiệm này có hiệu lực ngay khi người dùng sử dụng bất kỳ dịch vụ nào trên hệ thống.'
];

export const defaultDisclaimerContent: DisclaimerContent = {
  title: 'Miễn trừ trách nhiệm',
  subtitle: 'Vui lòng đọc kỹ các điều khoản miễn trừ trách nhiệm dưới đây để hiểu rõ phạm vi dịch vụ, rủi ro và trách nhiệm pháp lý khi tham gia hệ sinh thái AETRADING.',
  sections: disclaimerSections,
  highlights: disclaimerHighlights
};
