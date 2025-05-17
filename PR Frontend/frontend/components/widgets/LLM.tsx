import React, { useEffect, useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Terminal, Music4Icon, Send, Trash2 } from "lucide-react";
import { askLLM, syncFromBackend, syncToBackend } from "@/hooks/useLLM";

export default function LLMWidget() {
  const [response, setResponse] = useState("");
  const [isSendEnabled, setIsSendEnabled] = useState(true);

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

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    syncFromBackend().then(setMessages);
  }, []);

  const handleSend = async () => {
    const userMessage = editableTranscript.trim();
    if (!userMessage) return;

    setIsSendEnabled(false);
    syncToBackend(messages);

    setEditableTranscript("");

    const request: LLMRequest = {
      input: editableTranscript,
      enable_thinking: false,
      enable_rag: false,
      enable_tools: false,
    };

    setMessages((prev) => [...prev, { role: 'assistant', content: "" }]);
    const updatedMessages = [
      ...messages,
      { role: 'user', content: userMessage },
      { role: 'assistant', content: '' }
    ];

    setMessages(updatedMessages);

    let assistantContent = "";

    try {
      await askLLM(request, (chunk) => {
        try {
          const partial: Partial<LLMResponse> = JSON.parse(chunk);
          const text = partial.response ?? "";

          if (partial.is_thinking) {
            assistantContent = "Thinking...";
          } else {
            if (assistantContent === "Thinking...") {
              assistantContent = "";
            }
            assistantContent += text;
          }

          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              content: assistantContent
            };
            return updated;
          });

        } catch (err) {
          console.warn("Invalid JSON chunk:", chunk);
        }
      });
    } catch (error) {
      console.error("LLM error:", error);
      assistantContent = "Error: There was an error processing your request.";
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          content: assistantContent
        };
        return updated;
      });
    }

    const finalMessages = [
      ...messages,
      { role: 'user', content: userMessage },
      { role: 'assistant', content: assistantContent }
    ];

    syncToBackend(finalMessages);

    setIsSendEnabled(true);
  };

  const clearMessages = () => {
    setMessages([]);
  }


  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && bottomRef.current) {
      containerRef.current.scrollTop = bottomRef.current.offsetTop;
    }
  }, [messages]);


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

      <div className="ml-auto flex items-center space-x-2">
        <button
          onClick={clearMessages}
          className="text-red-400 hover:text-red-500 p-1 rounded hover:bg-gray-800
          flex-1 flex items-center justify-center px-3 py-2 rounded-md border text-sm text-white font-medium disabled:opacity-50"
          title="Clear Messages"
        >
          <Trash2 size={16} className="mr-2" />
          Clear Messages
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1" ref={containerRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-md max-w-[80%] text-sm ${msg.role === 'user'
                ? 'bg-gray-700 text-white ml-auto'
                : 'bg-blue-600 text-white mr-auto'
              }`}
          >
            <span className="font-bold">
              {msg.role === 'user' ? 'User: ' : 'Jarvis: '}
            </span>
            <div className="whitespace-pre-wrap">
              {msg.content.trim()}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
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
          disabled={!editableTranscript.trim() || !isSendEnabled}
          className="flex-1 flex items-center justify-center px-3 py-2 rounded-md border border-blue-400 bg-blue-600 text-sm text-white font-medium hover:bg-blue-500 disabled:opacity-50"
        >
          <Send size={16} className="mr-2" />
          Send to LLM
        </button>
      </div>
    </div>
  );
}
