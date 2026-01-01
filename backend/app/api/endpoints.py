from fastapi import APIRouter, HTTPException, Query, Body
from typing import List, Optional
from datetime import datetime

from app.schemas import (
    QueryRequest, 
    QueryRequestWithApiKey,
    QueryResponse, 
    ErrorResponse, 
    HealthResponse,
    ApiKeyValidation
)
from app.services.llm_service import llm_service
from app.models import query_history

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    # Check if default API key is available
    from app.config import settings
    default_key_available = bool(settings.DEEPSEEK_API_KEY)
    
    return HealthResponse(
        status="healthy",
        version="1.0.0",
        timestamp=datetime.now(),
        llm_available=default_key_available
    )


@router.post("/query", response_model=QueryResponse)
async def process_query(
    request: QueryRequestWithApiKey
):
    """
    Process user query and return LLM-generated response
    """
    try:
        # Extract query and API key from request
        query = QueryRequest(
            question=request.question,
            context=request.context
        )
        
        # Generate response using LLM with optional user API key
        response = await llm_service.generate_response(query, request.api_key)

        # Store in history
        query_history.add_query({
            "question": query.question,
            "answer": response.answer[:100] + "..." if len(response.answer) > 100 else response.answer,
            "timestamp": response.timestamp
        })

        return response
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=ErrorResponse(
                error="Failed to process query",
                details=str(e),
                code=500
            ).dict()
        )


@router.post("/validate-api-key", response_model=ApiKeyValidation)
async def validate_api_key(api_key: str = Body(..., embed=True)):
    """
    Validate a DeepSeek API key
    """
    try:
        is_valid = await llm_service.check_api_key(api_key)
        
        return ApiKeyValidation(
            is_valid=is_valid,
            message="API key is valid" if is_valid else "Invalid API key"
        )
    except Exception as e:
        return ApiKeyValidation(
            is_valid=False,
            message=f"Validation error: {str(e)}"
        )


@router.get("/history", response_model=List[dict])
async def get_query_history(limit: int = Query(10, ge=1, le=50)):
    """
    Get recent query history
    """
    return query_history.get_history(limit)


@router.get("/example-questions", response_model=List[str])
async def get_example_questions():
    """
    Get example questions for users
    """
    return [
        "What documents do I need to travel from Kenya to Ireland?",
        "Visa requirements for Indian citizens traveling to Japan",
        "Passport validity requirements for Schengen countries",
        "Documents needed for a student visa to the United States",
        "Travel requirements for minors traveling internationally",
        "How to apply for a work visa in Germany?",
        "Required vaccinations for travel to Brazil",
        "Travel insurance requirements for Europe",
        "Documents for business travel to China",
        "Tourist visa processing time for Canada"
    ]