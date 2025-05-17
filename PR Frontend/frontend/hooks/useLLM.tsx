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
