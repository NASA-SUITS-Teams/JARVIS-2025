import vosk
import pyaudio
import json

TRIGGER_WORD = "jarvis"

model_path = "LLM/models/vosk-model-en-us-0.22"
model = vosk.Model(model_path)
recognizer = vosk.KaldiRecognizer(model, 16000)

mic = pyaudio.PyAudio()
stream = mic.open(
    format=pyaudio.paInt16, channels=1, rate=16000, input=True, frames_per_buffer=8192
)
stream.start_stream()

print("Listening...")

try:
    while True:
        data = stream.read(4096, exception_on_overflow=False)
        if recognizer.AcceptWaveform(data):
            result = json.loads(recognizer.Result())
            text = result.get("text", "").lower()
            if text:
                print("Recognized:", text)
            if TRIGGER_WORD in text:
                print(f"\nTrigger word '{TRIGGER_WORD}' detected in final result!")
                recognizer.Reset()
                input()
        else:
            partial = json.loads(recognizer.PartialResult())
            partial_text = partial.get("partial", "").lower()
            if TRIGGER_WORD in partial_text:
                print(f"\nTrigger word '{TRIGGER_WORD}' detected in partial result!")
                recognizer.Reset()
                input()
            elif partial_text:
                print("Partial:", partial_text, end="\r")
except KeyboardInterrupt:
    print("\nStopping...")
finally:
    stream.stop_stream()
    stream.close()
    mic.terminate()
