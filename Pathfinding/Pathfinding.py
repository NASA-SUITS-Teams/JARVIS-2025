# A* pathfinding script
from math import sqrt
import numpy as np
import heapq

"""
Global Constants
Change to match provided map
"""
xmin = 0
xmax = 5000

ymin = 0
ymax = 5000


"""
A* pathfinding algorithm

Arguments:
    'matrix' - matrix representing terrain and altitute
    'start' - (x1,y1) representing starting coordinate
    'goal' - (x2,y2) representing goal coordinates
    
Return:
    'path' - list of coordinates representing the shortest path
"""
def find_path(matrix, start, goal):
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
    i = coord[0] + xmin
    j = coord[1] + ymin
    return (i,j)

def index_to_xy(index):
    x = index[0] - xmin
    y = index[1] - ymin
    return x,y
    