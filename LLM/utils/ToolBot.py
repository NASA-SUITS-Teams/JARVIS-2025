import ollama
import requests
import json

from LLM.utils.rag import load_vectorstore


DEBUG = True

TOOL_MODEL = "llama3.2:latest"


def add_two_numbers(a: int, b: int) -> int:
    """
    Add two numbers

    Args:
      a (int): The first number
      b (int): The second number

    Returns:
      int: The sum of the two numbers
    """

    return int(a) + int(b)


class ToolBot:
    def __init__(self, model):
        """Initialize ChatBot with OpenAI-type API"""
        self.base_url = "http://localhost:11434"
        self.model = model

    def get_response_stream(self, message):
        options = {
            "temperature": 0.25,  # Temperature parameter of softmax
            "num_ctx": 128000,  # Context window size in tokens
            "num_predict": 4096,  # Max tokens to predict
        }
        messages = [
            {"role": "user", "content": message},
        ]
        tools = [add_two_numbers]
        # self.use_tools = True
        #        if self.use_tools:
        #            payload["tools"] = [
        #                {
        #                    "type": "function",
        #                    "function": {
        #                        "name": "add_two_numbers",
        #                        "description": "Add two numbers",
        #                        "parameters": {
        #                            "type": "object",
        #                            "required": ["a", "b"],
        #                            "properties": {
        #                                "a": {
        #                                    "type": "integer",
        #                                    "description": "The first integer number",
        #                                },
        #                                "b": {
        #                                    "type": "integer",
        #                                    "description": "The second integer number",
        #                                },
        #                            },
        #                        },
        #                    },
        #                }
        #            ]

        response = ollama.chat(
            model=self.model, messages=messages, options=options, tools=tools
        )

        available_functions = {
            "add_two_numbers": add_two_numbers,
        }

        for tool in response.message.tool_calls or []:
            function_to_call = available_functions.get(tool.function.name)
            if function_to_call:
                print("Function output:", function_to_call(**tool.function.arguments))
            else:
                print("Function not found:", tool.function.name)

        return None

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
        """Reset the conversation history"""
        self.conversation_history = []

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
