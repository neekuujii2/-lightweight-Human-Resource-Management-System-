from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "HRMS Lite"
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/hrms_db"
    
    class Config:
        env_file = ".env"

settings = Settings()
