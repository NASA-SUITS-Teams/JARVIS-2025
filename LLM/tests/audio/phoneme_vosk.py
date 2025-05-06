import vosk
import pyaudio
import json
import pronouncing
import Levenshtein


def get_phonemes(word):
    phones = pronouncing.phones_for_word(word)
    return phones[0] if phones else ""


def phrase_to_phonemes(phrase):
    words = phrase.lower().split()
    phonemes = []
    for word in words:
        phones = pronouncing.phones_for_word(word)
        if phones:
            phonemes.extend(phones[0].split())
    return phonemes


def phoneme_similarity_sliding(full, target, threshold=0.7):
    len_target = len(target)
    best_score = 0
    for i in range(0, len(full) - len_target + 1):
        window = full[i : i + len_target]
        distance = Levenshtein.distance(" ".join(window), " ".join(target))
        norm_score = 1 - distance / max(len(" ".join(window)), len(" ".join(target)))
        best_score = max(best_score, norm_score)
        if norm_score >= threshold:
            return True, norm_score
    return False, best_score


TRIGGER_WORD = "hey jarvis"
TRIGGER_PHONES = phrase_to_phonemes(TRIGGER_WORD)
THRESHOLD = 0.7


model = vosk.Model("LLM/models/vosk-model-en-us-0.22")
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
            words = text.split()
        else:
            partial = json.loads(recognizer.PartialResult())
            text = partial.get("partial", "").lower()
            words = text.split()

        phrase = text
        if phrase:
            phrase_phones = phrase_to_phonemes(phrase)
            match, score = phoneme_similarity_sliding(
                phrase_phones, TRIGGER_PHONES, threshold=THRESHOLD
            )
            print(" ".join(TRIGGER_PHONES))
            print(phrase)
            print(" ".join(phrase_phones))
            print(round(score, 2))
            if match:
                print("\nTrigger detected")
                recognizer.Reset()
                input()
            print("-" * 7)

except KeyboardInterrupt:
    print("\nStopping...")
finally:
    stream.stop_stream()
    stream.close()
    mic.terminate()
