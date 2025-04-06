import TPQ.task_priority_queue as TPQ
import LunarLink.LunarLink_Server as LunarLink
import LunarLink.LunarClient as client
import LLM.utils.ChatBot as ChatBot
import threading


from flask import Flask, jsonify

app = Flask(__name__)

# Initialize TPQ
tpq = TPQ.TaskPriorityQueue()

# Initialize LunarLink
lunar_link = LunarLink.LunarLink()
thread = threading.Thread(target=lunar_link.run)
thread.daemon = True
thread.start()
    
client.updateRover() 

@app.route('/pull_tpq/<n>', methods = ['GET'])
def pull_tpq(n = -1):
    ''' Retrieve the top n priority tasks from the TPQ, unspecified n will retrieve complete list '''
    if (n == -1):
        task_list = tpq.get_list
    else:
        task_list = tpq.peek(n)
    return jsonify(task_list)