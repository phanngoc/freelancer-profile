import os
import tempfile
from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from typing import Optional, List
import db
import PyPDF2
import re
from openai import OpenAI
from sqlmodel import Session, select
from models import (
    Skills, SkillsCreate, SkillsRead,
    Experience, ExperienceCreate, ExperienceRead,
    CoverLetter, CoverLetterCreate, CoverLetterRead,
    get_session
)

# Tải biến môi trường từ file .env
load_dotenv()

# Lấy API key từ biến môi trường
openai_api_key = os.getenv("OPENAI_API_KEY")
print('openai_api_key', openai_api_key)# Đặt giá trị mặc định để phát triển

client = OpenAI(api_key=openai_api_key)

# Khởi tạo database
db.init_db()

app = FastAPI(title="Freelancer Profile API")

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
    return {"message": "Welcome to Freelancer Profile API"}

@app.post("/init-sample-data")
async def init_sample_data(session: Session = Depends(get_session)):
    """Tạo dữ liệu mẫu ban đầu cho ứng dụng"""
    try:
        # Tạo kỹ năng mẫu
        sample_skills = Skills(
            tech_skills="Python, JavaScript, FastAPI, React, Docker",
            soft_skills="Giao tiếp, Làm việc nhóm, Giải quyết vấn đề"
        )
        session.add(sample_skills)
        
        # Tạo kinh nghiệm mẫu
        sample_experience = Experience(
            work_experience="5 năm kinh nghiệm phát triển web",
            projects="Đã hoàn thành 10+ dự án web full-stack"
        )
        session.add(sample_experience)
        
        # Tạo cover letter mẫu
        sample_cover_letter = CoverLetter(
            job_description="Tuyển dụng lập trình viên full-stack",
            cover_letter="Đây là một cover letter mẫu cho vị trí lập trình viên."
        )
        session.add(sample_cover_letter)
        
        session.commit()
        
        return {"message": "Đã tạo dữ liệu mẫu thành công"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi tạo dữ liệu mẫu: {str(e)}")

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
        
        # Lưu vào database
        db.save_cover_letter(request.job_description, cover_letter)
        
        return CoverLetterResponse(cover_letter=cover_letter)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi tạo cover letter: {str(e)}")

@app.post("/skills", response_model=SkillsRead)
async def save_skills(skills: SkillsCreate, session: Session = Depends(get_session)):
    try:
        db_skills = Skills.model_validate(skills)
        session.add(db_skills)
        session.commit()
        session.refresh(db_skills)
        return db_skills
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi lưu kỹ năng: {str(e)}")

@app.get("/skills", response_model=SkillsRead)
async def get_skills(session: Session = Depends(get_session)):
    try:
        statement = select(Skills).order_by(Skills.id.desc()).limit(1)
        skills = session.exec(statement).first()
        if not skills:
            # Trả về 404 nếu không tìm thấy kết quả
            raise HTTPException(status_code=404, detail="Không tìm thấy thông tin kỹ năng")
        return skills
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi lấy thông tin kỹ năng: {str(e)}")

@app.post("/experience", response_model=ExperienceRead)
async def save_experience(experience: ExperienceCreate, session: Session = Depends(get_session)):
    try:
        db_experience = Experience.model_validate(experience)
        session.add(db_experience)
        session.commit()
        session.refresh(db_experience)
        return db_experience
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi lưu kinh nghiệm: {str(e)}")

@app.get("/experience", response_model=ExperienceRead)
async def get_experience(session: Session = Depends(get_session)):
    try:
        statement = select(Experience).order_by(Experience.id.desc()).limit(1)
        experience = session.exec(statement).first()
        if not experience:
            # Trả về 404 nếu không tìm thấy kết quả
            raise HTTPException(status_code=404, detail="Không tìm thấy thông tin kinh nghiệm")
        return experience
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi lấy thông tin kinh nghiệm: {str(e)}")

@app.get("/cover-letters", response_model=List[CoverLetterRead])
async def get_cover_letters(
    session: Session = Depends(get_session),
    offset: int = 0,
    limit: int = 100
):
    try:
        statement = select(CoverLetter).order_by(CoverLetter.id.desc()).offset(offset).limit(limit)
        return session.exec(statement).all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi lấy danh sách cover letter: {str(e)}")

@app.post("/upload-cv")
async def upload_cv(cv_file: UploadFile = File(...), session: Session = Depends(get_session)):
    try:
        # Kiểm tra định dạng file
        if not cv_file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Chỉ chấp nhận file PDF")
        
        # Lưu file tạm thời
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            temp_file.write(await cv_file.read())
            temp_file_path = temp_file.name
        
        # Đọc nội dung file PDF
        try:
            pdf_reader = PyPDF2.PdfReader(temp_file_path)
            text_content = ""
            for page in pdf_reader.pages:
                text_content += page.extract_text()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Lỗi khi đọc file PDF: {str(e)}")
        finally:
            # Xóa file tạm
            os.unlink(temp_file_path)
        
        # Trích xuất thông tin từ CV
        extracted_info = extract_info_from_cv(text_content, session)
        
        return extracted_info
    
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Lỗi khi xử lý CV: {str(e)}")

def extract_info_from_cv(text_content: str, session: Session):
    """
    Trích xuất thông tin từ nội dung CV
    """
    # Sử dụng OpenAI để phân tích CV
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "Bạn là một trợ lý phân tích CV chuyên nghiệp. Hãy trích xuất thông tin quan trọng từ CV."},
                {"role": "user", "content": f"""
                Phân tích CV sau và trích xuất thông tin theo định dạng JSON với các trường:
                1. tech_skills: Danh sách kỹ năng kỹ thuật
                2. soft_skills: Danh sách kỹ năng mềm
                3. work_experience: Chi tiết về kinh nghiệm làm việc
                4. projects: Thông tin về các dự án đã thực hiện
                5. education: Thông tin về học vấn
                
                Nội dung CV:
                {text_content}
                """}
            ],
            temperature=0.3,
            max_tokens=1000,
            response_format={"type": "json_object"}
        )
        
        # Phân tích kết quả
        result = response.choices[0].message.content.strip()
        
        # Lưu kỹ năng và kinh nghiệm vào database
        extracted_data = eval(result)
        
        # Tạo và lưu Skills
        db_skills = Skills(
            tech_skills=extracted_data.get("tech_skills", ""),
            soft_skills=extracted_data.get("soft_skills", "")
        )
        session.add(db_skills)
        
        # Tạo và lưu Experience
        db_experience = Experience(
            work_experience=extracted_data.get("work_experience", ""),
            projects=extracted_data.get("projects", "")
        )
        session.add(db_experience)
        
        session.commit()
        session.refresh(db_skills)
        session.refresh(db_experience)
        
        return extracted_data
    
    except Exception as e:
        # Nếu không thể sử dụng OpenAI, thử phương pháp regex đơn giản
        skills = re.findall(r'Skills:(.+?)(?:\n\n|\Z)', text_content, re.DOTALL)
        experience = re.findall(r'Experience:(.+?)(?:\n\n|\Z)', text_content, re.DOTALL)
        education = re.findall(r'Education:(.+?)(?:\n\n|\Z)', text_content, re.DOTALL)
        
        tech_skills = ", ".join(skills).strip() if skills else ""
        work_experience = ", ".join(experience).strip() if experience else ""
        
        # Tạo và lưu Skills
        db_skills = Skills(tech_skills=tech_skills, soft_skills="")
        session.add(db_skills)
        
        # Tạo và lưu Experience
        db_experience = Experience(work_experience=work_experience, projects="")
        session.add(db_experience)
        
        session.commit()
        
        extracted_data = {
            "tech_skills": tech_skills,
            "soft_skills": "",
            "work_experience": work_experience,
            "projects": "",
            "education": ", ".join(education).strip() if education else ""
        }
        
        return extracted_data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 