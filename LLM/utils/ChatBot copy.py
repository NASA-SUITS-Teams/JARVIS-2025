import chromadb
import requests
import json

from LLM.utils.rag import load_vectorstore


DEBUG = True

CHAT_MODEL = "gemma3:4b-it-q8_0"
CHAT_MODEL = "llama3.2:latest"

SYSTEM_PROMPT = """
You are a helpful AI assistant named Jarvis, designed to support astronauts and mission control with clear and efficient communication. Your responses should be concise, accurate, and direct, offering relevant information in a conversational tone.

If you are unsure of an answer or lack sufficient data, clearly state that you are speculating but give your best advice.

Do not use formatting such as bold, italics, or emojis. Communicate clearly and naturally using only plain punctuation.
"""


def add_two_numbers(a: int, b: int) -> int:
    """
    Add two numbers

    Args:
      a (int): The first number
      b (int): The second number

    Returns:
      int: The sum of the two numbers
    """

    # The cast is necessary as returned tool call arguments don't always conform exactly to schema
    # E.g. this would prevent "what is 30 + 12" to produce '3012' instead of 42
    return int(a) + int(b)


class ChatBot:
    def __init__(self, model, use_rag=False, use_tools=False):
        """Initialize ChatBot with OpenAI-type API"""
        self.base_url = "http://localhost:11434"
        self.model = model
        self.conversation_history = []
        self.context_id = None  # To track the context for KV cache persistence

        self.use_rag = use_rag
        if self.use_rag:
            self.vectorstore = load_vectorstore()
            self.client = chromadb.Client()

        self.use_tools = use_tools

    def add_message(self, role, content):
        """Add a message to conversation history"""
        self.conversation_history.append({"role": role, "content": content})

    def get_recent_context(self):
        context = "\n".join(
            [message["content"] for message in self.conversation_history[-2:]]
        )

        if DEBUG:
            print("-" * 7)
            print("Context:\n")
            print(context)
            print("-" * 7)

        return context

    def get_response_stream(self, message, just_print=False):
        """Get a streaming response from OpenAI-type API and display in real-time
        with KV caching support"""
        # Add user message to history
        self.add_message("user", message)

        # Prepare API request - use the generate endpoint for better cache control
        url = f"{self.base_url}/api/generate"

        prompt = ""
        if self.use_rag:
            context = self.get_recent_context()

            rag_info = []

            doc_texts, doc_ids = self.get_rag_info(context, k=2)
            rag_info.append(doc_texts)
            doc_texts, doc_ids = self.get_rag_info(message, k=2, ignore_ids=doc_ids)
            rag_info.append(doc_texts)

            rag_info = "\n\n".join(rag_info)

            if rag_info.strip():
                prompt += f"Relevant information (optional):\n{rag_info}\n\n"

        # Format conversation history into a prompt
        prompt += "Chat history:\n"
        for msg in self.conversation_history[-5:]:
            role = msg["role"]
            content = msg["content"]

            if role == "user":
                prompt += f"User: {content}\n"
            elif role == "assistant":
                prompt += f"Jarvis: {content}\n"
        prompt += "Jarvis: "

        if DEBUG:
            print("-=" * 7)
            print("Prompt:\n")
            print(prompt)
            print("-=" * 7)

        # Prepare payload with context for KV cache
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": True,
            "options": {
                "temperature": 0.25,  # Temperature parameter of softmax
                "num_ctx": 128000,  # Context window size in tokens
                "num_predict": 4096,  # Max tokens to predict
            },
        }

        self.use_tools = True
        if self.use_tools:
            payload["tools"] = [
                {
                    "type": "function",
                    "function": {
                        "name": "get_current_weather",
                        "description": "Get the current weather for a location",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "location": {
                                    "type": "string",
                                    "description": "The location to get the weather for, e.g. San Francisco, CA",
                                },
                                "format": {
                                    "type": "string",
                                    "description": "The format to return the weather in, e.g. 'celsius' or 'fahrenheit'",
                                    "enum": ["celsius", "fahrenheit"],
                                },
                            },
                            "required": ["location", "format"],
                        },
                    },
                }
            ]

        # Add the context ID if we have one from a previous exchange
        if self.context_id:
            payload["context"] = self.context_id

        payload["system"] = SYSTEM_PROMPT

        # Initialize full response
        full_response = ""

        try:
            print(payload)
            with requests.post(url, json=payload, stream=True) as response:

                # Process the streaming response line by line
                if just_print:
                    print("Jarvis: ", end="", flush=True)

                for line in response.iter_lines():
                    if line:
                        # Parse the JSON response
                        chunk = json.loads(line)
                        # print(chunk.keys())

                        if "tool_calls" in chunk:
                            for call in chunk["tool_calls"]:
                                if call["name"] == "add_two_numbers":
                                    args = call["args"]
                                    result = add_two_numbers(**args)
                                    print(f"\nFunction Result: {result}")
                                    # Optionally feed this back into the conversation

                        # Extract the content from the chunk - different format in generate API
                        if "response" in chunk:
                            content = chunk["response"]
                            full_response += content

                            if just_print:
                                print(content, end="", flush=True)

                        # Store the context for KV cache persistence
                        if "context" in chunk:
                            self.context_id = chunk["context"]

                        # Check if this is the done message
                        if "done" in chunk and chunk["done"]:
                            break

            if just_print:
                print()

            # Add assistant response to history
            self.add_message("assistant", full_response)

            return full_response

        except requests.exceptions.ConnectionError:
            error_msg = "Error: Could not connect to Ollama. Make sure it is running with 'ollama serve'"
            print(error_msg)
            return error_msg
        except Exception as e:
            error_msg = f"Error: {str(e)}"
            print(error_msg)
            return error_msg

    def get_rag_info(self, prompt, k, ignore_ids=[]):
        retrieved_docs = self.vectorstore.similarity_search_with_relevance_scores(
            prompt, k=k + len(ignore_ids)
        )

        doc_texts = []
        doc_ids = []
        for doc, score in retrieved_docs:
            if len(doc_texts) == k:
                break

            if doc.id in ignore_ids:
                if DEBUG:
                    print("SAME ID", doc.id, ignore_ids)

                continue

            source = doc.metadata.get("source", "unknown")
            snippet = doc.page_content.strip()
            doc_texts.append(f"(Source: {source}) {snippet}")
            doc_ids.append(doc.id)

        return "\n\n".join(doc_texts), doc_ids

    def reset_conversation(self):
        """Reset the conversation history and clear the KV cache context"""
        self.conversation_history = []
        self.context_id = None  # Clear the context to start fresh

    def get_conversation_history(self):
        """Display conversation history with markdown formatting for assistant responses"""
        print("\n----- Conversation History -----\n")
        for message in self.conversation_history:
            role = "You" if message["role"] == "user" else "Assistant"

            if role == "Assistant":
                print(f"{role}:")
                print(message["content"])
            else:
                print(f"{role}: {message['content']}")
            print("---")
        print("\n-------------------------------\n")
