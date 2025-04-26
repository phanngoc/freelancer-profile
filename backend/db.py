from typing import Dict, Any, List, Optional
from sqlmodel import Session, select
from models import (
    Skills, SkillsCreate, 
    Experience, ExperienceCreate,
    CoverLetter, CoverLetterCreate,
    engine
)

def init_db():
    """Khởi tạo database và các bảng cần thiết"""
    from models import create_db_and_tables
    create_db_and_tables()

def save_skills(tech_skills: str, soft_skills: str) -> int:
    """Lưu thông tin kỹ năng vào database"""
    with Session(engine) as session:
        skills = Skills(tech_skills=tech_skills, soft_skills=soft_skills)
        session.add(skills)
        session.commit()
        session.refresh(skills)
        return skills.id

def get_skills() -> Optional[Dict[str, Any]]:
    """Lấy thông tin kỹ năng mới nhất từ database"""
    with Session(engine) as session:
        statement = select(Skills).order_by(Skills.id.desc()).limit(1)
        result = session.exec(statement).first()
        
        if result:
            return {
                "id": result.id,
                "tech_skills": result.tech_skills,
                "soft_skills": result.soft_skills,
                "created_at": result.created_at,
                "updated_at": result.updated_at
            }
        return None

def save_experience(work_experience: str, projects: str) -> int:
    """Lưu thông tin kinh nghiệm vào database"""
    with Session(engine) as session:
        experience = Experience(work_experience=work_experience, projects=projects)
        session.add(experience)
        session.commit()
        session.refresh(experience)
        return experience.id

def get_experience() -> Optional[Dict[str, Any]]:
    """Lấy thông tin kinh nghiệm mới nhất từ database"""
    with Session(engine) as session:
        statement = select(Experience).order_by(Experience.id.desc()).limit(1)
        result = session.exec(statement).first()
        
        if result:
            return {
                "id": result.id,
                "work_experience": result.work_experience,
                "projects": result.projects,
                "created_at": result.created_at,
                "updated_at": result.updated_at
            }
        return None

def save_cover_letter(job_description: str, cover_letter: str) -> int:
    """Lưu cover letter vào database"""
    with Session(engine) as session:
        letter = CoverLetter(job_description=job_description, cover_letter=cover_letter)
        session.add(letter)
        session.commit()
        session.refresh(letter)
        return letter.id

def get_cover_letters() -> List[Dict[str, Any]]:
    """Lấy danh sách cover letter từ database"""
    with Session(engine) as session:
        statement = select(CoverLetter).order_by(CoverLetter.id.desc())
        results = session.exec(statement).all()
        
        return [
            {
                "id": letter.id,
                "job_description": letter.job_description,
                "cover_letter": letter.cover_letter,
                "created_at": letter.created_at
            }
            for letter in results
        ] 