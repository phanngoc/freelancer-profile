# Cover Letter Generator API

API FastAPI cho phép tạo cover letter dựa trên mô tả công việc bằng cách sử dụng OpenAI.

## Cài đặt

1. Tạo môi trường ảo Python:
```bash
python -m venv venv
```

2. Kích hoạt môi trường ảo:
- Windows:
```bash
venv\Scripts\activate
```
- MacOS/Linux:
```bash
source venv/bin/activate
```

3. Cài đặt các thư viện:
```bash
pip install fastapi uvicorn openai python-dotenv pydantic
```

## Cấu hình API OpenAI

1. Tạo file `.env` trong thư mục backend:
```
OPENAI_API_KEY=your_openai_api_key_here
```
2. Thay thế `your_openai_api_key_here` bằng API key của bạn từ OpenAI.

## Chạy Server

```bash
uvicorn main:app --reload
```

Server sẽ chạy tại địa chỉ: `http://localhost:8000`

## API Endpoints

- `GET /`: Kiểm tra kết nối
- `POST /generate-cover-letter`: Tạo cover letter từ mô tả công việc

### Yêu cầu POST /generate-cover-letter

```json
{
  "job_description": "Mô tả công việc của bạn ở đây",
  "freelancer_skills": "Các kỹ năng của bạn (tùy chọn)",
  "experience_level": "Mức kinh nghiệm của bạn (tùy chọn)",
  "tone": "Giọng điệu (mặc định: Professional)",
  "additional_info": "Thông tin bổ sung (tùy chọn)"
}
```

### Phản hồi

```json
{
  "cover_letter": "Cover letter được tạo..."
}
```

## Tài liệu API

Sau khi chạy server, bạn có thể truy cập tài liệu API tại:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc` 