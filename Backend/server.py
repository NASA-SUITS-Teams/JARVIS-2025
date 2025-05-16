import json
import sys
import os
import threading
import socket
import time
from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS
import requests

# Add root path for other modules like TPQ, LunarLink, etc
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from LLM.utils.ChatBot import ChatBot
from TPQ import task_priority_queue as TPQ
from Backend.tss import fetch_tss_json_data
from Backend.lunarlink import fetch_lunarlink_json_data, send_lunarlink_data
from Pathfinding.pathfinding import find_path

# Init Flask app and global state
app = Flask(__name__)
CORS(app)

# Init global variables
tss_data = {}
lunarlink_data = {}

@app.route('/', methods=['GET'])
def santiy():
    return jsonify({"status": "ok", "message": "Backend is running"}), 200

# Fetch all TSS data and other related information from subteams
@app.route('/get_data', methods=['GET'])
def get_data():    
    # Placeholder
    tpq_data = [
        { "name": "Oxygen level maintenance", "priority": 5, "timestamp": "00:01:30"},
        { "name": "Sample #2 scan incomplete", "priority": 5, "timestamp": "00:01:30"},
        { "name": "Oxygen level maintenance", "priority": 5, "timestamp": "00:01:30"},
        { "name": "Oxygen level maintenance", "priority": 5, "timestamp": "00:01:30"},
    ]

    # Placeholder
    pin_data = [
        { "name": "pin-1", "status": "active", "type": "pin", "position": [-5766.5, -10140.1] },
        { "name": "pin-2", "status": "active", "type": "pin", "position": [-5966.5, -10300.1] },
    ]

    #path = find_path((-5766.5, -10200.1), (-5966.5, -10300.1))
    #print("Calculated path:", path)
    
    return jsonify({
        "tssData": tss_data,
        "pinData": pin_data,
        "lunarlinkData": lunarlink_data
    })

# Send rover data to AetherNet (LunarLink)
@app.route('/lunarlink', methods=['GET'])
def lunarlink():
  json_response = send_lunarlink_data(tss_data)
  return jsonify(json_response)

# Add a pin to the map

# Add a command to the task priority queue
@app.route('/add_task/', methods=['POST'])
def add_task():
    task_name = request.form.get('task_name')
    priority = request.form.get('priority')
    if task_name and priority is not None:
        tpq.add_task(task_name, int(priority))
        return jsonify({"status": "task added"}), 200
    return jsonify({"error": "Missing task_name or priority"}), 400



chatbot = ChatBot(model="qwen3:4b-q8_0", use_rag=False, use_tools=False)
# @TODO add routes for LLM
@app.route('/llm_response_stream', methods=['POST'])
def stream_response():
    data = request.get_json()
    prompt = data.get("transcript")

    def generate():
        try:
            for chunk in chatbot.get_response_stream(prompt, just_print=False):
                yield f"data: {json.dumps({'response': chunk})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return Response(stream_with_context(generate()), mimetype="text/event-stream")


# Update all TSS data every 10 seconds
def update_tss_loop():
    global tss_data

    while True:
        tss_data = fetch_tss_json_data()

        time.sleep(10) # poll every 10 seconds

# Update lunarlink data every 10 seconds, including EVA, etc
def update_lunarlink_loop():
    global lunarlink_data

    while True:
        lunarlink_data = fetch_lunarlink_json_data()

        time.sleep(10)  # poll every 10 seconds


# Start threads and server
if __name__ == "__main__":
    threading.Thread(target=update_tss_loop, daemon=True).start()
    #threading.Thread(target=update_lunarlink_loop, daemon=True).start()

    app.run(debug=True, use_reloader=False, host="0.0.0.0", port=8282)
