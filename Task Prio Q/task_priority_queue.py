# Code for task priority queue (TPQ)
# The TPQ will be stored in a sorted list, with each task being stored 
# as a tuple (task_name, weight). The sorted list is organized 
# based on the weight assigned to each task. High priority tasks have a 
# starting weight of 5, while medium tasks have weight of 3, and low 
# tasks have weight of 1. Data will be fed into the TPQ based on a
# data dictionary that has a task corresponding to a tuple containing
# various lists. 

import json
from bisect import insort

class TaskPriorityQueue:
    def __init__(self):
        # Initialize the priority queue list, sorted by task weight (highest first)
        self.tpq_list = []

    def _get_weight(self, task_type):
        """Return the corresponding weight for the task type."""
        if task_type == "critical":
            return 5
        elif task_type == "medium":
            return 3
        elif task_type == "basic":
            return 1
        else:
            raise ValueError(f"Unknown task type: {task_type}")

    def add_task(self, task_name, task_type):
        """Add a task with the given task type to the priority queue."""
        weight = self._get_weight(task_type)
        task_tuple = (task_name, weight)
        # Insert task into sorted list (highest priority first)
        insort(self.tpq_list, (-weight, task_name))  # Negative weight for reverse sorting

    def remove_task(self):
        """Remove and return the highest-priority task from the queue."""
        if self.is_empty():
            return None
        # Return the task with the highest priority (largest weight)
        return self.tpq_list.pop(0)

    def peek(self):
        """Return the highest-priority task without removing it."""
        if self.is_empty():
            return None
        return self.tpq_list[0]

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
        for task_name, (task_type, *other_data) in data_map.items():
            self.add_task(task_name, task_type)

    def size(self):
        """Return the number of tasks in the priority queue."""
        return len(self.tpq_list)

# Example usage:

# Example data_map structure:
data_map = {
    "Task A": ("critical", [1, 2], ["some", "data"]),
    "Task B": ("medium", [3, 4], ["other", "info"]),
    "Task C": ("basic", [5, 6], ["more", "data"]),
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
removed_task = tpq.remove_task()
print("Removed Task:", removed_task)

