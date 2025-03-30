from faster_whisper import WhisperModel
import speech_recognition as sr
from io import BytesIO

model = WhisperModel("small", compute_type="float32") 

r = sr.Recognizer()

while True:
    try:
        with sr.Microphone() as source:
            r.adjust_for_ambient_noise(source, duration=0.2)

            print('Listening...')
            audio = r.listen(source)

            audio_data = audio.get_wav_data()

            audio_file = BytesIO(audio_data)

            print('Processing...')
            segments, _ = model.transcribe(audio_file)

            text = ""
            for segment in segments:
                text += segment.text

            print(text)
            print()

    except sr.RequestError as e:
        print("Error:", e)
