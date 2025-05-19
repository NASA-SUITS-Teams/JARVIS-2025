import React, { useEffect, useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Terminal, Music4Icon, Send, Trash2, Pencil, Settings, MessageSquare } from "lucide-react";
import { askLLM, syncFromBackend, syncSettingsFromBackend, syncSettingsToBackend, syncToBackend } from "@/hooks/useLLM";

export default function LLMWidget() {
  const [response, setResponse] = useState("");
  const [isSendEnabled, setIsSendEnabled] = useState(true);
  const [showingSettings, setShowingSettings] = useState(false);

  const [activeFunctionEdit, setActiveFunctionEdit] = useState<{
    function_name: string;
    args: Record<string, string>;
  } | null>(null);
  const [resolveCurrentEdit, setResolveCurrentEdit] = useState<((confirmed: boolean, updatedArgs?: Record<string, string>) => void) | null>(null);

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


  const evtSource = new EventSource("http://127.0.0.1:8282/events");

  evtSource.onmessage = function (event) {
    console.log("Received:", event.data);
  };





  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    syncFromBackend().then(setMessages);
  }, []);


  const resolveCurrentEditRef = useRef<((confirmed: boolean, updatedArgs?: Record<string, string>) => void) | null>(null);

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

    const functionQueue: { function_name: string; args: Record<string, string> }[] = [];

    try {
      await askLLM(request, (chunk) => {
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const partial: Partial<LLMResponse> = JSON.parse(line);
            const isTool = partial.is_tool ?? false;

            if (!isTool) {
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
            } else {

              functionQueue.push({
                function_name: partial.function_name ?? "",
                args: partial.args ?? {},
              });
            }
          } catch (err) {
            console.warn("Invalid JSON chunk:", line);
          }
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

    for (const fnCall of functionQueue) {
      const { confirmed, args } = await waitForUserConfirmation(fnCall);

      if (confirmed) {
        console.log("User accepted", fnCall.function_name, args);
      } else {
        console.log("User denied", fnCall.function_name);
      }
    }

    const finalMessages = [
      ...messages,
      { role: 'user', content: userMessage },
      { role: 'assistant', content: assistantContent }
    ];

    syncToBackend(finalMessages);

    setIsSendEnabled(true);
  };

  const waitForUserConfirmation = (fnCall: {
    function_name: string;
    args: Record<string, string>;
  }) => {
    return new Promise<{ confirmed: boolean; args?: Record<string, string> }>((resolve) => {
      setActiveFunctionEdit(fnCall);
      resolveCurrentEditRef.current = (confirmed, updatedArgs) => {
        setActiveFunctionEdit(null);
        resolve({ confirmed, args: updatedArgs });
      };
    });
  };



  const clearMessages = () => {
    setMessages([]);
  }

  const handleEdit = (index: number) => {
    const edited = prompt('Edit the message:', messages[index].content);
    if (edited !== null) {
      const newMessages = [...messages];
      newMessages[index].content = edited.trim();
      setMessages(newMessages);
    }
  };

  const handleDelete = (index: number) => {
    const newMessages = messages.filter((_, i) => i !== index);
    setMessages(newMessages);
  };


  const dummyConfirm = (data: { function_name: string; args: Record<string, string> }) => {
    console.log("Confirmed:", data);
  };

  const dummyCancel = () => {
    console.log("Function call editing cancelled");
  };




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





  const SettingsIcon = !showingSettings ? Settings : MessageSquare;

  const [audioThreshold, setAudioThreshold] = useState(50);
  const [useRag, setUseRag] = useState(true);
  const [useTools, setUseTools] = useState(true);
  const [useThinking, setUseThinking] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const settings = await syncSettingsFromBackend();
      setAudioThreshold(Number(settings.audio_threshold));
      setUseRag(Boolean(settings.use_rag));
      setUseTools(Boolean(settings.use_tools));
      setUseThinking(Boolean(settings.use_thinking));
    };

    fetchSettings();
  }, []);


  const changeAudioThreshold = (newValue: number) => {
    const clamped = Math.min(100, Math.max(0, newValue));
    setAudioThreshold(clamped);
  };





  return (
    <div className="w-full h-full bg-gray-800 rounded-lg border border-blue-600 shadow-lg shadow-blue-500/10 overflow-hidden flex flex-col">
      <div className="bg-gray-700 p-2 border-b border-blue-600 flex items-center space-x-2 drag-handle hover:cursor-move">
        <Terminal size={18} className="text-blue-400" />
        <span className="font-bold">LLM INTERFACE</span>
      </div>

      {/* Top Buttons */}
      <div className="flex items-center justify-between space-x-2 w-full">
        {/* Settings Button */}
        <button
          onClick={() => setShowingSettings((prev) => 
          {
            if (prev == true) {
              syncSettingsToBackend(audioThreshold, useRag, useTools, useThinking);
            }

            return !prev
          }
          )}
          disabled={!isSendEnabled}
          className="text-white-400 hover:text-gray-800 p-1 rounded hover:bg-gray-400
          flex-1 flex items-center justify-center px-3 py-2 rounded-md border text-sm text-white font-medium disabled:opacity-50"
        >
          <SettingsIcon size={16} className="mr-2" />
          {!showingSettings ? "Settings" : "Show Chat"}
        </button>

        {/* Clear Messages Button */}
        {!showingSettings && (
          <button
            onDoubleClick={clearMessages}
            className="text-red-400 hover:text-white-500 p-1 rounded hover:bg-red-800
          flex-1 flex items-center justify-center px-3 py-2 rounded-md border text-sm text-white font-medium disabled:opacity-50"
          >
            <Trash2 size={16} className="mr-2" />
            Clear Messages
          </button>
        )}
      </div>

      {!showingSettings && (
        <>
          <div className="flex-1 overflow-y-auto space-y-3 pr-1" ref={containerRef}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`group relative p-2 rounded-md max-w-[80%] text-sm ${msg.role === 'user'
                  ? 'bg-gray-700 text-white ml-auto'
                  : 'bg-blue-600 text-white mr-auto'
                  }`}
              >

                {/* Action buttons */}
                <div className="absolute top-1 right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button onDoubleClick={() => handleEdit(index)} className="text-gray-300 hover:text-yellow-300 p-1 rounded hover:bg-black/10" title="Edit message">
                    <Pencil size={14} />
                  </button>
                  <button onDoubleClick={() => handleDelete(index)} className="text-gray-300 hover:text-red-400 p-1 rounded hover:bg-black/10" title="Delete message">
                    <Trash2 size={14} />
                  </button>
                </div>


                {/* Message content */}
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


          {activeFunctionEdit && (
            <div className="bg-gray-900 p-4 border border-blue-600 rounded-md mb-2 space-y-2">
              <div className="text-blue-300 font-semibold"></div>

              <div className="text-white text-sm">
                <label className="block mb-1 text-gray-400">Function Name</label>
                <input
                  className="w-full p-2 rounded-md bg-gray-800 border border-blue-500 text-white"
                  value={activeFunctionEdit.function_name}
                  onChange={(e) =>
                    setActiveFunctionEdit({
                      ...activeFunctionEdit,
                      function_name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                {Object.entries(activeFunctionEdit.args).map(([key, value]) => (
                  <div key={key} className="text-white text-sm">
                    <label className="block mb-1 text-gray-400">{key}</label>
                    <input
                      className="w-full p-2 rounded-md bg-gray-800 border border-blue-500 text-white"
                      value={value}
                      onChange={(e) =>
                        setActiveFunctionEdit((prev) =>
                          prev
                            ? {
                              ...prev,
                              args: { ...prev.args, [key]: e.target.value },
                            }
                            : prev
                        )
                      }
                    />
                  </div>
                ))}
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  className="flex-1 px-3 py-2 rounded-md bg-green-600 hover:bg-green-500 text-white font-medium text-sm"
                  onClick={() => {
                    if (resolveCurrentEditRef.current && activeFunctionEdit) {
                      dummyConfirm(activeFunctionEdit);
                      resolveCurrentEditRef.current(true, activeFunctionEdit.args);
                      resolveCurrentEditRef.current = null;
                    }
                  }}
                >
                  Confirm
                </button>

                <button
                  className="flex-1 px-3 py-2 rounded-md bg-red-600 hover:bg-red-500 text-white font-medium text-sm"
                  onClick={() => {
                    dummyCancel();
                    if (resolveCurrentEditRef.current) {
                      resolveCurrentEditRef.current(false);
                      resolveCurrentEditRef.current = null;
                    }
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}


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
        </>
      )}


      {/* Settings Page */}
      {showingSettings && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-xl p-4 shadow-md bg-gray w-full">
              <p className="text-sm font-medium mb-2">
                Audio Threshold (default: 50)
              </p>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={audioThreshold}
                  onChange={(e) => changeAudioThreshold(Number(e.target.value))}
                  className="w-full"
                />
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={audioThreshold}
                  onChange={(e) => changeAudioThreshold(Number(e.target.value))}
                  className="w-16 border px-2 py-1 rounded"
                />
              </div>
            </div>

            <div className="border rounded-xl p-4 shadow-md bg-gray w-full">
              <p className="text-sm font-medium mb-2">
                RAG (default: On)
              </p>
              <div className="flex items-center space-x-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useRag}
                    onChange={() => setUseRag((prev) => !prev)}
                    className="sr-only peer"
                  />
                  <div
                    className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 
                     peer-focus:ring-2 peer-focus:ring-green-300 transition-colors"
                  ></div>
                  <div
                    className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform 
                     peer-checked:translate-x-5"
                  ></div>
                </label>
                <span className="text-sm font-medium">{useRag ? "On" : "Off"}</span>
              </div>
            </div>

            <div className="border rounded-xl p-4 shadow-md bg-gray w-full">
              <p className="text-sm font-medium mb-2">
                Tools (default: On)
              </p>
              <div className="flex items-center space-x-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useTools}
                    onChange={() => setUseTools((prev) => !prev)}
                    className="sr-only peer"
                  />
                  <div
                    className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 
                     peer-focus:ring-2 peer-focus:ring-green-300 transition-colors"
                  ></div>
                  <div
                    className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform 
                     peer-checked:translate-x-5"
                  ></div>
                </label>
                <span className="text-sm font-medium">{useTools ? "On" : "Off"}</span>
              </div>
            </div>

            <div className="border rounded-xl p-4 shadow-md bg-gray w-full">
              <p className="text-sm font-medium mb-2">
                Thinking (default: Off)
              </p>
              <div className="flex items-center space-x-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useThinking}
                    onChange={() => setUseThinking((prev) => !prev)}
                    className="sr-only peer"
                  />
                  <div
                    className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 
                     peer-focus:ring-2 peer-focus:ring-green-300 transition-colors"
                  ></div>
                  <div
                    className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform 
                     peer-checked:translate-x-5"
                  ></div>
                </label>
                <span className="text-sm font-medium">{useThinking ? "On" : "Off"}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
