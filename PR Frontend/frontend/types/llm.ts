type LLMResponse = {
    response: string;
    is_thinking: boolean;
    is_tool: boolean;
    function_name: string;
    args: Record<string, string>;
};

type LLMRequest = {
    input: string
    enable_thinking: boolean;
    enable_rag: boolean;
    enable_tools: boolean;
};

type ChatMessage = {
  role: string;
  content: string;
};
