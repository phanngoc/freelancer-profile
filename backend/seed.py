from sqlmodel import Session, select
from models import User, engine
from passlib.context import CryptContext

# Cấu hình password hashing với các tùy chọn cụ thể
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=12,  # Số vòng lặp cho bcrypt
    bcrypt__ident="2b"  # Sử dụng phiên bản 2b của bcrypt
)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def seed_users():
    """Thêm dữ liệu mẫu cho users"""
    users = [
        {
            "email": "admin@example.com",
            "username": "admin",
            "password": "admin123@123",
            "is_superuser": True
        },
        {
            "email": "user1@example.com",
            "username": "user1",
            "password": "user123@123",
            "is_superuser": False
        },
        {
            "email": "user2@example.com",
            "username": "user2",
            "password": "user123@123",
            "is_superuser": False
        },
        {
            "email": "user3@example.com",
            "username": "user3",
            "password": "user123@123",
            "is_superuser": False
        },
        {
            "email": "user4@example.com",
            "username": "user4",
            "password": "user123@123",
            "is_superuser": False
        }
    ]

    with Session(engine) as session:
        # Kiểm tra xem đã có user nào chưa
        statement = select(User)
        existing_users = session.exec(statement).all()
        if existing_users:
            print("Đã có dữ liệu users, bỏ qua việc seed")
            return

        # Thêm users mới
        for user_data in users:
            user = User(
                email=user_data["email"],
                username=user_data["username"],
                hashed_password=get_password_hash(user_data["password"]),
                is_superuser=user_data["is_superuser"]
            )
            session.add(user)
        
        session.commit()
        print("Đã thêm 5 users mẫu thành công")

if __name__ == "__main__":
    seed_users() 