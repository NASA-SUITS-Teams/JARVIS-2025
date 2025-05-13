import openwakeword
import time

from LLM.utils.audio import Audio

openwakeword.utils.download_models()

owwModel = openwakeword.Model(
    wakeword_models=["hey jarvis"], enable_speex_noise_suppression=True
)


audio = Audio()


while True:

    chunk = audio.pop_audio_q()

    prediction = owwModel.predict(chunk)

    print(round(prediction["hey jarvis"], 2))

    if prediction["hey jarvis"] > 0.5:
        print("Hey Jarvis detected")
        audio.stream.stop()
        input()
        audio.audio_q.clear()
        owwModel.reset()

    time.sleep(0.1)
