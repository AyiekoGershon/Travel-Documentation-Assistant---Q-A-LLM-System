import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface QueryRequest {
  question: string;
  context?: string;
}

export interface QueryResponse {
  original_question: string;
  answer: string;
  documents?: any[];
  travel_advisories?: any[];
  additional_info?: string[];
  formatted_response: string;
  timestamp: string;
}

export interface HealthResponse {
  status: string;
  version: string;
  timestamp: string;
  llm_available: boolean;
}

export interface HistoryItem {
  id: number;
  question: string;
  answer: string;
  timestamp: string;
}

class ApiService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  async healthCheck(): Promise<HealthResponse> {
    const response = await this.api.get<HealthResponse>('/api/v1/health');
    return response.data;
  }

  async sendQuery(query: QueryRequest, apiKey?: string): Promise<QueryResponse> {
    const payload: any = { ...query };
    if (apiKey) {
      payload.api_key = apiKey;
    }

    const response = await this.api.post<QueryResponse>('/api/v1/query', payload);
    return response.data;
  }

  async getHistory(limit: number = 10): Promise<HistoryItem[]> {
    const response = await this.api.get<HistoryItem[]>(`/api/v1/history?limit=${limit}`);
    return response.data;
  }

  async getExampleQuestions(): Promise<string[]> {
    const response = await this.api.get<string[]>('/api/v1/example-questions');
    return response.data;
  }
}

export const apiService = new ApiService();

