import numpy as np
import math
import time
import open3d as o3d
np.set_printoptions(suppress=True, precision=2)

# Create rotation matrix for Tait-Bryan angles, assumes input is in radians
def rotation_matrix(roll, pitch, yaw):
  R_x = np.array([[1, 0, 0],
                  [0, math.cos(roll), -math.sin(roll)],
                  [0, math.sin(roll), math.cos(roll)]])
  
  R_y = np.array([[math.cos(pitch), 0, math.sin(pitch)],
                  [0, 1, 0],
                  [-math.sin(pitch), 0, math.cos(pitch)]])
  
  R_z = np.array([[math.cos(yaw), -math.sin(yaw), 0],
                  [math.sin(yaw), math.cos(yaw), 0],
                  [0, 0, 1]])
  return R_z @ R_y @ R_x

# Convert point from rover's local coordinates to global coordinates
def local_to_global(local_point, rover_position, rover_angles):
  R = rotation_matrix(*rover_angles)
  return R @ local_point + rover_position

# Proccesses lidar readings from 13 sensors
def process_lidar_readings(lidar_readings, rover_position, rover_angles):
  """
  Given a list of 13 LIDAR readings (in centimeters) and the rover's global
  pose (position and Tait-Bryan angles), compute the global endpoints of the
  sensor rays that hit an object. Returns a list of points (in meters).
  
  For each sensor:
    - If reading == -1, the sensor did not hit an object and is skipped.
    - Otherwise, the sensor's local endpoint is computed as:
        sensor_position + (sensor_direction * distance)
      where distance is converted to meters.
    - sensor_direction is computed by rotating the forward vector [1, 0, 0]
      by the sensor's relative orientation.
    - The resulting point is transformed into global coordinates.
  """

  # Assumes sensor coordinates are in centimeters
  # Coordinate convention:
  #   - x: forward
  #   - y: right
  #   - z: up
  # For yaw, a positive angle rotates the forward vector toward the right.
  sensor_data = [
    # Sensor index, position (m), orientation (roll, pitch, yaw in radians)
    { "index": 0, "position": np.array([170, -150, 15], dtype=float) / 100.0,
      "orientation": (0, 0, math.radians(-30)) },
    { "index": 1, "position": np.array([200, -40, 20], dtype=float) / 100.0,
      "orientation": (0, 0, math.radians(-20)) },
    { "index": 2, "position": np.array([200, 0, 20], dtype=float) / 100.0,
      "orientation": (0, 0, 0) },
    { "index": 3, "position": np.array([200, 40, 20], dtype=float) / 100.0,
      "orientation": (0, 0, math.radians(20)) },
    { "index": 4, "position": np.array([170, 150, 15], dtype=float) / 100.0,
      "orientation": (0, 0, math.radians(30)) },
    { "index": 5, "position": np.array([200, -40, 20], dtype=float) / 100.0,
      "orientation": (0, math.radians(-25), 0) },
    { "index": 6, "position": np.array([200, 40, 20], dtype=float) / 100.0,
      "orientation": (0, math.radians(-25), 0) },
    { "index": 7, "position": np.array([0, -100, 0], dtype=float) / 100.0,
      "orientation": (0, math.radians(-20), math.radians(-90)) },
    { "index": 8, "position": np.array([0, 100, 0], dtype=float) / 100.0,
      "orientation": (0, math.radians(-20), math.radians(90)) },
    { "index": 9, "position": np.array([-135, -160, 15], dtype=float) / 100.0,
      "orientation": (0, 0, math.radians(-220)) },
    { "index": 10, "position": np.array([-180, -60, 15], dtype=float) / 100.0,
      "orientation": (0, 0, math.radians(-180)) },
    { "index": 11, "position": np.array([-180, 60, 15], dtype=float) / 100.0,
      "orientation": (0, 0, math.radians(-180)) },
    { "index": 12, "position": np.array([-135, 160, 15], dtype=float) / 100.0,
      "orientation": (0, 0, math.radians(-140)) },
  ]

  points = []
  for sensor, reading in zip(sensor_data, lidar_readings):
    if reading == -1:
      continue
    
    distance_m = reading / 100.0
    
    # Compute the sensor's direction in the rover frame.
    forward = np.array([1, 0, 0])
    roll, pitch, yaw = sensor["orientation"]
    R_sensor = rotation_matrix(roll, pitch, yaw)
    sensor_direction = R_sensor @ forward
    
    # Compute the endpoint in the rover's local coordinate system.
    sensor_local_endpoint = sensor["position"] + sensor_direction * distance_m
    
    # Transform the local endpoint to global coordinates.
    global_point = local_to_global(sensor_local_endpoint, rover_position, rover_angles)
    points.append(global_point)
  return [tuple(float(x) for x in point) for point in points]