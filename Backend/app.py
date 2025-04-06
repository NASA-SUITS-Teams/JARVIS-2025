import TPQ.task_priority_queue as TPQ
import LunarLink.LunarLink_Server as LunarLink
import LLM.utils.ChatBot as ChatBot


from flask import Flask, jsonify

app = Flask(__name__)

# Initialize TPQ
tpq = TPQ.TaskPriorityQueue()

# Initialize Lunar Link
lunar_link = LunarLink.LunarLink()

@app.route('/pull_tpq/<n>', methods = ['GET'])
def pull_tpq(n = -1):
    ''' Retrieve the top n priority tasks from the TPQ, unspecified n will retrieve complete list '''
    if (n == -1):
        task_list = tpq.get_list
    else:
        task_list = tpq.peek(n)
    return jsonify(task_list)