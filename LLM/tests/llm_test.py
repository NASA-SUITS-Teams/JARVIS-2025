from utils.ChatBot import CHAT_MODEL, ChatBot

chatbot = ChatBot(model=CHAT_MODEL)

while True:
    user = input("User: ")
    response = chatbot.get_response_stream(user, just_print=True)
