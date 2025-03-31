import requests
import json

class ChatBot:
    def __init__(self, model):
        """Initialize ChatBot with OpenAI-type API"""
        self.base_url = "http://localhost:11434"
        self.model = model
        self.conversation_history = []
        self.context_id = None  # To track the context for KV cache persistence

    def add_message(self, role, content):
        """Add a message to conversation history"""
        self.conversation_history.append({"role": role, "content": content})

    def get_response_stream(self, message, system_prompt=None, just_print=False):
        """Get a streaming response from OpenAI-type API and display as Markdown in real-time
        with KV caching support"""
        # Add user message to history
        self.add_message("user", message)

        # Prepare API request - use the generate endpoint for better cache control
        url = f"{self.base_url}/api/generate"

        # Build the prompt from conversation history
        if not self.conversation_history:
            prompt = message
        else:
            # Format conversation history into a prompt
            prompt = ""
            for msg in self.conversation_history:
                role = msg["role"]
                content = msg["content"]
                if role == "user":
                    prompt += f"User: {content}\n"
                elif role == "assistant":
                    prompt += f"Assistant: {content}\n"

        # Prepare payload with context for KV cache
        payload = {
            "model": self.model,
            "prompt": message,  # Current message
            "stream": True,
            "options": {
                "temperature": 0.6,  # Temperature parameter of softmax
                "num_ctx": 4096,  # Context window size in tokens
                "num_predict": 4096  # Max tokens to predict
            }
        }

        # Add the context ID if we have one from a previous exchange
        if self.context_id:
            payload["context"] = self.context_id

        # Add system prompt if provided
        if system_prompt:
            payload["system"] = system_prompt

        # Initialize full response
        full_response = ""

        try:
            with requests.post(url, json=payload, stream=True) as response:

                # Process the streaming response line by line
                if just_print:
                    print("JARIVS: ", end="", flush=True)

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