import openwakeword
import time
import sounddevice as sd

from collections import deque

openwakeword.utils.download_models()


audio_q = deque()


def audio_callback(indata, frames, time_info, status):
    audio_q.append(indata.copy())


SAMPLE_RATE = 16000
CHUNK = 2000
stream = sd.InputStream(
    samplerate=SAMPLE_RATE,
    channels=1,
    dtype="int16",
    blocksize=CHUNK,
    callback=audio_callback,
)
stream.start()

owwModel = openwakeword.Model(
    wakeword_models=["hey jarvis"], enable_speex_noise_suppression=True
)

while True:
    if len(audio_q) == 0:
        time.sleep(0.1)
        continue

    chunk = audio_q.pop()

    prediction = owwModel.predict(chunk)

    print(round(prediction["hey jarvis"], 2))

    if prediction["hey jarvis"] > 0.5:
        print("Hey Jarvis detected")
        input()
        audio_q.clear()
        owwModel.reset()

    time.sleep(0.1)
