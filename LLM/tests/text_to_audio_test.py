from TTS.api import TTS

from utils.audio import say

tts = TTS("tts_models/en/vctk/vits")

while True:

    response = input('Type something to say: ')

    say(tts, response)
