import React, { useEffect, useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Terminal, Music4Icon, Send } from "lucide-react";
import { askLLM } from "@/hooks/useLLM";

export default function LLMWidget() {
  const [response, setResponse] = useState("");
  const {
    transcript,
    listening,
    resetTranscript,
    // browserSupportsSpeechRecognition, note: using this causes a hydration mismatch, @TODO: investigate
    browserSupportsContinuousListening,
  } = useSpeechRecognition();
  const [editableTranscript, setEditableTranscript] = useState("");

  // Keep editableTranscript in sync when SpeechRecognition updates
  React.useEffect(() => {
    setEditableTranscript(transcript);
  }, [transcript]);

  const startListening = () => {
    resetTranscript();
    setResponse("");
    if (browserSupportsContinuousListening) {
      SpeechRecognition.startListening({
        continuous: true,
        language: "en-US",
      });
    } else {
      SpeechRecognition.startListening({ language: "en-US" });
    }
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const [messages, setMessages] = useState<{ sender: 'user' | 'assistant'; content: string }[]>([]);


  const handleSend = async () => {
    const userMessage = editableTranscript.trim();
    if (!userMessage) return;

    setEditableTranscript("");

    setMessages((prev) => [...prev, { sender: 'user', content: userMessage }]);

    const request: LLMRequest = {
      input: editableTranscript,
      enable_thinking: false,
      enable_rag: false,
      enable_tools: false,
    };

    setMessages((prev) => [...prev, { sender: 'assistant', content: "" }]);

    console.log("made request")
    try {
      await askLLM(request, (chunk) => {
        try {
          const partial: Partial<LLMResponse> = JSON.parse(chunk);
          const text = partial.response ?? "";

          setMessages((prevMessages) => {
            const messages = [...prevMessages];
            const lastIndex = messages.length - 1;
            const lastMessage = messages[lastIndex];

            let updatedMessage;

            if (partial.is_thinking) {
              updatedMessage = {
                ...lastMessage,
                content: "Thinking..."
              };
            } else {
              if (lastMessage.content === "Thinking...") {
                lastMessage.content = "";
              }

              updatedMessage = {
                ...lastMessage,
                content: lastMessage.content + text,
              };
            }
            messages[lastIndex] = updatedMessage;

            return messages;
          });

        } catch (err) {
          console.warn("Invalid JSON chunk:", chunk);
        }
      });
    } catch (error) {
      console.error("LLM error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: 'assistant', content: "There was an error processing your request." },
      ]);
    }
  };


  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
    setEditableTranscript(e.target.value);
  };

  return (
    <div className="w-full h-full bg-gray-800 rounded-lg border border-blue-600 shadow-lg shadow-blue-500/10 overflow-hidden flex flex-col">
      <div className="bg-gray-700 p-2 border-b border-blue-600 flex items-center space-x-2 drag-handle hover:cursor-move">
        <Terminal size={18} className="text-blue-400" />
        <span className="font-bold">LLM INTERFACE</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-md max-w-[80%] text-sm ${
              msg.sender === 'user'
                ? 'bg-gray-700 text-white self-start'
                : 'bg-blue-600 text-white self-end'
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      {/* Input Textbox */}
      <textarea
        ref={textareaRef}
        value={editableTranscript}
        onChange={handleChange}
        placeholder="Your voice transcript will appear here."
        className="p-2 rounded-md border border-blue-600 bg-gray-900 text-gray-200 text-sm resize-none overflow-y-auto max-h-48"
      />

      {/* Buttons row */}
      <div className="flex space-x-2">
        {/* Audio Button */}
        {!listening ? (
          <button
            onClick={startListening}
            className="flex-1 flex items-center justify-center px-3 py-2 rounded-md border border-blue-400 bg-blue-900/50 text-sm text-blue-100 font-medium hover:bg-blue-800"
          >
            <Music4Icon size={16} className="mr-2" />
            Start Listening
          </button>
        ) : (
          <button
            onClick={stopListening}
            className="flex-1 flex items-center justify-center px-3 py-2 rounded-md border border-red-400 bg-red-900/50 text-sm text-red-100 font-medium hover:bg-red-800"
          >
            <Music4Icon size={16} className="mr-2 animate-pulse text-red-400" />
            Stop Listening
          </button>
        )}

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!editableTranscript.trim()}
          className="flex-1 flex items-center justify-center px-3 py-2 rounded-md border border-blue-400 bg-blue-600 text-sm text-white font-medium hover:bg-blue-500 disabled:opacity-50"
        >
          <Send size={16} className="mr-2" />
          Send to LLM
        </button>
      </div>
    </div>
  );
}
