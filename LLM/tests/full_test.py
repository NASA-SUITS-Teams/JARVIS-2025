from TTS.api import TTS
import speech_recognition as sr
from faster_whisper import WhisperModel
import chromadb

from utils.ChatBot import ChatBot
from utils.audio import get_audio_data, get_text_from_audio, calibrate_recognizer, say
from utils.ChatBot import ChatBot
from utils.rag import load_vectorstore

vectorstore = load_vectorstore()
client = chromadb.Client()

model = WhisperModel("small", compute_type="float32")

r = sr.Recognizer()
r.pause_threshold = 2
calibrate_recognizer(r)

tts = TTS("tts_models/en/vctk/vits")

chatbot = ChatBot(model="gemma3:4b-it-q8_0")


while True:

    input("Press enter then speak")
    audio_data = get_audio_data(r)
    user = get_text_from_audio(audio_data, model)
    print(f"User:{user}")

    retriever = vectorstore.as_retriever()
    retrieved_docs = retriever.invoke(user, k=3)
    doc_data = " ".join([doc.page_content for doc in retrieved_docs])

    content = f"""Respond to the prompt based on the following context:

    {doc_data}

    Prompt: {user}
    """

    response = chatbot.get_response_stream(content, just_print=True)
    say(tts, response)
