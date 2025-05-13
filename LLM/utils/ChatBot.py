import re
import chromadb
import requests
import json

from LLM.utils.ToolBot import TOOL_MODEL, ToolBot
from LLM.utils.rag import load_vectorstore
from LLM.utils.tools import ALL_TOOLS_STRING


DEBUG = False

CHAT_MODEL = "qwen3:4b-q8_0"

SYSTEM_PROMPT = """
You are a helpful AI assistant named Jarvis, designed to support astronauts and mission control with clear and efficient communication. Do not overthink. Your responses should be concise, accurate, and direct, offering relevant information in a conversational tone.

If you are unsure of an answer or lack sufficient data, clearly state that you are speculating but give your best advice.

Do not use any formatting. Communicate clearly and naturally using only plain punctuation.
"""


class ChatBot:
    def __init__(self, model, use_rag=False, use_tools=False):
        """Initialize ChatBot with OpenAI-type API"""
        self.base_url = "http://localhost:11434"
        self.model = model
        self.messages = []

        self.use_rag = use_rag
        if self.use_rag:
            self.vectorstore = load_vectorstore()
            self.client = chromadb.Client()

        self.use_tools = use_tools
        if self.use_tools:
            self.toolbot = ToolBot(model=TOOL_MODEL)
            self.add_message("user", "Hello")
            self.add_message(
                "assistant",
                "Greetings. How may I assist you today?",
            )
            self.add_message("user", "What is 5 + 3 and 3 - 1?")
            self.add_message(
                "assistant",
                "Let me call two functions to assist you.\n\n<functions>\nadd_two_numbers(a=5, b=3)\nsubtract_two_numbers(a=3, b=1)\n</functions>",
            )

    def add_message(self, role, content):
        self.messages.append({"role": role, "content": content})

    def get_recent_context(self):
        context = "\n".join([message["content"] for message in self.messages[-2:]])

        if DEBUG:
            print("-" * 7)
            print("Context:\n")
            print(context)
            print("-" * 7)

        return context

    def get_response_stream(self, message, just_print=False):
        """Get a streaming response from OpenAI-type API and display in real-time"""
        # Add user message to history
        self.add_message("user", message)

        # Prepare API request
        url = f"{self.base_url}/api/chat"

        if self.use_rag:
            context = self.get_recent_context()

            rag_info = []

            doc_texts, doc_ids = self.get_rag_info(context, k=2)
            rag_info.append(doc_texts)
            doc_texts, doc_ids = self.get_rag_info(message, k=2, ignore_ids=doc_ids)
            rag_info.append(doc_texts)

            rag_info = "\n\n".join(rag_info)
            rag_info = f"Relevant information (optional):\n{rag_info}\n\n"

        if DEBUG:
            print("-=" * 7)
            print("messages:")
            print(self.messages)
            print("-=" * 7)

        # Prepare payload
        payload = {
            "model": self.model,
            "stream": True,
            "options": {
                "num_predict": 4096,  # Max tokens to predict
            },
        }

        system_messages = []

        if self.use_rag:
            system_messages.append({"role": "user", "content": rag_info})

        if self.use_tools:
            tools_message = ""
            tools_message += "If you need more information or there are any functions that relevant to the context do not overthink. Instead, explain which function you are calling and at the end of your response suggest them in a block of '<functions>' in the format `function_name(arg1, arg2)` and type '</functions>' when you are done suggesting functions. At the end of your response, only suggest functions when they are truly necessary for the current context.\n"
            tools_message += "\n" + "Optional functions:\n" + ALL_TOOLS_STRING

            system_messages.append({"role": "system", "content": tools_message})

        system_messages.append({"role": "system", "content": SYSTEM_PROMPT})

        payload["messages"] = system_messages + self.messages

        if DEBUG:
            print(payload["messages"])

        full_response = ""

        try:
            # Process the streaming response line by line
            with requests.post(url, json=payload, stream=True) as response:

                if just_print:
                    print("Jarvis: ", end="", flush=True)

                for line in response.iter_lines():
                    if line:
                        # Parse the JSON response
                        chunk = json.loads(line)
                        message = chunk["message"]

                        if "content" in message:
                            content = message["content"]
                            full_response += content

                            if just_print:
                                print(content, end="", flush=True)

                        if "done" in chunk and chunk["done"]:
                            break

            if just_print:
                print()

            full_response = re.sub(r"<think>(\n|.)*</think>", "", full_response).strip()

            match = re.search(r"<functions>((\n|.)*)</functions>", full_response)
            if match:
                function_calls = match.group(1).strip()
                if DEBUG:
                    print(f"CALLING FUNCTIONS: {function_calls}")

                response = self.toolbot.get_response_stream(
                    f"/no_think Call these functions:\n{function_calls}"
                )
                if just_print:
                    print(response)

                self.add_message("system", response)

            full_response = re.sub(
                r"<functions>(\n|.)*</functions>", "", full_response
            ).strip()
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
