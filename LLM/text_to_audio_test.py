import numpy as np
import sounddevice as sd
from TTS.api import TTS

tts = TTS("tts_models/en/vctk/vits")

audio_data = tts.tts("Good morning @channel! See you all at the meeting today at 12:30!", 'p230')

sd.play(np.array(audio_data), samplerate=22050)
sd.wait()
