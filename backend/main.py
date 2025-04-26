import os
import tempfile
from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from typing import Optional, List, Generic, TypeVar, Dict, Any
import db
import PyPDF2
import re
import json
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
    allow_origins=["*"],  # Trong experiencemôi trường sản xuất, hãy giới hạn điều này
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Generic type for API responses
T = TypeVar('T')

class ResponseModel(BaseModel, Generic[T]):
    """Standard response model for all API endpoints"""
    success: bool
    message: str
    data: Optional[T] = None
    metadata: Optional[Dict[str, Any]] = None

class PaginatedResponseModel(ResponseModel[T]):
    """Response model with pagination information"""
    total: int
    offset: int
    limit: int

class CoverLetterRequest(BaseModel):
    job_description: str
    freelancer_skills: Optional[str] = None
    experience_level: Optional[str] = None
    tone: Optional[str] = "Professional"
    additional_info: Optional[str] = None

class CoverLetterResponse(BaseModel):
    cover_letter: str

@app.get("/api")
def read_root():
    return ResponseModel(
        success=True,
        message="Welcome to Freelancer Profile API",
        data=None
    )

@app.post("/api/init-sample-data", status_code=status.HTTP_201_CREATED)
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
        
        return ResponseModel(
            success=True,
            message="Đã tạo dữ liệu mẫu thành công",
            data=None
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Lỗi khi tạo dữ liệu mẫu: {str(e)}"
        )

@app.post("/api/generate-cover-letter", status_code=status.HTTP_201_CREATED)
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
        saved_letter = db.save_cover_letter(request.job_description, cover_letter)
        
        return ResponseModel(
            success=True,
            message="Tạo cover letter thành công",
            data=CoverLetterResponse(cover_letter=cover_letter)
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi tạo cover letter: {str(e)}"
        )

@app.post("/api/skills", status_code=status.HTTP_201_CREATED, response_model=ResponseModel[SkillsRead])
async def save_skills(skills: SkillsCreate, session: Session = Depends(get_session)):
    try:
        db_skills = Skills.model_validate(skills)
        session.add(db_skills)
        session.commit()
        session.refresh(db_skills)
        return ResponseModel(
            success=True,
            message="Lưu kỹ năng thành công",
            data=db_skills
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi lưu kỹ năng: {str(e)}"
        )

@app.get("/api/skills", response_model=ResponseModel[SkillsRead])
async def get_skills(session: Session = Depends(get_session)):
    try:
        statement = select(Skills).order_by(Skills.id.desc()).limit(1)
        skills = session.exec(statement).first()
        if not skills:
            # Trả về 404 nếu không tìm thấy kết quả
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy thông tin kỹ năng"
            )
        return ResponseModel(
            success=True,
            message="Lấy thông tin kỹ năng thành công",
            data=skills
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi lấy thông tin kỹ năng: {str(e)}"
        )

@app.post("/api/experience", status_code=status.HTTP_201_CREATED, response_model=ResponseModel[ExperienceRead])
async def save_experience(experience: ExperienceCreate, session: Session = Depends(get_session)):
    try:
        db_experience = Experience.model_validate(experience)
        session.add(db_experience)
        session.commit()
        session.refresh(db_experience)
        return ResponseModel(
            success=True,
            message="Lưu kinh nghiệm thành công",
            data=db_experience
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi lưu kinh nghiệm: {str(e)}"
        )

@app.get("/api/experience", response_model=ResponseModel[ExperienceRead])
async def get_experience(session: Session = Depends(get_session)):
    try:
        statement = select(Experience).order_by(Experience.id.desc()).limit(1)
        experience = session.exec(statement).first()
        if not experience:
            # Trả về 404 nếu không tìm thấy kết quả
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy thông tin kinh nghiệm"
            )
        
        # If projects is stored as a JSON string, convert it back to a Python object
        if experience.projects and experience.projects.startswith('['):
            try:
                # Create a copy of the experience object to avoid modifying the SQLModel directly
                experience_dict = experience.model_dump()
                experience_dict['projects'] = json.loads(experience.projects)
                return ResponseModel(
                    success=True,
                    message="Lấy thông tin kinh nghiệm thành công",
                    data=experience_dict
                )
            except json.JSONDecodeError:
                # If JSON parsing fails, return the raw string
                pass
        
        return ResponseModel(
            success=True,
            message="Lấy thông tin kinh nghiệm thành công",
            data=experience
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi lấy thông tin kinh nghiệm: {str(e)}"
        )

@app.get("/api/cover-letters", response_model=PaginatedResponseModel[List[CoverLetterRead]])
async def get_cover_letters(
    session: Session = Depends(get_session),
    offset: int = 0,
    limit: int = 100
):
    try:
        # Lấy tổng số bản ghi
        total_count = session.exec(select(CoverLetter)).all()
        total = len(total_count)
        
        # Truy vấn với phân trang
        statement = select(CoverLetter).order_by(CoverLetter.id.desc()).offset(offset).limit(limit)
        results = session.exec(statement).all()
        
        return PaginatedResponseModel(
            success=True,
            message=f"Lấy danh sách cover letter thành công",
            data=results,
            total=total,
            offset=offset,
            limit=limit,
            metadata={"page": offset // limit + 1}
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi lấy danh sách cover letter: {str(e)}"
        )

@app.post("/api/upload-cv", status_code=status.HTTP_201_CREATED)
async def upload_cv(
    cv_file: Optional[UploadFile] = File(None),
    session: Session = Depends(get_session)
):
    try:
        # Check if any file was provided
        if cv_file is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No file uploaded. Please provide a PDF file."
            )
            
        # Kiểm tra định dạng file
        print('filename:', cv_file.filename)
        if not cv_file.filename.endswith('.pdf'):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Chỉ chấp nhận file PDF"
            )
        
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
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Lỗi khi đọc file PDF: {str(e)}"
            )
        finally:
            # Xóa file tạm
            os.unlink(temp_file_path)
        
        # Trích xuất thông tin từ CV
        extracted_info = extract_info_from_cv(text_content, session)
        
        return ResponseModel(
            success=True,
            message="Trích xuất thông tin từ CV thành công",
            data=extracted_info
        )
    
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi xử lý CV: {str(e)}"
        )

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
        
        # Parse JSON result
        extracted_data = json.loads(result)
        
        # Convert any list data to JSON strings before saving to database
        projects_data = extracted_data.get("projects", "")
        if isinstance(projects_data, list):
            projects_data = json.dumps(projects_data)
        
        # Tạo và lưu Skills
        db_skills = Skills(
            tech_skills=json.dumps(extracted_data.get("tech_skills", "")),
            soft_skills=json.dumps(extracted_data.get("soft_skills", ""))
        )
        session.add(db_skills)
        
        # Tạo và lưu Experience
        db_experience = Experience(
            work_experience=json.dumps(extracted_data.get("work_experience", "")) if isinstance(extracted_data.get("work_experience", ""), (list, dict)) else extracted_data.get("work_experience", ""),
            projects=projects_data  # This is already JSON encoded if it was a list
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