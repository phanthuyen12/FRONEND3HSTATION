# ==========================================
# GIAI ĐOẠN 1: BUILD REACT/VITE APP
# ==========================================
FROM node:18-alpine AS builder

# Đặt thư mục làm việc trong container
WORKDIR /app

# Copy các file quản lý package để install dependencies trước
# (Tận dụng cache của Docker giúp build nhanh hơn ở các lần sau)
COPY package.json package-lock.json* ./
RUN npm install

# Copy toàn bộ source code vào container
COPY . .

# Chạy lệnh build ra thư mục /dist
RUN npm run build

# ==========================================
# GIAI ĐOẠN 2: CHẠY NGINX SERVER
# ==========================================
FROM nginx:alpine

# Copy file cấu hình nginx (xử lý lỗi 404 cho React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy toàn bộ file tĩnh đã build từ giai đoạn 1 sang thư mục phục vụ của Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 cho Nginx
EXPOSE 80

# Chạy Nginx
CMD ["nginx", "-g", "daemon off;"]
