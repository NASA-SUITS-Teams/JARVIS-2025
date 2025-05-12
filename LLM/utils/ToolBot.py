import ollama

from LLM.utils.tools import AVAILABLE_FUNCTIONS, TOOLS, ALL_TOOLS_STRING


DEBUG = False

TOOL_MODEL = "qwen3:4b-q8_0"

class ToolBot:
    def __init__(self, model):
        self.model = model

        if DEBUG:
            print(ALL_TOOLS_STRING)

    def get_response_stream(self, message):
        options = {
            "num_predict": 4096,  # Max tokens to predict
        }
        messages = [
            {"role": "user", "content": message},
        ]
        response = ollama.chat(
            model=self.model, messages=messages, options=options, tools=TOOLS
        )

        outputs = []
        for tool in response.message.tool_calls or []:
            function_name = tool.function.name
            args = tool.function.arguments
            if DEBUG:
                print(f"{function_name} {args}")

            function_to_call = AVAILABLE_FUNCTIONS.get(function_name)
            output = ""
            if function_to_call:
                output += f"{function_name} {args} "
                try:
                    output += f"Function output: {function_to_call(**args)}"
                except Exception as e:
                    output += f"ERROR: {e}"
            else:
                output += f"Function not found: {tool.function.name}"
            outputs.append(output)

        full_response = "\n".join(outputs)

        return full_response
