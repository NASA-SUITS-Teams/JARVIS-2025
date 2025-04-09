import chromadb
import requests
import json

from utils.rag import load_vectorstore


CHAT_MODEL = "gemma3:4b-it-q8_0"

SYSTEM_PROMPT = """
You are a helpful AI assistant named Jarvis, designed to support astronauts and mission control with clear and efficient communication. Your responses should be concise, accurate, and direct.

You should refer to yourself as Jarvis when asked your name or identity. Do not start every answer with "Jarvis:", but answer with your name when appropriate.

If you are unsure of an answer or lack sufficient data, clearly state that you do not know. Avoid unnecessary speculation.

Do not use formatting such as bold, italics, or emojis. Communicate clearly and naturally using only plain punctuation.
"""


class ChatBot:
    def __init__(self, model, use_rag=False):
        """Initialize ChatBot with OpenAI-type API"""
        self.base_url = "http://localhost:11434"
        self.model = model
        self.conversation_history = []
        self.context_id = None  # To track the context for KV cache persistence

        self.use_rag = use_rag
        if self.use_rag:
            self.vectorstore = load_vectorstore()
            self.client = chromadb.Client()

    def add_message(self, role, content):
        """Add a message to conversation history"""
        self.conversation_history.append({"role": role, "content": content})

    def get_recent_context(self, max_turns=1):
        context = ""
        for message in self.conversation_history[-(max_turns * 2 + 1) :]:
            role = message["role"]
            content = message["content"]

            if role == "user":
                context += f"User: {content}\n"
            elif role == "assistant":
                context += f"Jarvis: {content}\n"

        return context

    def get_response_stream(self, message, just_print=False):
        """Get a streaming response from OpenAI-type API and display as Markdown in real-time
        with KV caching support"""
        # Add user message to history
        self.add_message("user", message)

        # Prepare API request - use the generate endpoint for better cache control
        url = f"{self.base_url}/api/generate"

        # Format conversation history into a prompt
        prompt = ""
        for i, msg in enumerate(self.conversation_history):
            role = msg["role"]
            content = msg["content"]

            if (
                role == "user"
                and i == len(self.conversation_history) - 1
                and self.use_rag
            ):
                context = self.get_recent_context()
                rag_info = self.get_rag_info(context)

                if rag_info.strip():
                    prompt += f"\nRelevant information (optional):\n{rag_info}\n\nUser: {message}\n"
                else:
                    prompt += f"User: {message}\n"
            elif role == "user":
                prompt += f"User: {content}\n"
            elif role == "assistant":
                prompt += f"Jarvis: {content}\n"

        print(prompt)

        # Prepare payload with context for KV cache
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": True,
            "options": {
                "temperature": 0.6,  # Temperature parameter of softmax
                "num_ctx": 128000,  # Context window size in tokens
                "num_predict": 4096,  # Max tokens to predict
            },
        }

        # Add the context ID if we have one from a previous exchange
        if self.context_id:
            payload["context"] = self.context_id

        payload["system"] = SYSTEM_PROMPT

        # Initialize full response
        full_response = ""

        try:
            with requests.post(url, json=payload, stream=True) as response:

                # Process the streaming response line by line
                if just_print:
                    print("Jarvis: ", end="", flush=True)

                for line in response.iter_lines():
                    if line:
                        # Parse the JSON response
                        chunk = json.loads(line)

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

    def get_rag_info(self, prompt):
        retrieved_docs = self.vectorstore.similarity_search_with_score(prompt, k=3)

        doc_texts = []
        for doc, score in retrieved_docs:
            source = doc.metadata.get("source", "unknown")
            snippet = doc.page_content.strip()
            doc_texts.append(f"(Source: {source}) {snippet}")

        return "\n\n".join(doc_texts)

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
