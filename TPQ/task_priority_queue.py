from datetime import datetime
from enum import IntEnum
from bisect import insort

class Priority(IntEnum):
    MAX = 0
    HIGH = 1
    MEDIUM = 2
    LOW = 3

class Status(IntEnum):
    CANCELLED = -1
    NEW = 0
    IN_PROGRESS = 1
    COMPLETED = 2

class Task:
    def __init__(self,
                 name: str,
                 priority: Priority,
                 location: tuple[float, float],
                 status: Status = Status.NEW,
                 timestamp: datetime = None):
        self.name = name
        self.priority = priority
        self.location = location
        self.status = status
        self.timestamp = timestamp or datetime.now()

    def get_weight(self):
        # change weights as required
        priority_weights = {
            Priority.HIGH: 5,
            Priority.MEDIUM: 3,
            Priority.LOW: 1,
        }
        status_weights = {
            Status.NEW: 0,
            Status.IN_PROGRESS: 5,
            Status.CANCELLED: -5,
            Status.COMPLETED: -5,
        }
        weight = priority_weights.get(self.priority, 0)
        weight += status_weights.get(self.status, 0)

        # update weight based on location data with resource consumption team

        return weight

    def __lt__(self, other: 'Task') -> bool:
        if self.get_weight() != other.get_weight():
            return self.get_weight() < other.get_weight()
        return self.timestamp < other.timestamp

    def __repr__(self):
        return (f"<Task {self.name!r} priority={self.priority.name} "
                f"status={self.status.name} weight={self.get_weight()}>")

class TaskPriorityQueue:
    def __init__(self):
        # Maintain a sorted list of Task objects
        self._tasks: list[Task] = []

    def add_task(self, task: Task):
        """Insert task into the queue, keeping it sorted."""
        insort(self._tasks, task)

    def remove_task(self, task_name: str) -> Task:
        """Remove task by name and return it."""
        for index, task in enumerate(self._tasks):
            if task.name == task_name:
                return self._tasks.pop(index)
        raise KeyError(f"Task '{task_name}' not found")

    def peek(self, n: int = 1, reverse: bool = True) -> list[Task]:
        """
        Return the top-n tasks without removing them.
        reverse=True gives highest weight first.
        """
        if not self._tasks:
            return []
        return (sorted(self._tasks, reverse=reverse)[:n]
                if reverse else self._tasks[:n])

    def pop(self, reverse: bool = True) -> Task:
        """Remove and return the single highest-(or lowest-)priority task."""
        if not self._tasks:
            raise IndexError("pop from empty TaskPriorityQueue")
        return self._tasks.pop(-1 if reverse else 0)

    def is_empty(self) -> bool:
        return not self._tasks

    def sort_by(self, key: str, reverse: bool = False):
        """
        Re-sort the queue by any Task attribute or method:
          key can be 'weight', 'priority', 'status', 'timestamp', or any attribute.
        """
        if key == 'weight':
            self._tasks.sort(key=lambda t: t.get_weight(), reverse=reverse)
        else:
            self._tasks.sort(key=lambda t: getattr(t, key), reverse=reverse)

    def __len__(self):
        return len(self._tasks)

    def __iter__(self):
        yield from self._tasks

    def __repr__(self):
        return f"TPQ[{', '.join(repr(t) for t in self._tasks)}]"
