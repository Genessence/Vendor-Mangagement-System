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
    cors_origins: List[str] = [
        # Development
        "http://localhost:3000", 
        "http://localhost:5173", 
        "http://localhost:4173", 
        "http://127.0.0.1:4173",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        # Production - Amber Compliance System domains
        "https://ambercompliancesystem.com",
        "https://www.ambercompliancesystem.com",
        "https://vendor.ambercompliancesystem.com",
        "https://msme.ambercompliancesystem.com",
        # Add any additional development URLs
        "http://localhost:*",
        "http://127.0.0.1:*"
    ]
    
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