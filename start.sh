#!/bin/bash

# Màu sắc cho output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Bắt đầu chạy ứng dụng...${NC}"

# Kiểm tra và cài đặt dependencies nếu cần
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📦 Cài đặt dependencies...${NC}"
    npm install
fi

# Chạy frontend
echo -e "${GREEN}🌐 Khởi động frontend...${NC}"
npm run dev &

# Kiểm tra xem có thư mục backend không
if [ -d "backend" ]; then
    echo -e "${GREEN}⚙️ Khởi động backend...${NC}"
    cd backend
    uvicorn main:app --reload &
    cd ..
fi

# Đợi cho đến khi người dùng nhấn Ctrl+C
echo -e "${BLUE}✨ Ứng dụng đang chạy. Nhấn Ctrl+C để dừng.${NC}"
wait
