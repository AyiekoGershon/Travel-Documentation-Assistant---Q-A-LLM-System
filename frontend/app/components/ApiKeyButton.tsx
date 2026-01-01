'use client';

import React, { useState } from 'react';
import { FiKey, FiCheck, FiX } from 'react-icons/fi';
import ApiKeyModal from './ApiKeyModal';

interface ApiKeyButtonProps {
  currentApiKey?: string;
  onApiKeyChange: (apiKey: string) => void;
}

const ApiKeyButton: React.FC<ApiKeyButtonProps> = ({ 
  currentApiKey,
  onApiKeyChange 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasApiKey = !!currentApiKey;

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
          hasApiKey
            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800/40'
            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-800/40'
        }`}
      >
        <FiKey className="w-4 h-4" />
        <span className="text-sm font-medium">
          {hasApiKey ? 'API Key ✓' : 'Add API Key'}
        </span>
      </button>

      <ApiKeyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onApiKeyChange}
        currentApiKey={currentApiKey}
      />
    </>
  );
};

export default ApiKeyButton;