import React, { useState, useRef, useEffect } from "react";
import { Terminal, Music4Icon, Send } from "lucide-react";

export default function LLMWidget() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recog = new SpeechRecognition();
    recog.continuous = true;
    recog.interimResults = true;
    recog.lang = "en-US";

    recog.onstart = () => {
      setListening(true);
    };

    recog.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        finalTranscript += event.results[i][0].transcript;
      }
      setTranscript(finalTranscript.trim());
    };

    recog.onerror = (event: any) => {
      console.warn("Speech recognition error", event.error);
      // If it fails due to “no-speech”, just restart
      if (event.error === "no-speech" && listening) {
        recog.start();
      }
    };

    recog.onend = () => {
      // Auto-restart if still “listening”
      if (listening) {
        recog.start();
      } else {
        // truly stopped
        setListening(false);
      }
    };

    recognitionRef.current = recog;
  }, [listening]);

  const startListening = () => {
    if (recognitionRef.current && !listening) {
      setTranscript("");
      setResponse("");
      recognitionRef.current.start();
      // setListening(true) will happen in onstart
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && listening) {
      // this will trigger onend → setListening(false)
      recognitionRef.current.stop();
    }
  };

  const handleSend = () => {
    setResponse(`LLM Response to: "${transcript}"`);
  };

  return (
    <div className="w-full h-full bg-gray-800 rounded-lg border border-blue-600 shadow-lg shadow-blue-500/20 overflow-hidden flex flex-col">
      <div className="bg-gray-700 p-2 border-b border-blue-600 flex items-center space-x-2 drag-handle hover:cursor-move">
        <Terminal size={18} className="text-blue-400" />
        <span className="font-bold">LLM INTERFACE</span>
      </div>

      <div className="flex-1 p-2 flex flex-col space-y-2">
        {!listening ? (
          <button
            onClick={startListening}
            className="flex items-center px-3 py-2 rounded-md border border-blue-400 bg-blue-900/50 text-sm text-blue-100 font-medium hover:bg-blue-800"
          >
            <Music4Icon size={16} className="mr-2" />
            Start Listening
          </button>
        ) : (
          <button
            onClick={stopListening}
            className="flex items-center px-3 py-2 rounded-md border border-red-400 bg-red-900/50 text-sm text-red-100 font-medium hover:bg-red-800"
          >
            <Music4Icon size={16} className="mr-2 animate-pulse text-red-400" />
            Stop Listening
          </button>
        )}

        <div className="flex-1 p-2 rounded-md border border-blue-600 bg-gray-900 text-gray-200 overflow-auto text-sm">
          {transcript || (
            <span className="text-gray-500">
              Your voice transcript will appear here.
            </span>
          )}
        </div>

        <button
          onClick={handleSend}
          disabled={!transcript}
          className="flex items-center justify-center p-2 rounded-md border border-blue-400 bg-blue-600 text-sm text-white font-medium hover:bg-blue-500 disabled:opacity-50"
        >
          <Send size={16} className="mr-2" />
          Send to LLM
        </button>

        <div className="p-2 rounded-md border border-blue-600 bg-gray-900 text-gray-200 overflow-auto text-sm">
          {response || (
            <span className="text-gray-500">
              LLM response will appear here.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
