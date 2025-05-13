import openwakeword
import time

from LLM.utils.audio import audio_q, create_stream

openwakeword.utils.download_models()

owwModel = openwakeword.Model(
    wakeword_models=["hey jarvis"], enable_speex_noise_suppression=True
)


stream = create_stream()


while True:
    if len(audio_q) == 0:
        time.sleep(0.1)
        continue

    chunk = audio_q.pop()

    prediction = owwModel.predict(chunk)

    print(round(prediction["hey jarvis"], 2))

    if prediction["hey jarvis"] > 0.5:
        print("Hey Jarvis detected")
        stream.stop()
        input()
        audio_q.clear()
        stream.start()
        owwModel.reset()

    time.sleep(0.1)
