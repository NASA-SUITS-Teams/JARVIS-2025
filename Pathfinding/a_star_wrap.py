import ctypes
import numpy as np

# Load the shared library
a_star_lib = ctypes.CDLL('./a_star.dll') 

# Define Point structure
class Point(ctypes.Structure):
    _fields_ = [("x", ctypes.c_int), ("y", ctypes.c_int)]

# Set return type for a_star function
a_star_lib.a_star.restype = ctypes.POINTER(Point)  # Returning an array of Points


"""
A* pathfinding algorithm

Arguments:
    'matrix' - matrix representing terrain and altitute
    'start' - (x1,y1) representing starting coordinate
    'goal' - (x2,y2) representing goal coordinates
    
Return:
    'path' - list of coordinates representing the shortest path
"""

def a_star(matrix, start, goal):
    rows, cols = len(matrix), len(matrix[0])
    flat_matrix = np.array(matrix, dtype=np.int32).flatten()
    start_point = Point(start[0], start[1])
    goal_point = Point(goal[0], goal[1])

    # Call the C++ function
    path_ptr = a_star_lib.a_star(flat_matrix.ctypes.data_as(ctypes.POINTER(ctypes.c_int)), rows, cols, start_point, goal_point)

    # Extract path from pointer
    path = []
    i = 0
    while path_ptr[i].x != -1:  # Assuming C++ function sets last Point as (-1, -1) when done
        path.append((path_ptr[i].x, path_ptr[i].y))
        i += 1

    return path