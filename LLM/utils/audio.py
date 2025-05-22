from collections import deque
from io import BytesIO
import io
import time
import numpy as np
import sounddevice as sd
import speech_recognition as sr
import soundfile as sf

DEBUG = False

SAMPLE_RATE = 16000
CHUNK = 2000


class Audio:

    def __init__(self):
        self.stream = sd.InputStream(
            samplerate=SAMPLE_RATE,
            channels=1,
            dtype="int16",
            blocksize=CHUNK,
            callback=self.audio_callback,
        )

        self.audio_q = deque()

        self.recognizer = sr.Recognizer()
        self.energy_threshold = self.calibrate_recognizer()

        self.isListening = False

    def audio_callback(self, indata, frames, time_info, status):
        self.audio_q.append(indata.copy())

    def pop_audio_q(self):
        i = 0
        while len(self.audio_q) == 0:
            i += 1
            if i == 10:
                print("Timed out waiting for audio.")
                return None

            time.sleep(0.1)

        return self.audio_q.pop()

    def calibrate_recognizer(self):
        if DEBUG:
            print("Calibrating...")

        with sr.Microphone() as source:
            self.recognizer.adjust_for_ambient_noise(source)
            energy_threshold = self.recognizer.energy_threshold

            if DEBUG:
                print(f"Energy threshold set to: {energy_threshold}")

            return energy_threshold

    def record_until_silence(self, silence_sec, max_sec):

        if DEBUG:
            print("Listening...")

        recorded = []

        start_time = time.time()
        silence_start = time.time()

        self.isListening = True
        while True:
            if self.isListening == False:
                break

            chunk = self.pop_audio_q()

            amplitude = np.abs(chunk).mean()

            recorded.append(chunk)

            if DEBUG:
                print(
                    f"Total time: {round(time.time() - start_time, 2)} Time since silence: {round(time.time() - silence_start, 2)}"
                )

            if amplitude < self.energy_threshold:
                if time.time() - silence_start >= silence_sec:
                    if DEBUG:
                        print("Silence duration exceeded, stopping.")
                    break
            else:
                silence_start = time.time()

            if time.time() - start_time >= max_sec:
                if DEBUG:
                    print("Max record time reached.")
                break
        self.isListening = False

        recorded = np.array(recorded)
        if recorded.size == 0:
            return recorded
        return np.concatenate(recorded, axis=0)

    def get_text_from_audio(self, audio_data, transcribe_model):

        self.stream.stop()

        buffer = io.BytesIO()
        sf.write(buffer, audio_data, SAMPLE_RATE, format="WAV")
        buffer.seek(0)

        if DEBUG:
            print("Processing...")

        segments, _ = transcribe_model.transcribe(buffer)

        text = "".join(segment.text for segment in segments)

        self.stream.start()

        return text.strip()


def say(tts, text, blocking=True):
    if text == "":
        return

    audio_data = tts.tts(text, "p230")

    # from tts.synthesizer.output_sample_rate
    samplerate = int(22050 * 0.95)
    sd.play(np.array(audio_data).astype(np.float32), samplerate=samplerate, blocking=blocking)
