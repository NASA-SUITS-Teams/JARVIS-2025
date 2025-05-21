# A* pathfinding and utility functions
from math import sqrt
import numpy as np
import heapq
import os

"""
Global Constants
Change to match provided map
"""
xmin = -6550
xmax = -5450

ymin = -10450
ymax = -9750


"""
A* pathfinding algorithm

Arguments:
    'matrix' - matrix representing terrain and altitute
    'start' - (x1,y1) representing starting coordinate
    'goal' - (x2,y2) representing goal coordinates
    
Return:
    'path' - list of coordinates representing the shortest path
"""
def find_path(start, goal):
    # load terrain data, note from Conor: this is a crappy way to do this, python kinda sucks, or I suck at python... probably both
    THIS_DIR    = os.path.dirname(os.path.abspath(__file__))
    PROJECT_ROOT = os.path.abspath(os.path.join(THIS_DIR, os.pardir))
    TERRAIN_FILE = os.path.join(PROJECT_ROOT, "Pathfinding", "terrain.txt")

    # later, load like this:
    matrix = np.loadtxt(TERRAIN_FILE, delimiter=",")
    start = xy_to_index(start)
    goal = xy_to_index(goal)

    def weight(node1, node2):
        """Distance between both nodes"""
        dx = node2[0] - node1[0]
        dy = node2[1] - node1[1]
        dz = matrix[node2] - matrix[node1]
        dist = sqrt(dx * dx + dy * dy + dz * dz)
        return dist
    
    def heuristic(node, goal):
        """Euclidean Distance"""
        dx = goal[0] - node[0]
        dy = goal[1] - node[1]
        return sqrt(dx * dx + dy * dy)
    
    rows, cols = len(matrix), len(matrix[0])
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1),  
                  (-1, -1), (-1, 1), (1, -1), (1, 1)]  # 8 possible moves
    
    open_set = []
    heapq.heappush(open_set, (0, start))  # Priority queue (cost, node)
    came_from = {}
    g_score = np.full((rows, cols), np.inf)  # Faster lookup using NumPy
    g_score[start] = 0
    f_score = np.full((rows, cols), np.inf)
    f_score[start] = heuristic(start, goal)
    closed_set = set()
    
    while open_set:
        _, current = heapq.heappop(open_set)
        
        if current in closed_set:
            continue
        
        if current == goal:
            path = [index_to_xy(goal)]
            while current in came_from:
                current = came_from[current]
                path.append(index_to_xy(current))
            return path[::-1]  # Return reversed path
        
        closed_set.add(current)
        
        for d in directions:
            neighbor = (current[0] + d[0], current[1] + d[1])
            if 0 <= neighbor[0] < rows and 0 <= neighbor[1] < cols:
                tentative_g_score = g_score[current] + weight(current, neighbor)
                if tentative_g_score < g_score[neighbor]:
                    came_from[neighbor] = current
                    g_score[neighbor] = tentative_g_score
                    f_score[neighbor] = tentative_g_score + heuristic(neighbor, goal)
                    heapq.heappush(open_set, (f_score[neighbor], neighbor))
    
    return None  # No path found

"""
Calculate the distance of a path
"""
def path_dist(matrix, path):
    dist = 0
    for i in range(len(path) - 1):
        dx = path[i + 1][0] - path[i][0]
        dy = path[i + 1][1] - path[i][1]
        dz = matrix[path[i + 1]] - matrix[path[i]]
        dist += sqrt(dx**2 + dy**2 + dz**2)

    return dist

"""
Change x, y coordinates to matrix indices i, j and vice versa
"""
def xy_to_index(coord):
    i = int(round(coord[0] - xmin))
    j = int(round(coord[1] - ymin))
    return (i,j)

def index_to_xy(index):
    x_world = index[0] + xmin
    y_world = index[1] + ymin
    return (x_world, y_world)


"""
Get the "turn" needed to  head to the pin, from -1 (left) to 1 (right)
assuming heading is clockwise from north in degrees. This version uses
the current rover position and the end point

if you only have the path object, and not the starting and end points,
let pos = path[0], end = path[len(path) - 1]
"""
def heading_diff(rover_heading, pos, end):
    dx = end[0] - pos[0]
    dy = end[1] - pos[1]

    path_heading = (90 - np.degrees( np.arctan2(dy, dx) )) % 360

    heading_diff = path_heading - rover_heading

    if heading_diff > 180:
        heading_diff -= 360
    elif heading_diff < -180:
        heading_diff += 360

    return heading_diff / 180

"""
function headingDiff(roverHeading, path) {
    const pos = path[0];
    const end = path[path.length - 1];

    const dx = end[0] - pos[0];
    const dy = end[1] - pos[1];

    let pathHeading = (90 - (Math.atan2(dy, dx) * (180 / Math.PI))) % 360;

    if (pathHeading < 0) {
        pathHeading += 360;
    }

    let headingDifference = pathHeading - roverHeading;

    // Normalize to [-180, 180)
    if (headingDifference > 180) {
        headingDifference -= 360;
    } else if (headingDifference < -180) {
        headingDifference += 360;
    }

    return headingDifference / 180;
}
"""
