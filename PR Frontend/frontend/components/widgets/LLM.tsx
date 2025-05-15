import React, { useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Terminal, Music4Icon, Send } from "lucide-react";

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

  const handleSend = () => {
    // @TODO: implement the LLM API call here - Peter

    setResponse(`LLM Response to: "${editableTranscript}"`);
  };

  return (
    <div className="w-full h-full bg-gray-800 rounded-lg border border-blue-600 shadow-lg shadow-blue-500/10overflow-hidden flex flex-col">
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

        <textarea
          value={editableTranscript}
          onChange={(e) => setEditableTranscript(e.target.value)}
          placeholder="Your voice transcript will appear here."
          className="flex-1 p-2 rounded-md border border-blue-600 bg-gray-900 text-gray-200 overflow-auto text-sm resize-none"
        />

        <button
          onClick={handleSend}
          disabled={!editableTranscript.trim()}
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
