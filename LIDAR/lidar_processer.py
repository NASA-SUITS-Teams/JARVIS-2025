# main.py
from lidar_utils import process_lidar_readings

import numpy as np
import math

# LiDAR data corresponds to output from TSS cmd_num 167
# Position data corresponds to output from TSS cmd_nums 128 - 133 in ascending order
def process_lidar(floats, position):
    """
    Given an array of floats representing 13 LiDAR values and an array of position data,
    return a list of tuples in global coordinates detected by LiDAR, returns None if
    there is an error with data
    """
    posx = position[0] # cmd 128
    posy = position[1] # cmd 129
    posz = position[2] # cmd 130
    yaw = position[3] # cmd 131
    pitch = position[4] # cmd 132
    roll = position[5] # cmd 133

    if len(floats) != 13 or len(position) != 6:
        print("Error: Bad data")
        return None

    if floats is None or any(v is None for v in (posx, posy, posz, yaw, pitch, roll)):
        print("Error: Bad data")
        return None
    
    if not isinstance(floats, (list, tuple)):
        print("Error: invalid LiDAR float array format.")
        return None
    
    if any(math.isnan(x) for x in floats):
        print("Error: LiDAR data contains NaN.")
        return None
    
    if any(x < 0 for x in position):
        print("Error: Invalid position data")
        return None

    rover_angle = (
        math.radians(roll),
        math.radians(pitch),
        math.radians(yaw + 180) # degrees are reversed according to SUITS tech team
    )
    posx_m = posx
    posy_m = posy
    posz_m = posz
    rover_position = np.array([posx_m, posy_m, posz_m])

    return process_lidar_readings(floats, rover_position, tuple(rover_angle))

if __name__ == '__main__':
    floats = [1.1, 2.2, 3.3, 4.4, 5.5, 6.6, 7.7, 8.8, 9.9, -1.0, -1.0, -1.0 -1.0, -1.0]
    position  = [0, 0, 0, 0, 0, 0]
    print(floats, position)
    print(process_lidar(floats, position))