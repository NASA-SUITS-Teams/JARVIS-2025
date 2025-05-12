import openwakeword
import time
import numpy as np
import pyaudio

openwakeword.utils.download_models()


FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 16000
CHUNK = 2000
audio = pyaudio.PyAudio()
mic_stream = audio.open(
    format=FORMAT, channels=CHANNELS, rate=RATE, input=True, frames_per_buffer=CHUNK
)

owwModel = openwakeword.Model(
    wakeword_models=["hey jarvis"], enable_speex_noise_suppression=True
)

while True:
    audio_frame = np.frombuffer(mic_stream.read(CHUNK), dtype=np.int16)

    prediction = owwModel.predict(audio_frame)

    print(round(prediction["hey jarvis"], 2))

    if prediction["hey jarvis"] > 0.5:
        print("Hey Jarvis detected")
        input()
        mic_stream.read(mic_stream.get_read_available(), exception_on_overflow=False)
        print(mic_stream.get_read_available())

    time.sleep(0.1)
