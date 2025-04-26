import os
import openai
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from typing import Optional

# Tải biến môi trường từ file .env
load_dotenv()

# Lấy API key từ biến môi trường
openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    openai_api_key = "your_openai_api_key"  # Đặt giá trị mặc định để phát triển

# Khởi tạo client OpenAI
client = openai.OpenAI(api_key=openai_api_key)

app = FastAPI(title="Cover Letter Generator API")

# Cấu hình CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Trong môi trường sản xuất, hãy giới hạn điều này
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CoverLetterRequest(BaseModel):
    job_description: str
    freelancer_skills: Optional[str] = None
    experience_level: Optional[str] = None
    tone: Optional[str] = "Professional"
    additional_info: Optional[str] = None

class CoverLetterResponse(BaseModel):
    cover_letter: str

@app.get("/")
def read_root():
    return {"message": "Welcome to Cover Letter Generator API"}

@app.post("/generate-cover-letter", response_model=CoverLetterResponse)
async def generate_cover_letter(request: CoverLetterRequest):
    try:
        # Tạo prompt cho OpenAI
        prompt = f"""
        Viết một cover letter chuyên nghiệp dựa trên mô tả công việc sau:
        
        MÔ TẢ CÔNG VIỆC:
        {request.job_description}
        
        """

        if request.freelancer_skills:
            prompt += f"""
            KỸ NĂNG CỦA FREELANCER:
            {request.freelancer_skills}
            """

        if request.experience_level:
            prompt += f"""
            MỨC KINH NGHIỆM:
            {request.experience_level}
            """

        if request.additional_info:
            prompt += f"""
            THÔNG TIN BỔ SUNG:
            {request.additional_info}
            """

        prompt += f"""
        Giọng điệu: {request.tone}
        
        Hãy viết một cover letter chuyên nghiệp, ngắn gọn và thu hút người đọc. 
        Cover letter nên kết nối kỹ năng của freelancer với yêu cầu công việc, 
        thể hiện sự hiểu biết về dự án và chứng minh freelancer là người phù hợp nhất.
        Hãy tránh những câu từ chung chung, thay vào đó hãy cụ thể và đi thẳng vào vấn đề.
        """

        # Gọi API OpenAI
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "Bạn là một trợ lý viết cover letter chuyên nghiệp, giúp freelancers tạo cover letter hấp dẫn."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1000
        )

        # Trích xuất cover letter từ phản hồi
        cover_letter = response.choices[0].message.content.strip()
        
        return CoverLetterResponse(cover_letter=cover_letter)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi tạo cover letter: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 