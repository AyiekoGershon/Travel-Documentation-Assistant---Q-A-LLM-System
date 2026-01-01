from pydantic_settings import BaseSettings
from typing import Optional, List
from pydantic import Field


class Settings(BaseSettings):
    # API Configuration
    APP_NAME: str = "Q&A LLM System"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # CORS Configuration - Use Field for comma-separated string
    CORS_ORIGINS: str = Field(
        "http://localhost:3000,http://localhost:8000",
        description="Comma-separated list of allowed origins"
    )
    
    # DeepSeek API Configuration
    DEEPSEEK_API_KEY: Optional[str] = None
    DEEPSEEK_API_URL: str = "https://api.deepseek.com/v1/chat/completions"
    DEEPSEEK_MODEL: str = "deepseek-chat"
    
    # Rate limiting (simplified)
    MAX_REQUESTS_PER_MINUTE: int = 10
    
    @property
    def cors_origins_list(self):
        """Parse comma-separated origins into a list"""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
    
    class Config:
        env_file = ".env"


settings = Settings()