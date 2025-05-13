from TTS.api import TTS
from faster_whisper import WhisperModel
import openwakeword
import time

from LLM.utils.ChatBot import CHAT_MODEL, ChatBot
from LLM.utils.audio import Audio, say

print("Setting up...")

openwakeword.utils.download_models()

owwModel = openwakeword.Model(
    wakeword_models=["hey jarvis"], enable_speex_noise_suppression=True
)

model = WhisperModel("small", compute_type="float32")

tts = TTS("tts_models/en/vctk/vits")

audio = Audio()


chatbot = ChatBot(model=CHAT_MODEL, use_rag=True, use_tools=True)


print("Ready!")
while True:
    chunk = audio.pop_audio_q()
    prediction = owwModel.predict(chunk)
    if prediction["hey jarvis"] > 0.5:
        print("Hey Jarvis detected")
        audio.stream.stop()

        audio_data = audio.record_until_silence(2, 10)

        text = audio.get_text_from_audio(audio_data, model)
        print(f"User: {text}")

        response = chatbot.get_response_stream("/no_think " + text, just_print=True)

        say(tts, response)

        audio.audio_q.clear()
        owwModel.reset()
        print("Ready!")

    time.sleep(0.1)
