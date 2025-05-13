from collections import deque
from io import BytesIO
import numpy as np
import sounddevice as sd
import speech_recognition as sr

DEBUG = True

SAMPLE_RATE = 16000
CHUNK = 2000

audio_q = deque()


def audio_callback(indata, frames, time_info, status):
    audio_q.append(indata.copy())


def create_stream():
    stream = sd.InputStream(
        samplerate=SAMPLE_RATE,
        channels=1,
        dtype="int16",
        blocksize=CHUNK,
        callback=audio_callback,
    )
    stream.start()
    return stream


def calibrate_recognizer(recognizer):
    if DEBUG:
        print("Calibrating...")

    with sr.Microphone() as source:
        recognizer.adjust_for_ambient_noise(source)


def get_audio_data(recognizer, phrase_time_limit=None):
    if DEBUG:
        print("Listening...")

    with sr.Microphone() as source:
        audio = recognizer.listen(source, phrase_time_limit=phrase_time_limit)

        audio_data = audio.get_wav_data()

        return audio_data


def get_text_from_audio(audio_data, transcribe_model):

    audio_file = BytesIO(audio_data)

    if DEBUG:
        print("Processing...")

    segments, _ = transcribe_model.transcribe(audio_file)

    text = "".join(segment.text for segment in segments)

    return text


def say(tts, text):
    if text == "":
        return

    audio_data = tts.tts(text, "p230")

    # from tts.synthesizer.output_sample_rate
    samplerate = int(22050 * 0.95)
    sd.play(np.array(audio_data), samplerate=samplerate)
    sd.wait()
