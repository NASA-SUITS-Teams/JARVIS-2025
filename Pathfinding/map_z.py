import numpy as np
grid_size = 2000
z_sum_grid = np.zeros((grid_size, grid_size), dtype=np.float32)
count_grid = np.zeros((grid_size, grid_size), dtype=np.uint16)
def update_grid_batch(points: np.ndarray, xmin, xmax, ymin, ymax):
    """
    points: np.ndarray of shape (13, 3) -> columns are [x, y, z]
    """
    xs = points[:, 0].astype(np.int32)
    ys = points[:, 1].astype(np.int32)
    zs = points[:, 2]

    x_cell_size = (xmax - xmin) / grid_size
    y_cell_size = (ymax - ymin) / grid_size

    # Filter points within bounds
    #mask = (xs >= 0) & (xs < grid_size) & (ys >= 0) & (ys < grid_size)
    for x, y, z in zip(xs, ys, zs):
        i = int((x - xmin) / x_cell_size)
        j = int((y - ymin) / y_cell_size)
        z_sum_grid[j, i] += z
        count_grid[j, i] += 1

def get_average_z(x: int, y: int) -> float:
    count = count_grid[y, x]
    return z_sum_grid[y, x] / count if count > 0 else 0.0






