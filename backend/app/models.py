from typing import Optional, List
from datetime import datetime


class QueryHistory:
    """In-memory storage for query history (for demo purposes)"""
    def __init__(self):
        self.history: List[dict] = []
    
    def add_query(self, query_data: dict):
        """Add a query to history"""
        self.history.append({
            **query_data,
            "id": len(self.history) + 1,
            "timestamp": datetime.now()
        })
        # Keep only last 50 queries
        if len(self.history) > 50:
            self.history = self.history[-50:]
    
    def get_history(self, limit: int = 10) -> List[dict]:
        """Get recent query history"""
        return self.history[-limit:][::-1]


# Initialize query history
query_history = QueryHistory()