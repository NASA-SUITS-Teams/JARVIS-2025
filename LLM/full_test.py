# pip install coqui-tts
from TTS.api import TTS
import speech_recognition as sr
from faster_whisper import WhisperModel

from utils.ChatBot import ChatBot
from utils.audio import get_audio_data, get_text_from_audio, calibrate_recognizer, say


model = WhisperModel("small", compute_type="float32") 

r = sr.Recognizer()
r.pause_threshold = 2
calibrate_recognizer(r)

tts = TTS("tts_models/en/vctk/vits")

chatbot = ChatBot(model="gemma3:4b-it-q8_0")


while True:

    input("Press enter then speak")
#    r.pause_threshold = 1
#    audio_data = get_audio_data(r, 3)
#    text = get_text_from_audio(audio_data, model)
#    print(f"Heard:{text.lower()}")
#    if not "jarvis" in text.lower():
#        continue
#    r.pause_threshold = 2

    audio_data = get_audio_data(r)
    text = get_text_from_audio(audio_data, model)
    print(f"User:{text}")
    response = chatbot.get_response_stream(text, just_print=True)
    say(tts, response)
