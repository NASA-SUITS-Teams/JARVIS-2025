import sys
import os
import threading
import socket
import time
from flask import Flask, request, jsonify
from flask_cors import CORS

# Add root path for other modules like TPQ, LunarLink, etc
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from TPQ import task_priority_queue as TPQ
from Backend.tss import fetch_tss_json_data
from Backend.lunarlink import fetch_lunarlink_json_data, send_lunarlink_data
from Pathfinding.pathfinding import find_path
from Alerts.alerts import get_alerts

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
    map_data = [
        { "name": "poi-1", "status": "active", "type": "poi", "position": [-5766.5, -10200.1] },
        { "name": "poi-2", "status": "active", "type": "poi", "position": [-5666.5, -10100.1] },
        { "name": "pin-1", "status": "active", "type": "pin", "position": [-5766.5, -10400.1] },
        { "name": "pin-2", "status": "active", "type": "pin", "position": [-5966.5, -10300.1] },
    ]

    #path = find_path((-5766.5, -10200.1), (-5966.5, -10300.1))
    #print("Calculated path:", path)

    alert_data = get_alerts(tss_data.get("ROVER_TELEMETRY", {}).get("pr_telemetry", {}))
    
    return jsonify({
        "tssData": tss_data,
        "mapData": map_data,
        "alertData": alert_data,
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



# @TODO add routes for LLM


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
