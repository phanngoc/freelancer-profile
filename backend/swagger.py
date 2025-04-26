import uvicorn
from main import app
from fastapi.staticfiles import StaticFiles
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi import FastAPI, HTTPException

# Customize the OpenAPI schema
app.title = "Freelancer Profile API"
app.description = "API backend cho ứng dụng quản lý hồ sơ freelancer"
app.version = "1.0.0"

# Config server
if __name__ == "__main__":
    print("Swagger UI available at http://localhost:8000/docs")
    print("ReDoc available at http://localhost:8000/redoc")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)