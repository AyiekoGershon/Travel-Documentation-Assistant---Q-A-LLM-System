'use client';

import React from 'react';
import { FiClock, FiTrash2, FiChevronRight } from 'react-icons/fi';
import { format } from 'date-fns';

interface ChatHistoryItem {
  id: number;
  question: string;
  answer: string;
  timestamp: Date;
}

interface ChatHistoryProps {
  history: ChatHistoryItem[];
  onSelect: (item: ChatHistoryItem) => void;
  onClear: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  history,
  onSelect,
  onClear,
  isOpen,
  onToggle
}) => {
  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 p-3 bg-white dark:bg-gray-800 rounded-r-lg shadow-lg border border-l-0 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
      >
        <FiClock className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out z-30 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="w-80 h-full flex flex-col border-r border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiClock className="w-5 h-5 text-primary-600" />
                <h2 className="text-lg font-semibold">Chat History</h2>
              </div>
              <button
                onClick={onToggle}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {history.length} conversations
            </p>
          </div>

          {/* Clear Button */}
          {history.length > 0 && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={onClear}
                className="w-full py-2 px-3 flex items-center justify-center gap-2 text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors duration-200"
              >
                <FiTrash2 className="w-4 h-4" />
                Clear All History
              </button>
            </div>
          )}

          {/* History List */}
          <div className="flex-1 overflow-y-auto">
            {history.length === 0 ? (
              <div className="p-8 text-center">
                <FiClock className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No chat history yet
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  Your questions will appear here
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onSelect(item)}
                    className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {item.question}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                          {item.answer}
                        </p>
                        <div className="flex items-center gap-1 mt-2">
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {format(new Date(item.timestamp), 'MMM d, HH:mm')}
                          </span>
                        </div>
                      </div>
                      <FiChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20"
        />
      )}
    </div>
  );
};

export default ChatHistory;