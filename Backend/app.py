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
from LunarLink import LunarLink_Server as LunarLink
from LunarLink import LunarClient as client
from Backend.tss import get_tss_data

# Init Flask app and global state
app = Flask(__name__)
CORS(app)
cmd_lst = [-1] * 165

tpq = TPQ.TaskPriorityQueue()
clientSocket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
tssSocket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
lunar_link = LunarLink.LunarLink(tpq, cmd_lst, "0.0.0.0")

# Background thread: updates rover commands from TSS
def update_rover_loop(ip="data.cs.purdue.edu", port=14141, interval=5):
    while True:
        for cmd_num in range(119, 167):
            data = get_tss_data(clientSocket=tssSocket, cmd_num=cmd_num, addr=(ip, port))
            lunar_link.jsonFile.update_command(cmd_num, data[2][0])
        time.sleep(interval)

@app.route('/', methods=['GET'])
def santiy():
    return jsonify({"status": "ok", "message": "Backend is running"}), 200

# Flask API routes
@app.route('/get_data', methods=['GET'])
def get_data():
    tpq_data = [
        {
            "name": t.name,
            "priority": t.priority.name,
            "timestamp": t.timestamp.isoformat(),
        }
        for t in tpq.peek(n=len(tpq))
    ]

    # WHAT MAP DATA NEEDS TO LOOK LIKE
    """
    map_data = [
        {
            "name": element.name,
            "type": element.type,
            "status": element.status,
            "position": element.position
        }
        for element in __
    ]"""

    # WHAT ALERT DATA NEEDS TO LOOK LIKE
    """
    alert_data = [
        {
            "name": alert.name,
            "description": alert.description,
            "type": alert.type,
            "time": alert.time,
        }
        for alert in __
    ]"""

    # this is technically the start of the real response, but I'm using some fake data below
    """return jsonify({
        "tssData": cmd_lst,
        "mapData": {},
        "alertData": [],
        "tpqData": tpq_data
    })"""

    # Placeholder
    tpq_data = [
        { "name": "Oxygen level maintenance", "priority": 5, "timestamp": "00:01:30"},
        { "name": "Sample #2 scan incomplete", "priority": 5, "timestamp": "00:01:30"},
        { "name": "Oxygen level maintenance", "priority": 5, "timestamp": "00:01:30"},
        { "name": "Oxygen level maintenance", "priority": 5, "timestamp": "00:01:30"},
    ]

    # Placeholder
    map_data = [
        { "name": "eva-1", "status": "active", "type": "eva", "position": [2, 4] },
        { "name": "eva-2", "status": "active", "type": "eva", "position": [6, 6] },
        { "name": "pr-1",  "status": "active", "type": "pr",  "position": [4, 5] },
        { "name": "poi-1", "status": "active", "type": "poi", "position": [1, 1] },
        { "name": "poi-2", "status": "active", "type": "poi", "position": [7, 2] },
    ]

    # Placeholder
    alert_data = [
        { "name": "Low O2 Warning", "description": "Tank level below 50%", "time": "00:06:02" },
        { "name": "Sample #2 Scan Incomplete", "description": "Return to Sample #2", "time": "00:05:37" },
    ]

    return jsonify({
        "tssData": cmd_lst,
        "mapData": map_data,
        "alertData": alert_data,
        "tpqData": tpq_data
    })

@app.route('/add_task/', methods=['POST'])
def add_task():
    task_name = request.form.get('task_name')
    priority = request.form.get('priority')
    if task_name and priority is not None:
        tpq.add_task(task_name, int(priority))
        return jsonify({"status": "task added"}), 200
    return jsonify({"error": "Missing task_name or priority"}), 400

# @TODO add routes for LLM


# Start threads and server
if __name__ == "__main__":
    threading.Thread(target=lunar_link.server_loop, daemon=True).start()
    threading.Thread(target=update_rover_loop, daemon=True).start()

    app.run(debug=True, use_reloader=False, host="0.0.0.0", port=8282)
