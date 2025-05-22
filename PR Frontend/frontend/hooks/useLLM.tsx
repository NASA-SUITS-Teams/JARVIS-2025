export const askLLM = async (
    request: LLMRequest,
    onChunk: (chunk: string) => void
): Promise<void> => {
    const response = await fetch("http://localhost:8282/llm_response_stream", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ request }),
    });

    if (!response.body) {
        throw new Error("No response body");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        onChunk(chunk);
    }
};

export const syncToBackend = async (chatHistory: ChatMessage[]) => {
  await fetch("http://localhost:8282/save_chat_history", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_history: chatHistory }),
  });
};

export const syncFromBackend = async (): Promise<ChatMessage[]> => {
  const res = await fetch("http://localhost:8282/load_chat_history");
  const data = await res.json();
  return data.chat_history ?? [];
};


export const syncSettingsToBackend = async (audioThreshold: number, useRag: boolean, useTools: boolean, useThinking: boolean, enableAudio: boolean, contextK: number, messageK: number) => {
  await fetch("http://localhost:8282/save_settings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ "settings": {
      "audio_threshold": audioThreshold,
      "use_rag": useRag,
      "use_tools": useTools,
      "use_thinking": useThinking,
      "enable_audio": enableAudio,
      "context_k": contextK,
      "message_k": messageK,
    } }),
  });
};

export const syncSettingsFromBackend = async (): Promise<Record<string, string>> => {
  const res = await fetch("http://localhost:8282/load_settings");
  const data = await res.json();
  return data.settings ?? [];
};

export const abortChat = async () => {
  await fetch("http://localhost:8282/abort_chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  });
};

export const stopListeningWhisper = async () => {
  await fetch("http://localhost:8282/stop_listening", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  });
};
