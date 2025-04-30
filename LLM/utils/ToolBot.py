import ollama

from LLM.utils.tools import AVAILABLE_FUNCTIONS, TOOLS, ALL_TOOLS_STRING


DEBUG = False

TOOL_MODEL = "llama3.2:latest"


class ToolBot:
    def __init__(self, model):
        self.model = model

        if DEBUG:
            print(ALL_TOOLS_STRING)

    def get_response_stream(self, message):
        options = {
            "temperature": 0.25,  # Temperature parameter of softmax
            "num_ctx": 128000,  # Context window size in tokens
            "num_predict": 4096,  # Max tokens to predict
        }
        messages = [
            {"role": "user", "content": message},
        ]
        response = ollama.chat(
            model=self.model, messages=messages, options=options, tools=TOOLS
        )

        full_response = ""
        for tool in response.message.tool_calls or []:
            function_name = tool.function.name
            args = tool.function.arguments
            if DEBUG:
                print(f"{function_name} {args}")

            function_to_call = AVAILABLE_FUNCTIONS.get(function_name)
            if function_to_call:
                try:
                    full_response += f"Function output: {function_to_call(**args)}"
                except Exception as e:
                    full_response += f"ERROR: {e}"
            else:
                full_response += f"Function not found: {tool.function.name}"

        return full_response
