from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# Add this new schema
class ApiKeyValidation(BaseModel):
    is_valid: bool
    message: str


# New schema for query requests with API key
class QueryRequestWithApiKey(BaseModel):
    question: str = Field(
        ...,
        min_length=1,
        max_length=1000,
        description="User's question for the Q&A system"
    )
    context: Optional[str] = Field(
        None,
        description="Additional context for the query"
    )
    api_key: Optional[str] = Field(
        None,
        description="User's DeepSeek API key"
    )


# Keep the original QueryRequest for backward compatibility
class QueryRequest(BaseModel):
    question: str = Field(
        ...,
        min_length=1,
        max_length=1000,
        description="User's question for the Q&A system"
    )
    context: Optional[str] = Field(
        None,
        description="Additional context for the query"
    )


class Document(BaseModel):
    title: str
    description: str
    required: bool = True


class TravelAdvisory(BaseModel):
    level: str
    description: str
    last_updated: datetime


class QueryResponse(BaseModel):
    original_question: str
    answer: str
    documents: Optional[List[Document]] = None
    travel_advisories: Optional[List[TravelAdvisory]] = None
    additional_info: Optional[List[str]] = None
    formatted_response: str
    timestamp: datetime


class ErrorResponse(BaseModel):
    error: str
    details: Optional[str] = None
    code: int


class HealthResponse(BaseModel):
    status: str
    version: str
    timestamp: datetime
    llm_available: bool