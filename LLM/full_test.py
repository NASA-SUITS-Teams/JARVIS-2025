# pip install coqui-tts
from TTS.api import TTS
import speech_recognition as sr
from faster_whisper import WhisperModel

from utils.ChatBot import ChatBot
from utils.audio import get_text_from_audio, calibrate_recognizer, say


model = WhisperModel("medium", compute_type="float32") 

r = sr.Recognizer()
r.pause_threshold = 2
calibrate_recognizer(r)

tts = TTS("tts_models/en/vctk/vits")

chatbot = ChatBot(model="gemma3:1b-it-q8_0")


while True:

    input("Press enter then speak")
    text = get_text_from_audio(r, model)
    print(f"User: {text}")
    response = chatbot.get_response_stream(text, "You are a helpful AI assistant named JARVIS. Answer as you would in a normal conversation in only short text with no emojis.", just_print=True)
    say(tts, response)
