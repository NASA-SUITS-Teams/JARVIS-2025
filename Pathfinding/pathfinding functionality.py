"""
PATHFINDING FUNCTIONALITY

The pathfinding system will consist of three primary functions that revolve around a graph of nodes and edges
representing the terrain the rover will navigate on, initialization, iteration, and pathfinding.

INITIALIZATION
Input:
    Discrete graph dimensions Nx, Ny

Output:
    Initial terrain graph

Description:
    An initialization script will generate a representation rectangular graph of nodes with the input dimesnions.
    Each node will correspond to a dictionary of parameters used in the pathfinding algoriths which will be updated
    in the iteration stage. Each node is connected to its immediate neighbors (including diagonal).

    

ITERATION
Input:
    Rover and Lidar parameters

Output:
    Updated graph

Desription:
    In some regular interval over the course of the mission, an iteration script will use the position and orientation
    parameters of the rover and lidar data to update the values stored in the dictionaries of nearby nodes. This new
    graph will then overwrite the previous graph for the purpose of pathfinding. The iteration interval should be longer
    that the average time it takes for the pathfinding script to calculate a best path.


PATHFINDING
Input: 
    Start coordinate (x1, y1)
    End coordinate (x2, y1)

Output:
    Coordinate list (x1, y2) --> (x2, y2)

Description:
    Pathfinding will be accomplished by running an A* pathfinding algorithm on the most recently iterated graph
    with a "diagonal distance" heuristic and a cost function that factors in the distance between two neighboring
    points.

    The A* pathfinding algorithm will assign a score to each path by adding the hueristic (diagonal distance) and
    cost functions, prioritizing checking paths that minimize the score. Since our map is continually updating as the
    rover moves, we cannot find all paths ahead of time. As a result, our agorithm will prioritize reaching the end
    goal from the starting point, and once a path is found it wll return it before checking every possible path.
"""
