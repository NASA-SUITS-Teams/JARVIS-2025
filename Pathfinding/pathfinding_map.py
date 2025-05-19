import sys
import socket
import time
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

# set root path to parent folder to access other modules
import sys
sys.path.append("..")

from Backend.tss import convert_tss_for_lidar
from LIDAR import lidar_processer

# socket
clientSocket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

# array set up
xmin, xmax = -6550, -5450
ymin, ymax = -10450, -9750
z_sum = np.zeros((xmax - xmin, ymax - ymin))    # sum of all collected z values
z_avg = 0
count = np.zeros((xmax - xmin, ymax - ymin))    # 
terrain = np.zeros((xmax - xmin, ymax - ymin))
first_time = True

# grid update
def update_grid_batch(points):
    for point in points:
        x, y, z = point

        # Convert to grid indices
        i = int( round(x - xmin) )
        j = int( round(y - ymin) )
        
        z_sum[i,j] += z
        count[i,j] += 1
    return
    
# averaging
def get_average_grid():
    with np.errstate(divide='ignore', invalid='ignore'):
        avg_grid = np.divide(z_sum, count, where=(count != 0))
        avg_grid[count == 0] = z_avg  # optional: use np.nan for transparency
    return avg_grid

# visualization
fig, ax = plt.subplots(figsize=(8, 8))
img = ax.imshow(np.zeros((xmax - xmin, ymax - ymin)), cmap='terrain', origin='lower')
plt.title("Average Z-Values (Terrain Heightmap)")

def animate(_):
    avg_grid = get_average_grid()
    img.set_data(avg_grid)
    img.set_clim(vmin=0, vmax=np.max(avg_grid))  # dynamic color scaling
    return [img]

# initialization to set up the grid, using default LIDAR and telemtry values


# loop
while True:
    lidar, position = convert_tss_for_lidar()

    points = lidar_processer.process_lidar(lidar, position)

    # if first time, then setup new grid and the altitude avg
    if (first_time):
        first_time = False
        for point in points:
            z_avg += point[2]

        z_avg /= len(points) 

    print(points)
    
    # update terrain
    update_grid_batch(points)
    terrain = get_average_grid()
    z_avg = np.average(terrain)
    
    # write terrain to terrain.txt
    np.savetxt("terrain.txt", terrain, fmt="%f", delimiter=",")

    time.sleep(5)  # Process new lidar data every 5 seconds

    """
    ani = FuncAnimation(fig, animate, interval=500)  # update every 0.5 seconds
    plt.show()
    """



