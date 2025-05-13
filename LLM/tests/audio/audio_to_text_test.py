from faster_whisper import WhisperModel
import speech_recognition as sr

from LLM.utils.audio import Audio

model = WhisperModel("small", compute_type="float32")


audio = Audio()


while True:
    audio_data = audio.record_until_silence(2, 10)

    text = audio.get_text_from_audio(audio_data, model)

    print(f"User:{text}")
