'use client';

import { useState, useEffect, useCallback } from 'react';
import ChatInput from './components/ChatInput';
import ChatMessage from './components/ChatMessage';
import ChatHistory from './components/ChatHistory';
import LoadingSpinner from './components/LoadingSpinner';
import ApiKeyModal from './components/ApiKeyModal';
import { apiService, QueryRequest, QueryResponse, HistoryItem } from './services/api';
import { FiMenu, FiGlobe, FiAlertCircle, FiCheckCircle, FiKey } from 'react-icons/fi';

export default function Home() {
  const [messages, setMessages] = useState<Array<{
    id: number;
    question: string;
    response: QueryResponse | null;
    isUser: boolean;
  }>>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [exampleQuestions, setExampleQuestions] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [apiStatus, setApiStatus] = useState<'checking' | 'healthy' | 'unhealthy'>('checking');
  const [userApiKey, setUserApiKey] = useState<string>('');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('deepseek_api_key');
    if (savedApiKey) {
      setUserApiKey(savedApiKey);
    }
  }, []);

  // Check API health on mount
  useEffect(() => {
    checkApiHealth();
    loadExampleQuestions();
  }, []);

  const checkApiHealth = async () => {
    try {
      const health = await apiService.healthCheck();
      setApiStatus('healthy'); // Backend is healthy
      
      const historyData = await apiService.getHistory();
      setHistory(historyData);
    } catch (err) {
      setApiStatus('unhealthy');
      setError('Unable to connect to the server. Please make sure the backend is running.');
    }
  };

  const loadExampleQuestions = async () => {
    try {
      const questions = await apiService.getExampleQuestions();
      setExampleQuestions(questions);
    } catch (err) {
      setExampleQuestions([
        "What documents do I need to travel from Kenya to Ireland?",
        "Visa requirements for Indian citizens traveling to Japan",
        "Passport validity requirements for Schengen countries",
      ]);
    }
  };

  const handleSubmit = async (question: string) => {
    if (!question.trim() || isLoading) return;

    // Check if we have an API key
    if (!userApiKey && apiStatus === 'unhealthy') {
      setError('Please add your DeepSeek API key to use the AI assistant.');
      setShowApiKeyModal(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Add user message immediately
    const userMessageId = Date.now();
    setMessages(prev => [...prev, {
      id: userMessageId,
      question,
      response: null,
      isUser: true
    }]);

    try {
      const request: QueryRequest = { question };
      const response = await apiService.sendQuery(request, userApiKey);
      
      // Add AI response
      setMessages(prev => prev.map(msg => 
        msg.id === userMessageId 
          ? { ...msg, response }
          : msg
      ));

      // Refresh history
      const updatedHistory = await apiService.getHistory();
      setHistory(updatedHistory);

    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to get response.';
      setError(errorMsg);
      
      // Check if it's an API key error
      if (errorMsg.includes('API key') || err.response?.status === 401) {
        setShowApiKeyModal(true);
      }
      
      // Remove loading message on error
      setMessages(prev => prev.filter(msg => msg.id !== userMessageId));
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiKeyChange = (apiKey: string) => {
    setUserApiKey(apiKey);
    if (apiKey) {
      localStorage.setItem('deepseek_api_key', apiKey);
      setError(null); // Clear any previous API key errors
    } else {
      localStorage.removeItem('deepseek_api_key');
    }
  };

  const handleHistorySelect = useCallback((item: HistoryItem) => {
    handleSubmit(item.question);
    setShowHistory(false);
  }, []);

  const handleClearHistory = async () => {
    setHistory([]);
    setShowHistory(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSubmit(suggestion);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                <FiGlobe className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Travel Documentation Assistant
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  AI-powered guidance for travel requirements worldwide
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* API Key Button */}
              <button
                onClick={() => setShowApiKeyModal(true)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  userApiKey
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800/40'
                    : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-800/40'
                }`}
              >
                <FiKey className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {userApiKey ? 'API Key ✓' : 'Add API Key'}
                </span>
              </button>
              
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                title="Chat History"
              >
                <FiMenu className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  userApiKey ? 'bg-green-500' :
                  apiStatus === 'healthy' ? 'bg-blue-500' :
                  apiStatus === 'unhealthy' ? 'bg-red-500' : 'bg-yellow-500'
                }`} />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {userApiKey ? 'AI Ready' :
                   apiStatus === 'healthy' ? 'Backend Ready' :
                   apiStatus === 'unhealthy' ? 'Backend Offline' : 'Checking...'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Banner */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Documents Covered</p>
                <p className="text-2xl font-bold">150+</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FiGlobe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Countries Supported</p>
                <p className="text-2xl font-bold">195</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <FiAlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Real-time Updates</p>
                <p className="text-2xl font-bold">24/7</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                userApiKey 
                  ? 'bg-green-100 dark:bg-green-900/30' 
                  : 'bg-yellow-100 dark:bg-yellow-900/30'
              }`}>
                <FiCheckCircle className={`w-5 h-5 ${
                  userApiKey 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-yellow-600 dark:text-yellow-400'
                }`} />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">API Status</p>
                <p className="text-2xl font-bold">
                  {userApiKey ? 'Connected' : 'Required'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* API Key Warning */}
        {!userApiKey && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center gap-3">
              <FiAlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-medium text-yellow-800 dark:text-yellow-300">
                  API Key Required
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                  To use the AI assistant, you need to add your DeepSeek API key. 
                  <button
                    onClick={() => setShowApiKeyModal(true)}
                    className="ml-2 underline hover:text-yellow-800 dark:hover:text-yellow-300"
                  >
                    Click here to add it
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Chat Container */}
        <div className="flex gap-8">
          {/* Main Chat Area */}
          <div className="flex-1">
            {messages.length === 0 && !isLoading && !error ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 rounded-full flex items-center justify-center">
                  <FiGlobe className="w-12 h-12 text-primary-600 dark:text-primary-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Welcome to Your Travel Assistant
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
                  {userApiKey 
                    ? 'Ask me anything about travel documents, visa requirements, passport rules, or travel advisories for any destination worldwide.'
                    : 'Add your DeepSeek API key to start asking questions about travel documentation requirements worldwide.'
                  }
                </p>
                
                {userApiKey ? (
                  <div className="max-w-2xl mx-auto">
                    <ChatInput
                      onSubmit={handleSubmit}
                      isLoading={isLoading}
                      suggestions={exampleQuestions.slice(0, 3)}
                      onSuggestionClick={handleSuggestionClick}
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => setShowApiKeyModal(true)}
                    className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto"
                  >
                    <FiCheckCircle className="w-5 h-5" />
                    Add API Key to Get Started
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                {/* Messages */}
                {messages.map((msg) => (
                  <div key={msg.id} className="animate-fade-in">
                    {/* User Message */}
                    <ChatMessage
                      message={msg.question}
                      isUser={true}
                      timestamp={new Date()}
                    />
                    
                    {/* AI Response */}
                    {msg.response ? (
                      <div className="mt-4">
                        <ChatMessage
                          message={msg.response.formatted_response}
                          isUser={false}
                          timestamp={new Date(msg.response.timestamp)}
                          documents={msg.response.documents || []}
                          travelAdvisories={msg.response.travel_advisories || []}
                          additionalInfo={msg.response.additional_info || []}
                        />
                      </div>
                    ) : (
                      isLoading && (
                        <div className="mt-4 ml-14">
                          <LoadingSpinner message="Researching travel requirements..." />
                        </div>
                      )
                    )}
                  </div>
                ))}

                {/* Loading State for New Message */}
                {isLoading && messages[messages.length - 1]?.response && (
                  <div className="animate-fade-in">
                    <ChatMessage
                      message="Thinking..."
                      isUser={false}
                      timestamp={new Date()}
                    />
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                      <FiAlertCircle className="w-5 h-5" />
                      <span className="font-medium">Error</span>
                    </div>
                    <p className="mt-1 text-red-600 dark:text-red-300">{error}</p>
                    {error.includes('API key') && (
                      <button
                        onClick={() => setShowApiKeyModal(true)}
                        className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
                      >
                        Update API Key
                      </button>
                    )}
                  </div>
                )}

                {/* Input at Bottom */}
                {userApiKey && (
                  <div className="sticky bottom-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
                    <ChatInput
                      onSubmit={handleSubmit}
                      isLoading={isLoading}
                      suggestions={exampleQuestions}
                      onSuggestionClick={handleSuggestionClick}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* History Sidebar */}
      <ChatHistory
        history={history}
        onSelect={handleHistorySelect}
        onClear={handleClearHistory}
        isOpen={showHistory}
        onToggle={() => setShowHistory(!showHistory)}
      />

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Powered by DeepSeek AI • Information provided is for reference only
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            Always verify with official government sources before traveling
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-600 mt-2">
            Your API key is stored locally in your browser and never sent to our servers
          </p>
        </div>
      </footer>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onSave={handleApiKeyChange}
        currentApiKey={userApiKey}
      />
    </div>
  );
}