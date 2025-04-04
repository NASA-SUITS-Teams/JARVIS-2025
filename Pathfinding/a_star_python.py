# A* pathfinding script
from math import sqrt
import numpy as np
import heapq

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
    def weight(node1, node2):
        """Distance between both nodes"""
        dist = sqrt( (node2[0] - node1[0])**2 + (node2[0] - node1[0])**2 + (matrix[node2] - matrix[node1])**2 )
        return dist
    
    def heuristic(node, goal):
        """Diagonal distance"""
        dx = goal[0] - node[0]
        dy = goal[1] - node[1]
        return (dx + dy) + (sqrt(2) - 2) * min(dx, dy)
    
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
            path = [goal]
            while current in came_from:
                current = came_from[current]
                path.append(current)
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
