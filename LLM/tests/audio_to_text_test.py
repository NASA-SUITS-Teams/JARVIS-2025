from faster_whisper import WhisperModel
import speech_recognition as sr

from utils.audio import calibrate_recognizer, get_audio_data, get_text_from_audio

model = WhisperModel("small", compute_type="float32") 

r = sr.Recognizer()
r.pause_threshold = 2
calibrate_recognizer(r)

while True:
    audio_data = get_audio_data(r)
    text = get_text_from_audio(audio_data, model)
    print(f"User:{text}")
