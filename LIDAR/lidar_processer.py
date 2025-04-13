# main.py
from lidar_utils import process_lidar_readings

import numpy as np
import math
import socket
import time
import struct

def get_tss_data(clientSocket, cmd_num):
    """
    Helper function to get TSS data given socket and command number
    """
    tstamp = int(time.time())
    clientSocket.sendto(tstamp.to_bytes(4, byteorder="big") + cmd_num.to_bytes(4,byteorder="big"), ("data.cs.purdue.edu", 14141))
    data, _ = clientSocket.recvfrom(1024)
    output = float('nan')
    if (cmd_num == 167):
        try:
            output = list(struct.unpack('>13f', data[8:8+4*13]))
        except:
            print("Did not receive enough bytes")        
    else:
        output = struct.unpack('>f', data[8:])[0]
    return output


def process_lidar(clientSocket):
    """
    Given a web socket (to communicate with TSS), return a list of tuples in global
    coordinates detected by LiDAR
    """
    floats = get_tss_data(clientSocket, cmd_num=167)
    posx = get_tss_data(clientSocket, cmd_num=128)
    posy = get_tss_data(clientSocket, cmd_num=129)
    posz = get_tss_data(clientSocket, cmd_num=130)
    yaw = get_tss_data(clientSocket, cmd_num=131)
    pitch = get_tss_data(clientSocket, cmd_num=132)
    roll = get_tss_data(clientSocket, cmd_num=133)

    if any(math.isnan(x) for x in [posx, posy, posz, yaw, pitch, roll]) or floats is None:
        print("Error: Invalid TSS data received.")
        return None

    rover_angle = (
        math.radians(roll),
        math.radians(pitch),
        math.radians(yaw + 180)
    )
    posx_m = posx
    posy_m = posy
    posz_m = posz
    rover_position = np.array([posx_m, posy_m, posz_m])

    return process_lidar_readings(floats, rover_position, tuple(rover_angle))

if __name__ == '__main__':
    # sample usage
    clientSocket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    print(process_lidar(clientSocket))