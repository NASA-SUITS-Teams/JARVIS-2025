import TPQ.task_priority_queue as TPQ
import LunarLink.LunarLink_Server as LunarLink
import LunarLink.LunarClient as client
# import LLM.utils.ChatBot as ChatBot
from GeneralAPI.api import get_tss_data
import threading
import socket
import time

from flask import Flask, request, jsonify

app = Flask(__name__)

if __name__ == "__main__":
    # Initialize TSS connection
    URL = "data.cs.purdue.edu"
    PORT = 14141
    clientSocket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    
    # Initialize TPQ
    tpq = TPQ.TaskPriorityQueue()
    
    lunar_link = LunarLink.LunarLink("0.0.0.0")
    server_thread = threading.Thread(target=lunar_link.server_loop)
    server_thread.daemon = True
    server_thread.start()

    update_thread = threading.Thread(target=lunar_link.updateRover_loop)
    update_thread.daemon = True
    update_thread.start()

    # Start Flask app
    app.run(debug=True, use_reloader=False, host="0.0.0.0")

@app.route('/pull_tpq/<n>', methods = ['GET'])
def pull_tpq(n = -1):
    ''' Retrieve the top n priority tasks from the TPQ, unspecified n will retrieve complete list '''
    if (n == -1):
        task_list = tpq.get_list
    else:
        task_list = tpq.peek(n)
    return jsonify(task_list)

@app.route('/add_task/', methods = ['POST'])
def push_tpq():
    ''' Add task from front end to TPQ '''
    task_name = request.form.get('task_name')
    priority = request.form.get('priority')
    # TODO: read distance and add_task

@app.route('/pull_EVA', methods = ['GET'])
def pull_EVA_Coords():
    ''' Retrieve the EVAs location '''
    eva1_x, eva1_y, _, eva2_x, eva2_y = lunar_link.jsonFile.commandList[17:22]
    return jsonify([eva1_x, eva1_y, eva2_x, eva2_y])

    
