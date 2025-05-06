import argparse
from LLM.utils.ChatBot import CHAT_MODEL, ChatBot

parser = argparse.ArgumentParser()
parser.add_argument('--use_rag', action='store_true')
parser.add_argument('--use_tools', action='store_true')
args = parser.parse_args()

chatbot = ChatBot(model=CHAT_MODEL, use_rag=args.use_rag, use_tools=args.use_tools)

while True:
    user = input("User: ")
    response = chatbot.get_response_stream(user, just_print=True)
