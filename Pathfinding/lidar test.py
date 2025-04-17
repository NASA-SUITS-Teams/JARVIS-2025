import sys
import socket
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

# change directory
lidar_dir = "C:\\Users\\paulb\\OneDrive\\Desktop\\NASA_SUITS\\repo\\JARVIS-2025\\LIDAR"
sys.path.insert(0, lidar_dir)
import lidar_processer

# ----- Grid Setup -----
grid_size = 2000
z_sum_grid = np.zeros((grid_size, grid_size), dtype=np.float32)
count_grid = np.zeros((grid_size, grid_size), dtype=np.uint16)# Define world bounds (adjust as needed)
xmin, xmax = -6550, -5450
ymin, ymax = -10450, -9750

clientSocket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)


# ----- Grid Update -----
def update_grid_batch(points: np.array):
    """
    points: np.ndarray of shape (N, 3) -> columns are [x, y, z]
    """
    x_cell_size = (xmax - xmin) / grid_size
    y_cell_size = (ymax - ymin) / grid_size    
    xs = points[:, 0]
    ys = points[:, 1]
    zs = points[:, 2]    
    
    # Convert to grid indices
    i = ((xs - xmin) / x_cell_size).astype(np.int32)
    j = ((ys - ymin) / y_cell_size).astype(np.int32)    
    
    # Filter valid indices
    mask = (i >= 0) & (i < grid_size) & (j >= 0) & (j < grid_size)
    i, j, zs = i[mask], j[mask], zs[mask]    
    
    # Accumulate values
    np.add.at(z_sum_grid, (j, i), zs)
    np.add.at(count_grid, (j, i), 1)
    
# ----- Averaging -----
def get_average_grid():
    with np.errstate(divide='ignore', invalid='ignore'):
        avg_grid = np.divide(z_sum_grid, count_grid, where=(count_grid != 0))
        avg_grid[count_grid == 0] = 0  # optional: use np.nan for transparency
    return avg_grid

# ----- Visualization -----
fig, ax = plt.subplots(figsize=(8, 8))
img = ax.imshow(np.zeros((grid_size, grid_size)), cmap='terrain', origin='lower')
plt.title("Average Z-Values (Terrain Heightmap)")

def animate(_):
    avg_grid = get_average_grid()
    img.set_data(avg_grid)
    img.set_clim(vmin=0, vmax=np.max(avg_grid))  # dynamic color scaling
    return [img]

for i in range(100):
    points = lidar_processer.process_lidar(clientSocket)
    print(points)
    update_grid_batch(points)
    ani = FuncAnimation(fig, animate, interval=2000)  # update every 2 seconds
    plt.show()



