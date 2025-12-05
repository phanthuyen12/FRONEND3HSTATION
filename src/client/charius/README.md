# Charius React Integration

Thư mục này chứa các components và assets từ project **charius-react** đã được tích hợp vào project hiện tại.

## Cấu trúc

```
src/client/charius/
├── components/          # Components từ charius-react (JS)
├── pages/              # Pages từ charius-react (JS) 
├── assets/             # Assets từ charius-react
│   ├── images/         # Hình ảnh
│   ├── fonts/          # Fonts (flaticon, fontawesome, themify)
│   ├── css/            # CSS files (font-awesome, themify-icons, animate, flaticon)
│   └── sass/           # SASS files (style.scss và các partials)
├── ChariusWrapper.tsx  # Wrapper component để scope CSS
├── charius-styles.scss # Styles scoped cho charius
├── routes.tsx          # Routes cho các trang charius
└── README.md           # File này
```

## Cách sử dụng

### 1. Import và sử dụng components

Tất cả các components từ charius-react đã được copy vào `components/`. Để sử dụng:

```tsx
import ChariusWrapper from "../charius/ChariusWrapper";
import Navbar from "../charius/components/Navbar/Navbar";

const MyPage = () => {
  return (
    <ChariusWrapper>
      <Navbar Logo={logo} hclass="wpo-site-header-s1" />
      {/* Các components khác */}
    </ChariusWrapper>
  );
};
```

### 2. CSS Scoping

CSS của charius-react được scope trong class `.charius-wrapper` để không ảnh hưởng đến CSS của project hiện tại.

**Quan trọng:** Luôn wrap các components charius trong `ChariusWrapper`:

```tsx
<ChariusWrapper>
  {/* Các components charius ở đây */}
</ChariusWrapper>
```

### 3. Routes

Các routes của charius được định nghĩa trong `routes.tsx` với prefix `/charius/`:

- `/charius` hoặc `/charius/home` - HomePage

Bạn có thể thêm các routes khác từ charius-react vào `routes.tsx`.

### 4. Convert sang TypeScript (tùy chọn)

Các components hiện tại là JavaScript. Nếu muốn convert sang TypeScript:

1. Đổi extension từ `.js` sang `.tsx`
2. Thêm type definitions
3. Fix các import paths nếu cần

### 5. Dependencies

Charius-react sử dụng các dependencies sau (đã có trong project hiện tại hoặc cần cài thêm):

- `react-router-dom` ✅
- `react-redux` ✅
- `react-scroll-parallax` (có thể cần cài)
- `react-slick` (có thể cần cài)
- `react-toastify` ✅
- `sass` ✅
- Và các dependencies khác...

## Lưu ý

1. **CSS Isolation**: CSS của charius được scope trong `.charius-wrapper` để không conflict với CSS hiện tại.

2. **Import Paths**: Khi sử dụng các components, đảm bảo import paths đúng. Các assets (images, fonts) nên được import từ `assets/`.

3. **Dependencies**: Một số dependencies của charius-react có thể chưa có trong project. Cần cài đặt nếu gặp lỗi.

4. **TypeScript**: Các components hiện tại là JS. Nếu muốn type safety, cần convert sang TS.

## Ví dụ sử dụng

Xem file `pages/ChariusHomePage.tsx` để xem ví dụ cách tích hợp.

## Troubleshooting

### CSS không áp dụng
- Đảm bảo đã wrap component trong `ChariusWrapper`
- Kiểm tra import path của CSS files

### Components không render
- Kiểm tra import paths
- Đảm bảo các dependencies đã được cài đặt
- Kiểm tra console để xem lỗi cụ thể

### Assets không load
- Kiểm tra path của images/fonts
- Đảm bảo assets đã được copy vào `assets/`














