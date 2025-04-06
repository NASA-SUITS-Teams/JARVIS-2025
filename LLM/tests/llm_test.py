from utils.ChatBot import ChatBot

chatbot = ChatBot(model="gemma3:4b-it-q8_0")

while True:
    user = input("User: ")
    response = chatbot.get_response_stream(user, just_print=True)
