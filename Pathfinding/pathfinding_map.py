import sys
import socket
import numpy as np
import matplotlib.pyplot as plt
import pathfinding
from matplotlib.animation import FuncAnimation

# input lidar directory
lidar_dir = "C:\\Users\\paulb\\OneDrive\\Desktop\\NASA_SUITS\\repo\\JARVIS-2025\\LIDAR"
sys.path.insert(0, lidar_dir)
import lidar_processer

# socket
clientSocket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

# array set up
xmin, xmax = -6550, -5450
ymin, ymax = -10450, -9750
z_sum = np.zeros((xmax - xmin, ymax - ymin))    # sum of all collected z values
count = np.zeros((xmax - xmin, ymax - ymin))    # 
terrain = np.zeros((xmax - xmin, ymax - ymin))

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

# initialization
initial_points = lidar_processer.process_lidar(clientSocket)
for point in initial_points:
    z_avg += point[2]

z_avg /= len(initial_points) 

# loop
while True:
    points = lidar_processer.process_lidar(clientSocket)
    print(points)
    
    update_grid_batch(points)
    terrain = get_average_grid()
    z_avg = np.average(terrain)
    
    ani = FuncAnimation(fig, animate, interval=500)  # update every 0.5 seconds
    plt.show()



