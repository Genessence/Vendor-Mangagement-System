from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql://username:password@localhost:5432/vendor_management_db"
    
    # Security
    secret_key: str = "your-secret-key-here-make-it-long-and-random"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Application
    debug: bool = True
    allowed_hosts: List[str] = ["localhost", "127.0.0.1"]
    cors_origins: List[str] = ["http://localhost:3000", "http://localhost:5173"]
    
    # Email
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    
    # File Upload
    upload_dir: str = "uploads"
    max_file_size: int = 10485760  # 10MB
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings() 