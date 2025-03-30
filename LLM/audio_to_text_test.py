from faster_whisper import WhisperModel
import speech_recognition as sr
from io import BytesIO

model = WhisperModel("small", compute_type="float32") 

r = sr.Recognizer()
r.pause_threshold = 2

with sr.Microphone() as source:
    print('Calibrating...')
    r.adjust_for_ambient_noise(source)

    while True:

        print('Listening...')
        audio = r.listen(source)

        audio_data = audio.get_wav_data()

        audio_file = BytesIO(audio_data)

        print('Processing...')
        segments, _ = model.transcribe(audio_file, log_progress=True)

        text = ""
        for segment in segments:
            text += segment.text

        print(text)
        print()
