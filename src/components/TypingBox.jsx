import React, { useState } from 'react';
import { useAITeacher } from '@/hooks/useAITeacher';  // Ensure this path matches the actual file location

export const TypingBox = () => {
  const askAI = useAITeacher(state => state.askAI);
  const loading = useAITeacher(state => state.loading);
  const [question, setQuestion] = useState('');

  const ask = () => {
    if (question.trim()) {
      askAI({ question });
      setQuestion('');
    }
  };

  return (
    <div className="z-10 max-w-[600px] flex space-y-6 flex-col bg-gradient-to-tr from-slate-300/30 via-gray-400/30 to-slate-600/30 p-4 backdrop-blur-md rounded-xl border-slate-100/30 border">
      <div>
        <h2 className="text-white font-bold text-xl">Let's Talk</h2>
        <p className="text-white/65">What do you want to talk about?</p>
      </div>
      {loading ? (
        <div className="flex justify-center items-center">
          <span className="relative flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
          </span>
        </div>
      ) : (
        <div className="gap-3 flex">
          <input
            className="focus:outline-none focus:outline-white/80 flex-grow bg-slate-800/60 p-2 px-4 rounded-full text-white placeholder:text-white/50 shadow-inner shadow-slate-900/60"
            placeholder="Ask me a question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                ask();
              }
            }}
          />
          <button
            className="bg-slate-100/20 p-2 px-6 rounded-full text-white"
            onClick={ask}
          >
            Ask
          </button>
        </div>
      )}
    </div>
  );
};
