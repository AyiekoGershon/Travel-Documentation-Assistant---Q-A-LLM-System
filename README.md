# 🧳 Travel Documentation Assistant - Q&A LLM System

[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14.0.4-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/Python-3.x-3776AB?logo=python&logoColor=white)](https://www.python.org/)

A full-stack AI-powered travel documentation assistant that provides real-time information about visa requirements, passport rules, travel advisories, and documentation needs worldwide using DeepSeek LLM.

## ✨ Features

### 🤖 AI-Powered Assistance
- **Real-time Travel Documentation Answers**: Get comprehensive information about visa requirements, passport validity, and travel documents
- **DeepSeek LLM Integration**: Powered by state-of-the-art language models for accurate, detailed responses
- **Structured Responses**: Well-formatted markdown responses with clear sections for documents, advisories, and additional information

### 🎨 Modern User Interface
- **Clean Chat Interface**: Intuitive chat-based interface with message history
- **Responsive Design**: Fully responsive design that works on desktop and mobile
- **Dark/Light Mode**: Built-in theme support with Tailwind CSS
- **Real-time Status**: Live backend and API health monitoring

### 🔐 Secure API Management
- **Local API Key Storage**: User API keys stored securely in browser localStorage
- **Optional Validation**: Simplified API key validation (can be enabled/disabled)
- **Multi-key Support**: Use default backend key or user-provided keys

### 📊 Additional Features
- **Query History**: In-memory storage of recent queries with easy access
- **Example Questions**: Pre-loaded travel-related questions to get users started
- **Travel Statistics**: Dashboard with country coverage, document types, and real-time updates
- **Export Ready**: All responses formatted in markdown for easy sharing

## 🏗️ Architecture

```
qa-llm-system/
├── backend/                 # FastAPI Python backend
│   ├── app/
│   │   ├── api/            # REST API endpoints
│   │   ├── services/       # LLM service and business logic
│   │   ├── config.py       # Application configuration
│   │   ├── schemas.py      # Pydantic data models
│   │   ├── models.py       # Data models and storage
│   │   └── main.py         # FastAPI application entry point
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Environment variables template
│
├── frontend/               # Next.js 14 frontend
│   ├── app/
│   │   ├── components/     # React components
│   │   ├── services/       # API service layer
│   │   ├── page.tsx        # Main application page
│   │   ├── layout.tsx      # Root layout
│   │   └── globals.css     # Global styles
│   ├── package.json        # Node.js dependencies
│   └── tailwind.config.ts  # Tailwind CSS configuration
│
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and **npm** 9+
- **Python** 3.10+
- **DeepSeek API Key** ([Get one here](https://platform.deepseek.com/api_keys))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/qa-llm-system.git
   cd qa-llm-system
   ```

2. **Set up the Backend**
   ```bash
   cd backend
   
   # Create virtual environment (optional but recommended)
   python -m venv .venv
   
   # Activate virtual environment
   # On Windows:
   .venv\Scripts\activate
   # On macOS/Linux:
   source .venv/bin/activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Set up environment variables
   cp .env.example .env
   # Edit .env and add your DeepSeek API key (optional)
   ```

3. **Set up the Frontend**
   ```bash
   cd ../frontend
   
   # Install dependencies
   npm install
   
   # Set up environment variables
   cp .env.example .env.local
   # Edit .env.local if you need to change API URL
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   python -m app.main
   ```
   Backend will run at: `http://localhost:8000`
   - API Documentation: `http://localhost:8000/docs`
   - Health Check: `http://localhost:8000/api/v1/health`

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run at: `http://localhost:3000`

3. **Open your browser** and navigate to `http://localhost:3000`

4. **Add your DeepSeek API Key** in the modal that appears, or click the "Add API Key" button in the header

## 📖 Usage Guide

### Asking Questions
1. **Enter your DeepSeek API key** when prompted (required for AI features)
2. **Type your question** in the chat input at the bottom
3. **Press Enter** or click the send button
4. **View the response** with structured information about:
   - Required documents
   - Travel advisories
   - Additional important information

### Example Questions
- "What documents do I need to travel from Kenya to Ireland?"
- "Visa requirements for Indian citizens traveling to Japan"
- "Passport validity requirements for Schengen countries"
- "Documents needed for a student visa to the United States"
- "Travel requirements for minors traveling internationally"

### Features Overview
- **Chat History**: Click the menu icon (☰) to view and select from previous queries
- **API Key Management**: Update your API key anytime using the key button in the header
- **Example Suggestions**: Click on suggested questions to quickly get started
- **Response Formatting**: All responses are formatted with markdown for readability

## 🔧 API Reference

### Backend Endpoints

| Endpoint | Method | Description | Request Body |
|----------|--------|-------------|--------------|
| `/api/v1/health` | GET | Health check | None |
| `/api/v1/query` | POST | Process user query | `{"question": string, "context": string?, "api_key": string?}` |
| `/api/v1/validate-api-key` | POST | Validate API key | `{"api_key": string}` |
| `/api/v1/history` | GET | Get query history | Query param: `limit` |
| `/api/v1/example-questions` | GET | Get example questions | None |

### Request/Response Examples

**Query Request:**
```json
{
  "question": "What documents do I need for travel to Japan?",
  "api_key": "sk-your-deepseek-api-key"
}
```

**Query Response:**
```json
{
  "original_question": "What documents do I need for travel to Japan?",
  "answer": "Brief summary...",
  "formatted_response": "# Comprehensive Answer\n\n## Required Documents\n- **Passport**: Valid for at least 6 months...\n\n## Travel Advisories\n- **Level 1**: Exercise normal precautions...\n\n## Additional Information\n- Visa-free for 90 days for many nationalities...",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## 🛠️ Development

### Backend Development
```bash
cd backend
# Install development dependencies
pip install -r requirements.txt

# Run with auto-reload
python -m app.main
# Or using uvicorn directly
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development
```bash
cd frontend
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Environment Variables

**Backend (`.env`):**
```env
# API Configuration
APP_NAME="Q&A LLM System"
APP_VERSION="1.0.0"
DEBUG=True

# CORS Configuration
CORS_ORIGINS="http://localhost:3000,http://localhost:8000"

# DeepSeek API Configuration
DEEPSEEK_API_KEY="your-default-api-key-here"  # Optional
DEEPSEEK_API_URL="https://api.deepseek.com/v1/chat/completions"
DEEPSEEK_MODEL="deepseek-chat"

# Rate limiting
MAX_REQUESTS_PER_MINUTE=10
```

**Frontend (`.env.local`):**
```env
NEXT_PUBLIC_API_URL="http://localhost:8000"
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
# Run tests (add your test files)
python -m pytest tests/
```

### Frontend Tests
```bash
cd frontend
# Run tests (add your test files)
npm test
```

## 🔒 Security Considerations

1. **API Key Storage**: User API keys are stored in browser's localStorage only
2. **No Server Storage**: The backend does not store user API keys
3. **CORS Configuration**: Properly configured to allow only trusted origins
4. **Input Validation**: All user inputs are validated using Pydantic schemas
5. **Rate Limiting**: Basic rate limiting implemented to prevent abuse

**Important**: Always verify travel information with official government sources before making travel decisions.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [DeepSeek](https://www.deepseek.com/) for providing the LLM API
- [FastAPI](https://fastapi.tiangolo.com/) for the excellent Python web framework
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- All open-source libraries used in this project

## 📞 Support

For support, please:
1. Check the [Issues](https://github.com/yourusername/qa-llm-system/issues) page
2. Create a new issue if your problem isn't already reported
3. Include detailed information about your setup and the problem

## 📊 Project Status

**Current Version**: 1.0.0  
**Last Updated**: January 2024  
**Status**: Active Development  

### Roadmap
- [ ] Add database persistence for query history
- [ ] Implement user authentication
- [ ] Add multiple LLM provider support
- [ ] Create admin dashboard
- [ ] Add export functionality (PDF/CSV)
- [ ] Implement caching for frequent queries
- [ ] Add multilingual support

---

<div align="center">
  <p>Built with ❤️ for travelers worldwide</p>
  <p>Always verify with official sources before traveling</p>
</div>
```