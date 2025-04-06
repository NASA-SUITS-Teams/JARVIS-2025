import chromadb

from utils.ChatBot import ChatBot
from utils.rag import load_vectorstore

vectorstore = load_vectorstore()
client = chromadb.Client()

chatbot = ChatBot(model="gemma3:4b-it-q8_0")

while True:
    user = input("User: ")
    retriever = vectorstore.as_retriever()
    retrieved_docs = retriever.invoke(user, k=3)
    doc_data = " ".join([doc.page_content for doc in retrieved_docs])

    content = f"""Respond to the prompt based on the following context:

    {doc_data}

    Prompt: {user}
    """
    print(f"Retrieved {len(retrieved_docs)} documents.")

    response = chatbot.get_response_stream(content, just_print=True)
