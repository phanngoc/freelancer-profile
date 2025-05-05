from typing import Optional, List, Union, Any
from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship, create_engine, Session
import json
from pydantic import EmailStr


class SkillsBase(SQLModel):
    tech_skills: str = ""
    soft_skills: str = ""


class Skills(SkillsBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)


class SkillsCreate(SkillsBase):
    pass


class SkillsRead(SkillsBase):
    id: int
    created_at: datetime
    updated_at: datetime


class ExperienceBase(SQLModel):
    work_experience: str = ""
    # In the database, projects is always stored as a string (JSON)
    projects: str = ""


# Special model for experience read operations - can handle both string and list formats
class ExperienceRead(SQLModel):
    id: int
    work_experience: str = ""
    projects: Union[str, List[str]] = ""
    created_at: datetime
    updated_at: datetime


class Experience(ExperienceBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)


class ExperienceCreate(ExperienceBase):
    pass


class CoverLetterBase(SQLModel):
    job_description: str
    cover_letter: str


class CoverLetter(CoverLetterBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.now)


class CoverLetterCreate(CoverLetterBase):
    pass


class CoverLetterRead(CoverLetterBase):
    id: int
    created_at: datetime


class UserBase(SQLModel):
    email: EmailStr
    username: str
    hashed_password: str
    is_active: bool = True
    is_superuser: bool = False


class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)


class UserCreate(SQLModel):
    email: EmailStr
    username: str
    password: str


class UserRead(SQLModel):
    id: int
    email: EmailStr
    username: str
    is_active: bool
    created_at: datetime
    updated_at: datetime


# Thiết lập kết nối database
DATABASE_URL = "sqlite:///data/freelancer.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session