import json
import queue
import signal
import sys
import threading
import time
from faster_whisper import WhisperModel
from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS
import openwakeword


# set root path to parent folder to access other modules
sys.path.append("..")

from LLM.utils.audio import Audio
from LLM.utils.ChatBot import ChatBot
from Backend.tss import fetch_tss_json_data
from Backend.lunarlink import fetch_lunarlink_json_data, send_lunarlink_data
from Pathfinding.pathfinding import find_path

# Init Flask app and global state
app = Flask(__name__)
CORS(app)

# Init global variables
tss_data = {}
lunarlink_data = {}
pin_data = []

@app.route('/', methods=['GET'])
def santiy():
    return jsonify({"status": "ok", "message": "Backend is running"}), 200

# Fetch all TSS data and other related information from subteams
@app.route('/get_data', methods=['GET'])
def get_data():
    # calculate the best path using the current rover position and the goal position
    current_position = (tss_data['ROVER_TELEMETRY']['pr_telemetry']['current_pos_x'], tss_data['ROVER_TELEMETRY']['pr_telemetry']['current_pos_y'])
    if len(pin_data) == 0:
        path = []
    else: # Note: goal position is currently calculated based on the most previous pin position
        # get the lastest pin position and calculate the path
        lastest_pin = pin_data[-1]['position']
        try:
            path = find_path(current_position, lastest_pin)    
        except Exception as e:
            print(f"Error finding path: {e}")
            path = []

    return jsonify({
        "tssData": tss_data,
        "pinData": pin_data,
        "lunarlinkData": lunarlink_data,
        "pathData": path
    })

# Send rover data to AetherNet (LunarLink)
@app.route('/lunarlink', methods=['GET'])
def lunarlink():
  json_response = send_lunarlink_data(tss_data, pin_data)
  return jsonify(json_response)

# Add a pin to the map
@app.route('/add_pin', methods=['POST'])
def add_pin():
    global pin_data
    data = request.get_json()
    pin_position = data.get('position')

    if pin_position:
        # add to pin_data
        pin_data.append({
            "name": "Default Pin Name",
            "position": pin_position,
            "timestamp": time.time()
        })

        return jsonify({"status": "Pin added"}), 200
    
    return jsonify({"error": "Missing name, position, or type"}), 400

# Reset all pins on the map
@app.route('/reset_pins', methods=['POST'])
def reset_pins():
    global pin_data
    pin_data = []
    return jsonify({"status": "All pins reset"}), 200



chatbot = ChatBot(model="qwen3:4b-q8_0", use_rag=True, use_tools=True, use_thinking=False, FLASK=True)
@app.route('/llm_response_stream', methods=['POST'])
def stream_response():
    data = request.get_json()["request"]
    prompt = data.get("input")

    def generate():
        try:
            for is_tool, message, tool in chatbot.get_response_stream(prompt, just_print=False):
                if not is_tool:
                    is_thinking, content = message
                    yield json.dumps({
                        "response": content,
                        "is_thinking": is_thinking,
                        "is_tool": False,
                    }) + "\n"
                else:
                    function_name, args = tool
                    yield json.dumps({
                        "is_tool": True,
                        "function_name": function_name,
                        "args": args,
                    }) + "\n"
        except Exception as e:
            yield json.dumps({
                "response": f"Error: {str(e)}",
                "is_thinking": False,
                "is_tool": False,
            }) + "\n"

    return Response(stream_with_context(generate()))

@app.route('/save_chat_history', methods=['POST'])
def save_chat_history():
    data = request.get_json()
    messages = data.get("chat_history", [])

    chatbot.messages = messages

    return jsonify({"status": "ok"}), 200

@app.route('/load_chat_history', methods=['GET'])
def load_chat_history():

    return jsonify({"chat_history": chatbot.messages})


@app.route('/save_settings', methods=['POST'])
def save_settings():
    data = request.get_json()
    settings = data.get("settings", [])

    chatbot.use_rag = settings["use_rag"]
    chatbot.use_tools = settings["use_tools"]
    chatbot.use_thinking = settings["use_thinking"]

    return jsonify({"status": "ok"}), 200

@app.route('/load_settings', methods=['GET'])
def load_settings():

    settings = {
        "audio_threshold": 50,
        "use_rag": chatbot.use_rag,
        "use_tools": chatbot.use_tools,
        "use_thinking": chatbot.use_thinking,
    }

    return jsonify({"settings": settings})


# Update all TSS data every 10 seconds
def update_tss_loop():
    global tss_data

    while True:
        tss_data = fetch_tss_json_data()

        time.sleep(1) # poll every 3 seconds

# Update lunarlink data every 10 seconds, including EVA, etc
def update_lunarlink_loop():
    global lunarlink_data

    while True:
        lunarlink_data = fetch_lunarlink_json_data()

        time.sleep(10)  # poll every 10 seconds



event_queue = queue.Queue()

stop_event = threading.Event()

def signal_handler(sig, frame):
    stop_event.set()
    print("Stopping...")
    sys.exit(1)

signal.signal(signal.SIGINT, signal_handler)


def listen():
    model = WhisperModel("small", compute_type="float32")
    openwakeword.utils.download_models()

    owwModel = openwakeword.Model(
        wakeword_models=["hey jarvis"],
        enable_speex_noise_suppression=True,
        inference_framework="onnx"
    )

    audio = Audio()

    while not stop_event.is_set():
        chunk = audio.pop_audio_q()
        if chunk is None:
            continue

        prediction = owwModel.predict(chunk)

        if prediction["hey jarvis"] > 0.5:
            print("Hey Jarvis detected")
            audio.stream.stop()

            event_queue.put("Listening")

            audio_data = audio.record_until_silence(2, 10)
            text = audio.get_text_from_audio(audio_data, model)

            event_queue.put(text)

            audio.audio_q.clear()
            owwModel.reset()

        time.sleep(0.1)


@app.route('/events')
def event():
    def event_stream():
        while not stop_event.is_set():
            try:
                message = event_queue.get(timeout=1)
                yield f"data: {message}\n\n"
            except queue.Empty:
                continue

    return Response(stream_with_context(event_stream()), mimetype='text/event-stream')



# Start threads and server
if __name__ == "__main__":
    threading.Thread(target=update_tss_loop, daemon=True).start()
    #threading.Thread(target=update_lunarlink_loop, daemon=True).start()

    threading.Thread(target=listen, daemon=True).start()

    app.run(debug=True, use_reloader=False, host="localhost", port=8282)
