# Task Priority Queue (TPQ)

A Python implementation of a priority queue system designed for task management, with a focus on resource allocation and distance-based prioritization.

## Overview

The Task Priority Queue (TPQ) is a specialized data structure that organizes tasks based on their priority levels, resource requirements, and spatial proximity. It's particularly useful in scenarios where tasks need to be executed sequentially under resource constraints, such as rover missions or resource-limited operational environments.

## Features

- **Priority-based task scheduling**: Tasks are categorized as high, medium, or low priority
- **Resource management**: Tracks available oxygen and power resources
- **Distance-based weighting**: Considers proximity to task locations in priority calculations
- **Dynamic re-prioritization**: Adjusts task priorities based on changing resource levels
- **JSON import/export**: Save and load queue states from files

## Installation

Clone the repository or copy the `paste.txt` file to your project directory.

```bash
# No additional installation required beyond standard Python libraries
# The code uses only built-in modules: json and bisect
```

## Usage

### Basic Usage

```python
from task_priority_queue import TaskPriorityQueue

# Create a queue with default resources (oxygen=1, power=1)
tpq = TaskPriorityQueue()

# Add tasks manually
tpq.add_task("Sample Collection", 4.5)

# View highest priority tasks
top_tasks = tpq.peek(3)  # Returns the 3 highest priority tasks
print(top_tasks)

# Remove a specific task
tpq.remove_task("Sample Collection")
```

### Using the Data Feed Approach

```python
# Create a data map with task information
# Format: {task_name: (priority, oxygen_requirement, power_requirement, distance)}
data_map = {
    "Collect Rock Samples": ("high", 0.1, 0.1, 7),
    "Take Photos": ("medium", 0.01, 0.04, 4),
    "Soil Analysis": ("low", 0.02, 0.05, 1),
}

# Initialize queue with specific resource levels
tpq = TaskPriorityQueue(oxygen=0.5, power=0.8)

# Feed tasks from the data map
tpq.feed_from_data(data_map)

# Export queue to JSON
tpq.export_tpq('mission_tasks.json')
```

### Updating Resources

```python
# Update available resources (perhaps after task completion)
tpq.update_resources(oxygen=0.4, power=0.7)

# This will cause automatic reprioritization of tasks on next calculation
```

## How It Works

### Task Weighting System

Tasks are prioritized using a weighting system:

1. **Base Priority Weight**:

   - High priority tasks: 5 points
   - Medium priority tasks: 3 points
   - Low priority tasks: 1 point

2. **Distance Modifier**:

   - Distance ≤ 5 units: Up to 5 additional points (closer = more points)
   - Distance 6-10 units: Up to 3 additional points
   - Distance > 10 units: No additional points

3. **Resource Check**:
   - Tasks requiring more resources than available receive weight -1 (lowest priority)

### Internal Data Structure

The TPQ uses a sorted list with bisection insertion to maintain order. Each entry is stored as a tuple:

```
(weight, task_name)
```

The default task "Return to Rover" is always included with a weight of 0.

## API Reference

### Constructor

```python
TaskPriorityQueue(oxygen=1, power=1)
```

Creates a new TPQ instance with specified resource levels.

### Methods

- `calculate_weight(task_data)`: Calculates priority weight for a task
- `add_task(task_name, weight)`: Adds a task with specified weight
- `remove_task(task_name)`: Removes and returns specified task
- `peek(n=1)`: Returns n highest priority tasks without removing them
- `is_empty()`: Checks if queue is empty
- `import_tpq(file_path)`: Loads queue from JSON file
- `export_tpq(file_path)`: Saves queue to JSON file
- `feed_from_data(data_map)`: Imports tasks from a data dictionary
- `update_resources(oxygen, power)`: Updates available resources
- `size()`: Returns number of tasks in queue
- `get_list()`: Returns the internal task list

## Example

```python
from task_priority_queue import TaskPriorityQueue

# Initialize with limited resources
tpq = TaskPriorityQueue(oxygen=0.3, power=0.5)

# Create task data
tasks = {
    "Collect Samples": ("high", 0.1, 0.2, 3),
    "Take Photos": ("medium", 0.05, 0.1, 2),
    "Deploy Sensor": ("high", 0.15, 0.3, 8),
    "Return to Base": ("low", 0.01, 0.05, 12)
}

# Add tasks to queue
tpq.feed_from_data(tasks)

# Get highest priority task
print("Next task:", tpq.peek()[0][1])  # Access task name from tuple

# After completing a task, update resources
tpq.update_resources(oxygen=0.2, power=0.3)

# Export current queue state
tpq.export_tpq("mission_status.json")
```

## License

[Specify license information here]

## Contributing

[Add contribution guidelines if applicable]
