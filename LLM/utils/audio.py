from io import BytesIO
import numpy as np
import sounddevice as sd
import speech_recognition as sr

DEBUG = True


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

    text = ""
    for segment in segments:
        text += segment.text

    return text


def say(tts, text):
    audio_data = tts.tts(text, "p230")

    sd.play(np.array(audio_data), samplerate=22050)
    sd.wait()
