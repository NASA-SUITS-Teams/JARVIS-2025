import os
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import TextLoader
from langchain_chroma import Chroma
from langchain_ollama import OllamaEmbeddings


EMBEDDING_MODEL = "mxbai-embed-large"
PERSIST_DIRECTORY = "vectorstore"
folder_path = "documents/"

def create_vectorstore():
    PERSIST_DIRECTORY = "vectorstore"
    folder_path = "documents/"

    documents = []

    for file_name in os.listdir(folder_path):
        file_path = os.path.join(folder_path, file_name)
        if file_name.endswith(".txt"):
            loader = TextLoader(file_path, encoding="utf-8")
            documents.extend(loader.load())

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
    chunks = text_splitter.split_documents(documents)

    Chroma.from_documents(
        chunks,
        OllamaEmbeddings(model=EMBEDDING_MODEL),
        persist_directory=PERSIST_DIRECTORY
    )

def load_vectorstore():
    if not os.path.exists(PERSIST_DIRECTORY):
        print("Creating vectorstore...")
        create_vectorstore()
        print("Created vectorstore!")

    vectorstore = Chroma(
        embedding_function=OllamaEmbeddings(model=EMBEDDING_MODEL),
        persist_directory=PERSIST_DIRECTORY,
    )

    return vectorstore
