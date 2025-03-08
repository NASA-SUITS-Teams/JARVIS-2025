# Code for task priority queue (TPQ)
# The TPQ will be stored in a sorted list, with each task being stored 
# as a tuple (weight, task_name). The sorted list is organized 
# based on the weight assigned to each task. High priority tasks have a 
# starting weight of 5, while medium tasks have weight of 3, and low 
# tasks have weight of 1. Data will be fed into the TPQ based on a
# data dictionary that has a task corresponding to a tuple containing
# various lists. 

import json
from bisect import insort

class TaskPriorityQueue:
    def __init__(self):
        # Initialize the priority queue list, sorted by task weight (lowest first)
        # Each entry is of the form (weight, task_name)
        self.tpq_list = [(0, "Return to Rover")]
        self.weight_map = {"Return to Rover" : 0}

        # Properties to keep track of leftover oxygen and power
        self.oxygen = 7
        self.power = 7
        

    # task_data = (priority, oxygen_req, power_req, distance_to_task)
    def calculate_weight(self, task_data):
        """Return the corresponding weight for the task."""

        # If the power or oxygen requirements aren't met, move to bottom of list
        if task_data[1] >= self.oxygen:
            return -1
        if task_data[2] >= self.power:
            return -1
        
        weight = 0
        if task_data[0] == "high":
            weight += 5
        elif task_data[0] == "medium":
            weight += 3
        elif task_data[0] == "low":
            weight += 1
        else:
            raise ValueError(f"Unknown task priority: {task_data[0]}")
        
        # TODO: Add in weight calculation for distance to task
        if task_data[3] <= 5:
            weight += 4
            weight += 1 - task_data[3]/5
        elif task_data[3] <= 10:
            weight += 2
            weight += 1 - task_data[3]/10
        
        return weight
    
    def add_task(self, task_name, weight):
        """Add a task with the given task type to the priority queue."""
        # Insert task into sorted list (low to high)
        insort(self.tpq_list, (weight, task_name))
        self.weight_map[task_name] = weight

    def remove_task(self, task_name):
        """Remove and return the matching task from the queue."""
        # Search for task and remove it
        weight = self.weight_map[task_name]
        self.tpq_list.remove([weight, task_name])

        return task_name

    def peek(self, n=1):
        """Return the n highest-priority tasks without removing them."""
        if self.is_empty():
            return None
        return self.tpq_list[self.size() - n:]

    def is_empty(self):
        """Check if the priority queue is empty."""
        return len(self.tpq_list) == 0

    def import_tpq(self, file_path):
        """Import tasks from a JSON file into the priority queue."""
        with open(file_path, 'r') as file:
            self.tpq_list = json.load(file)

    def export_tpq(self, file_path):
        """Export the priority queue to a JSON file."""
        with open(file_path, 'w') as file:
            json.dump(self.tpq_list, file, indent=4)

    def feed_from_data(self, data_map):
        """
        Feed tasks into the TPQ based on a data dictionary that maps
        task names to tuples containing task details.
        """
        for task_name, task_data in data_map.items():
            weight = self.calculate_weight(task_data)
            self.add_task(task_name, weight)
    
    def update_resources(self, oxygen, power):
        self.oxygen = oxygen
        self.power = power

    def size(self):
        """Return the number of tasks in the priority queue."""
        return len(self.tpq_list)

    def get_list(self):
        return self.tpq_list
    
# Example usage:

# Example data_map structure - each task corresponds to a tuple containing (priority, required oxygen, required power):
data_map = {
    "Task A": ("high", 10, 10, 7),
    "Task B": ("medium", 1, 4, 4),
    "Task C": ("low", 2, 5, 1),
}

# Create an instance of TaskPriorityQueue
tpq = TaskPriorityQueue()

# Feed tasks from the data_map
tpq.feed_from_data(data_map)

# Peek at the highest-priority task
print("Top Priority Task:", tpq.peek())

# Export the priority queue to a JSON file
tpq.export_tpq('tpq.json')

# Import the priority queue from a JSON file
tpq.import_tpq('tpq.json')

# Remove and print the highest-priority task
removed_task = tpq.remove_task("Task A")
print("Removed Task:", removed_task)

tpq.export_tpq('tpq1.json')