# Cover Letter Generator cho Freelancer

Ứng dụng này giúp freelancer dễ dàng tạo cover letter chuyên nghiệp dựa trên mô tả công việc, sử dụng công nghệ OpenAI để tạo nội dung thu hút người thuê.

## Công nghệ sử dụng

- **Frontend**: Next.js 14, TailwindCSS
- **Backend**: Python FastAPI 
- **AI**: OpenAI API

## Cài đặt và Chạy dự án

### Backend (Python FastAPI)

1. Di chuyển vào thư mục backend:
```bash
cd backend
```

2. Cài đặt môi trường ảo Python:
```bash
python -m venv venv
```

3. Kích hoạt môi trường ảo:
- Windows:
```bash
venv\Scripts\activate
```
- MacOS/Linux:
```bash
source venv/bin/activate
```

4. Cài đặt các thư viện cần thiết:
```bash
pip install fastapi uvicorn openai python-dotenv pydantic
```

5. Tạo file `.env` trong thư mục backend và thêm API key của OpenAI:
```
OPENAI_API_KEY=your_openai_api_key_here
```

6. Chạy server FastAPI:
```bash
uvicorn main:app --reload
```

Backend sẽ chạy tại địa chỉ: `http://localhost:8000`

### Frontend (Next.js)

1. Cài đặt các thư viện của Next.js:
```bash
npm install
```

2. Chạy ứng dụng Next.js:
```bash
npm run dev
```

Frontend sẽ chạy tại địa chỉ: `http://localhost:3000`

## Cách sử dụng

1. Truy cập vào ứng dụng tại `http://localhost:3000`
2. Nhập mô tả công việc từ nền tảng freelance hoặc từ khách hàng
3. Thêm các thông tin bổ sung như kỹ năng, kinh nghiệm (tùy chọn)
4. Chọn giọng điệu phù hợp
5. Nhấn "Tạo Cover Letter"
6. Sao chép cover letter được tạo để gửi cho khách hàng tiềm năng

## Tính năng

- Tạo cover letter tùy chỉnh dựa trên mô tả công việc
- Hỗ trợ nhiều giọng điệu khác nhau (Chuyên nghiệp, Thân thiện, Nhiệt tình, v.v.)
- Giao diện người dùng thân thiện, đẹp mắt với Tailwind CSS
- Phản hồi nhanh chóng từ API OpenAI
- Dễ dàng sao chép nội dung
