'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { FiUser, FiGlobe, FiCalendar, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { format } from 'date-fns';

interface Document {
  title: string;
  description: string;
  required: boolean;
}

interface TravelAdvisory {
  level: string;
  description: string;
  last_updated: Date;
}

interface ChatMessageProps {
  message: string;
  isUser?: boolean;
  timestamp?: Date;
  documents?: Document[] | null;
  travelAdvisories?: TravelAdvisory[] | null;
  additionalInfo?: string[] | null;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isUser = false,
  timestamp = new Date(),
  documents = null,
  travelAdvisories = null,
  additionalInfo = null
}) => {
  const formattedTime = format(timestamp, 'HH:mm');
  const formattedDate = format(timestamp, 'MMM d, yyyy');

  // Safely check if arrays have content
  const hasDocuments = documents && documents.length > 0;
  const hasTravelAdvisories = travelAdvisories && travelAdvisories.length > 0;
  const hasAdditionalInfo = additionalInfo && additionalInfo.length > 0;

  return (
    <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400' 
          : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400'
      }`}>
        {isUser ? (
          <FiUser className="w-5 h-5" />
        ) : (
          <FiGlobe className="w-5 h-5" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 ${isUser ? 'text-right' : ''}`}>
        {/* Header */}
        <div className={`flex items-center gap-2 mb-2 ${isUser ? 'justify-end' : ''}`}>
          <span className="font-medium">
            {isUser ? 'You' : 'Travel Assistant'}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formattedTime} • {formattedDate}
          </span>
        </div>

        {/* Message Bubble */}
        <div className={`rounded-2xl p-4 max-w-3xl ${
          isUser
            ? 'bg-primary-500 text-white ml-auto'
            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
        }`}>
          {/* Main Message */}
          <div className={`prose prose-sm max-w-none ${
            isUser ? 'text-white' : 'dark:prose-invert'
          }`}>
            <ReactMarkdown>{message}</ReactMarkdown>
          </div>

          {/* Documents Section */}
          {hasDocuments && !isUser && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <FiCheckCircle className="w-5 h-5 text-green-500" />
                Required Documents
              </h3>
              <div className="grid gap-3">
                {documents.map((doc, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      doc.required
                        ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className={`p-1 rounded ${
                        doc.required 
                          ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}>
                        {doc.required ? (
                          <FiCheckCircle className="w-4 h-4" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-current" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{doc.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {doc.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Travel Advisories */}
          {hasTravelAdvisories && !isUser && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <FiAlertCircle className="w-5 h-5 text-amber-500" />
                Travel Advisories
              </h3>
              <div className="grid gap-3">
                {travelAdvisories.map((advisory, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20"
                  >
                    <div className="flex items-start gap-2">
                      <div className="p-1 rounded bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400">
                        <FiAlertCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{advisory.level}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Updated {format(new Date(advisory.last_updated), 'MMM d')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {advisory.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Info */}
          {hasAdditionalInfo && !isUser && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-3">Additional Information</h3>
              <ul className="space-y-2">
                {additionalInfo.map((info, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{info}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;