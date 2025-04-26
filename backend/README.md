# Backend API cho Freelancer Profile

Backend API được xây dựng bằng FastAPI để hỗ trợ tạo và quản lý hồ sơ freelancer, bao gồm:
- Tạo cover letter từ mô tả công việc
- Quản lý kỹ năng và kinh nghiệm
- Trích xuất thông tin từ CV dạng PDF

## Cài đặt

1. Tạo môi trường ảo Python:

```bash
python -m venv venv
```

2. Kích hoạt môi trường ảo:

- Trên Windows:
```bash
venv\Scripts\activate
```

- Trên macOS/Linux:
```bash
source venv/bin/activate
```

3. Cài đặt các thư viện:

```bash
pip install -r requirements.txt
```

4. Tạo file `.env` với nội dung (thay thế bằng API key của bạn):

```
OPENAI_API_KEY=your_openai_api_key
```

## Chạy ứng dụng

```bash
uvicorn main:app --reload
```

Server sẽ khởi chạy tại `http://localhost:8000`.

## API Endpoints

### Tạo Cover Letter
- **URL:** `/generate-cover-letter`
- **Method:** POST
- **Body:** JSON
  ```json
  {
    "job_description": "Mô tả công việc...",
    "freelancer_skills": "Kỹ năng của freelancer...",
    "experience_level": "Senior",
    "tone": "Professional",
    "additional_info": "Thông tin bổ sung..."
  }
  ```

### Quản lý kỹ năng
- **URL:** `/skills`
- **Method:** GET - Lấy kỹ năng hiện tại
- **Method:** POST - Cập nhật kỹ năng mới
  ```json
  {
    "tech_skills": "JavaScript, React, Node.js...",
    "soft_skills": "Giao tiếp, Quản lý thời gian..."
  }
  ```

### Quản lý kinh nghiệm
- **URL:** `/experience`
- **Method:** GET - Lấy kinh nghiệm hiện tại
- **Method:** POST - Cập nhật kinh nghiệm mới
  ```json
  {
    "work_experience": "Chi tiết kinh nghiệm làm việc...",
    "projects": "Chi tiết các dự án..."
  }
  ```

### Upload và trích xuất CV
- **URL:** `/upload-cv`
- **Method:** POST
- **Body:** Form-data với trường `cv_file` là file PDF 