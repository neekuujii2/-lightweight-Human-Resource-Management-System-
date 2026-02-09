from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "HRMS Lite"
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/hrms_db"
    
    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def assemble_db_url(cls, v: Optional[str]) -> str:
        if v and v.startswith("postgres://"):
            return v.replace("postgres://", "postgresql://", 1)
        return v

    class Config:
        env_file = ".env"

settings = Settings()
