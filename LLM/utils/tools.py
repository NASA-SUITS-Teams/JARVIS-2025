from ollama._utils import convert_function_to_tool


def add_two_numbers(a: int, b: int):
    """
    Adds two numbers

    Args:
        a (int): The first number
        b (int): The second number
    """

    return int(a) + int(b)


def add_two_strings(a: str, b: str):
    """
    Adds two strings

    Args:
        a (str): The first string
        b (str): The second string
    """

    return str(a) + str(b)


def subtract_two_numbers(a: int, b: int):
    """
    Subtracts two numbers

    Args:
        a (int): The first number
        b (int): The second number
    """

    return int(a) - int(b)


AVAILABLE_FUNCTIONS = {
    "add_two_numbers": add_two_numbers,
    "add_two_strings": add_two_strings,
    "subtract_two_numbers": subtract_two_numbers,
}

TOOLS = list(AVAILABLE_FUNCTIONS.values())

all_tools_string = ""
all_tools = [str(convert_function_to_tool(tool).model_dump()) for tool in TOOLS]
ALL_TOOLS_STRING = "\n".join(all_tools)
