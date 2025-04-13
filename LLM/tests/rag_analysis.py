from utils.rag import load_vectorstore

vectorstore = load_vectorstore()
print([len(a) for a in vectorstore.get()["documents"]])
