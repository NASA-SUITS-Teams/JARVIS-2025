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
