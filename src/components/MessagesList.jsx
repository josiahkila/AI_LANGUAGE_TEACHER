import { useAITeacher } from "@/hooks/useAITeacher";
import { useEffect, useRef } from "react";

export const MessagesList = () => {
  const messages = useAITeacher((state) => state.messages);
  const playMessage = useAITeacher((state) => state.playMessage);
  const currentMessage = useAITeacher((state) => state.currentNoMessage); // Correctly retrieve the current message.
  const english = useAITeacher((state) => state.english);

  const container = useRef(null);

  useEffect(() => {
    console.log('Current Messages:', messages);
    messages.forEach((message, index) => {
      console.log(`Message ${index}:`, message);
      const displayText = message.text || message.answer || 'No text available'; // Fallback to 'answer' if 'text' is not present.
      console.log(`Message ${index} Text: ${displayText}`);
    });

    if (container.current) {
      container.current.scrollTo({
        top: container.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const renderMessageText = (message) => (
    <>
      {english && (
        <p className="text-4xl inline-block px-2 rounded-sm font-bold bg-clip-text text-transparent bg-gradient-to-br from-blue-300/90 to-white/90">
          {message.text || message.answer || "No text available"}
        </p>
      )}
    </>
  );

  return (
    <div className="w-[1288px] h-[676px] p-8 overflow-y-auto flex flex-col space-y-8 bg-transparent opacity-80" ref={container}>
      {messages.length === 0 && (
        <div className="h-full w-full grid place-content-center text-center">
          <h2 className="text-8xl font-bold text-white/90 italic">
            Welcome to ChatBot
          </h2>
        </div>
      )}
      {messages.map((message, i) => (
        <div key={i} className="flex flex-col">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-white/90 text-2xl font-bold uppercase px-3 py-1 rounded-full bg-indigo-600">
                {message.speech || "Conversation"}
              </span>
              {renderMessageText(message)}
            </div>
            {currentMessage === message ? (
              <button className="text-white/65" onClick={() => playMessage(null)} aria-label="Stop playing">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h12M6 12h12m-12 6h12" />
                </svg>
              </button>
            ) : (
              <button className="text-white/65" onClick={() => playMessage(message)} aria-label="Play message">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.25 9.75l-6 4.5 6 4.5V9.75z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
