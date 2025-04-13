Set up LIDAR processing by installing the following packages:
pip install open3d
pip install numpy

pointcloudvisualizer visualizes a point cloud data file

lidar_utils.py contains the process_lidar_readings() function which takes 13 floats, the rover's x,y,z coordinates in meters, and it's roll, pitch, yaw in radians. Returns 13 floats in meters the signify the points detected by LiDAR converted to global coordinates

lidar_processor.py contains the main LiDAR processing logic. It retrieves Rover telemetry data from TSS and returns points in global coordinates.

For process_lidar() to run, the TSS server must be running on data.cs.purdue.edu with port 14141. Additionally, DUST must be running using ip 128.10.2.13 for TSS to retrieve data from DUST.