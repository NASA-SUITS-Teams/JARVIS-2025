type LLMResponse = {
    is_thinking: boolean;
    is_done: boolean;
    response: string;
};


// type for functions

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