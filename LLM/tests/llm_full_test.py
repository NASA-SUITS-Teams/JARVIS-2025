from LLM.utils.ChatBot import CHAT_MODEL, ChatBot

chatbot = ChatBot(model=CHAT_MODEL, use_rag=True, use_tools=True)

while True:
    user = input("User: ")
    response = chatbot.get_response_stream(user, just_print=True)
