import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import os
import base64

# set root path to parent folder to access other modules
import sys
sys.path.append("..")

from Pathfinding.pathfinding import xy_to_index

def terrain_scan(pos):
    pos = [round(pos[0]), round(pos[1])]
    indices = xy_to_index(pos)
    x = indices[0]
    y = indices[1]

    # load terrain data, note from Conor: this is a crappy way to do this, python kinda sucks, or I suck at python... probably both
    THIS_DIR    = os.path.dirname(os.path.abspath(__file__))
    PROJECT_ROOT = os.path.abspath(os.path.join(THIS_DIR, os.pardir))
    TERRAIN_FILE = os.path.join(PROJECT_ROOT, "Pathfinding", "terrain.txt")

    # later, load like this:
    terrain = np.loadtxt(TERRAIN_FILE, delimiter=",")

    local_terrain = [ row[ y-10 : y+10 ] for row in terrain[ x-10 : x+10 ] ]

    # swap x and y of local_terrain to switch to x,y coordinates for imshow()
    temp1 = np.transpose(local_terrain)
    temp2 = []
    for i in range(len(temp1)):
        temp2.append(temp1[-(1 + i)])
    
    local_terrain = np.array(temp2)

    # plot heatmap using matplotlib imshow()
    plt.title("Terrain centered at " + str(x) + "," + str(y))
    plt.imshow(local_terrain, cmap="inferno")
    plt.colorbar(label="altitude")
    plt.xlabel("x")
    plt.ylabel("y")

    tick_loc = [0, 10, 19]
    x_ticks = [str(x-10), str(x), str(x+10)]
    y_ticks = [str(y+10), str(y), str(y-10)]
    plt.xticks(ticks=tick_loc, labels=x_ticks)
    plt.yticks(ticks=tick_loc, labels=y_ticks)

    file_title = "terrain_" + str(x) + "_" + str(y)
    plt.savefig(file_title)

    return png_to_base64(file_title + ".png")


def png_to_base64(file_path):
    with open(file_path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read())
        return encoded_string.decode("utf-8")

