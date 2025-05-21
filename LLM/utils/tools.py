from ollama._utils import convert_function_to_tool


def add_two_numbers(a: int, b: int):
    """
    Adds two numbers

    Args:
        a (int): The first number
        b (int): The second number
    """

    return int(a) + int(b)


def add_pin(x: float, y: float):
    """
    Adds a pin at location (x, y)

    Args:
        x (float): x coordinate
        y (float): y coordinate
    """

    pass



AVAILABLE_FUNCTIONS = {
    "add_two_numbers": add_two_numbers,
    "add_pin": add_pin,
}

TOOLS = list(AVAILABLE_FUNCTIONS.values())

all_tools_string = ""
all_tools = [str(convert_function_to_tool(tool).model_dump()) for tool in TOOLS]
ALL_TOOLS_STRING = "\n".join(all_tools)
