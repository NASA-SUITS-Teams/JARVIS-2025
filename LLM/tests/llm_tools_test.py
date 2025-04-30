from LLM.utils.ChatBot import CHAT_MODEL, ChatBot
#from LLM.utils.ToolBot import TOOL_MODEL, ToolBot

chatbot = ChatBot(model=CHAT_MODEL, use_tools=True)
#toolbot = ToolBot(model=TOOL_MODEL)

while True:
    user = input("User: ")
    response = chatbot.get_response_stream(user, just_print=True)
