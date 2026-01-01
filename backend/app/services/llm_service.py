import httpx
from typing import Optional
from app.config import settings
from app.schemas import QueryRequest, QueryResponse
from datetime import datetime


class LLMService:
    """Service for handling LLM interactions with DeepSeek API"""
    
    def __init__(self):
        self.api_url = settings.DEEPSEEK_API_URL
        self.model = settings.DEEPSEEK_MODEL
    
    async def generate_response(self, query: QueryRequest, user_api_key: Optional[str] = None) -> QueryResponse:
        """Generate response using DeepSeek API with optional user API key"""
        
        # Use user's API key if provided, otherwise use environment key
        api_key = user_api_key or settings.DEEPSEEK_API_KEY
        
        if not api_key:
            raise Exception("No API key provided. Please add your DeepSeek API key.")
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        # System prompt
        system_prompt = """You are a helpful travel assistant specialized in providing detailed 
        information about travel documentation requirements. Always provide accurate, 
        structured information about:
        1. Required visa documentation
        2. Passport requirements (validity, blank pages, etc.)
        3. Additional necessary documents (vaccination certificates, invitation letters, etc.)
        4. Any relevant travel advisories
        5. Processing times and fees if applicable
        
        Format your response as well-structured markdown with clear sections:
        # Comprehensive Answer
        [Brief summary]
        
        ## Required Documents
        - **Document Name**: Description and requirements
        
        ## Travel Advisories
        - **Advisory Level**: Details
        
        ## Additional Information
        - Important points
        
        Use proper markdown formatting with headers (#, ##), bold text (**text**), and bullet points.
        Do NOT include JSON or code blocks."""
        
        # User prompt
        user_prompt = f"Question: {query.question}\n\n{f'Context: {query.context}' if query.context else ''}\n\nPlease provide a comprehensive, well-structured response in markdown format."
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    self.api_url,
                    headers=headers,
                    json={
                        "model": self.model,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_prompt}
                        ],
                        "temperature": 0.3,
                        "max_tokens": 2000
                    }
                )
                
                if response.status_code == 200:
                    result = response.json()
                    content = result["choices"][0]["message"]["content"]
                    
                    # Clean any code blocks
                    content = content.replace("```json", "").replace("```markdown", "").replace("```", "").strip()
                    
                    return QueryResponse(
                        original_question=query.question,
                        answer=content[:500] + "..." if len(content) > 500 else content,
                        formatted_response=content,
                        timestamp=datetime.now()
                    )
                
                elif response.status_code == 401:
                    raise Exception("Invalid API key. Please check your DeepSeek API key.")
                elif response.status_code == 429:
                    raise Exception("Rate limit exceeded. Please try again later.")
                else:
                    raise Exception(f"API error: {response.status_code}")
                    
        except httpx.TimeoutException:
            raise Exception("Request timeout. Please try again.")
        except Exception as e:
            raise Exception(f"LLM service error: {str(e)}")
    
    async def check_api_key(self, api_key: str) -> bool:
        """Check if a given API key is valid by making a simple test call"""
        if not api_key:
            return False
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                # Make a very small, cheap test call - just ask for "test"
                response = await client.post(
                    self.api_url,
                    headers=headers,
                    json={
                        "model": self.model,
                        "messages": [
                            {"role": "user", "content": "Say 'test'"}
                        ],
                        "max_tokens": 1,
                        "temperature": 0
                    }
                )
                
                # If we get a successful response, key is valid
                # 200 = success, 429 = rate limit (but key is valid)
                if response.status_code in [200, 429]:
                    return True
                
                # 401 means invalid key
                if response.status_code == 401:
                    return False
                
                # Other status codes - log but allow to try
                print(f"API validation returned status: {response.status_code}")
                return True
                
        except httpx.HTTPStatusError as e:
            # 401 means invalid key
            if e.response.status_code == 401:
                return False
            # Other HTTP errors - might be network issues
            print(f"HTTP error during validation: {e}")
            return True  # Allow to try in actual use
        except httpx.RequestError as e:
            # Network errors
            print(f"Network error during validation: {e}")
            return True  # Could be network issue, allow to try
        except Exception as e:
            # Any other error
            print(f"Error during API key validation: {e}")
            return True  # Allow to try in actual use


# Initialize LLM service
llm_service = LLMService()