# main.py
from lidar_utils import process_lidar_readings

import numpy as np
import math
import open3d as o3d

# Now you can use the imported functions.
def main():
    # Initial rover global pose (rover stays in place for the sweep).
    rover_position = np.array([100.0, 50.0, 0.0])  # in meters
    # Start with some initial angles (roll, pitch, yaw).
    rover_angles = [math.radians(5), math.radians(2), math.radians(45)]
    
    # Simulation parameters.
    dt = 0.1         # time step in seconds.
    total_time = 10  # total time of the sweep in seconds.
    iterations = int(total_time / dt)
    
    # We want to sweep 180° (pi radians) over the total time.
    delta_yaw = math.pi / iterations  # increment in yaw per time step.
    
    global_points = []
    
    for _ in range(iterations):
        # Update rover's yaw.
        rover_angles[2] += delta_yaw
        
        # Simulate constant LIDAR sensor readings (500 cm each).
        constant_readings = [500] * 13
        new_points = process_lidar_readings(constant_readings, rover_position, tuple(rover_angles))
        global_points.extend(new_points)
            
    # Create a point cloud from the accumulated points.
    pcd = o3d.geometry.PointCloud()
    pcd.points = o3d.utility.Vector3dVector(np.array(global_points))
    
    # Save the point cloud to a PCD file.
    o3d.io.write_point_cloud("pcds/lidar_sweep.pcd", pcd)
    print("Saved lidar_sweep.pcd with", len(global_points), "points.")

if __name__ == '__main__':
    main()