import openwakeword
import time
import numpy as np
import pyaudio

wakeword = openwakeword.Model(
    wakeword_models=["hey jarvis"], enable_speex_noise_suppression=True
)

audio = pyaudio.PyAudio()
mic_stream = audio.open(
    format=pyaudio.paInt16, channels=1, rate=16000, input=True, frames_per_buffer=3000
)

while True:
    audio_frame = np.frombuffer(
        mic_stream.read(3000, exception_on_overflow=False), dtype=np.int16
    )

    prediction = wakeword.predict(audio_frame)
    print(round(prediction["hey jarvis"], 2))

    if prediction["hey jarvis"] > 0.8:
        print("Hey Jarvis detected")
        input()
        mic_stream.read(mic_stream.get_read_available(), exception_on_overflow=False)
        print(mic_stream.get_read_available())

    time.sleep(0.1)
