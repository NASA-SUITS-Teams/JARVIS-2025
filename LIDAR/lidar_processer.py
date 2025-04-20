# main.py
from lidar_utils import process_lidar_readings

import numpy as np
import math
import socket
import time
import struct
import sys
import select
import os
import re

def get_tss_data(clientSocket, cmd_num, timeout=0.5):
    """
    Helper function to get TSS data given socket and command number.
    Returns None on timeout or unpack failure.
    """
    tstamp = int(time.time())
    clientSocket.sendto(
        tstamp.to_bytes(4, byteorder="big") + cmd_num.to_bytes(4, byteorder="big"),
        ("data.cs.purdue.edu", 14141)
    )
    try:
        data, _ = clientSocket.recvfrom(1024)
    except socket.timeout:
        return None

    if cmd_num == 167:
        try:
            return list(struct.unpack('>13f', data[8:8+4*13]))
        except struct.error:
            return None
    else:
        # slice exactly 4 bytes for a single float
        chunk = data[8:12]
        try:
            return struct.unpack('>f', chunk)[0]
        except struct.error:
            return None



def process_lidar(clientSocket):
    """
    Given a web socket (to communicate with TSS), return a list of tuples in global
    coordinates detected by LiDAR, returns None if there is an error with tss readings
    """
    floats = get_tss_data(clientSocket, cmd_num=167)
    posx = get_tss_data(clientSocket, cmd_num=128)
    posy = get_tss_data(clientSocket, cmd_num=129)
    posz = get_tss_data(clientSocket, cmd_num=130)
    yaw = get_tss_data(clientSocket, cmd_num=131)
    pitch = get_tss_data(clientSocket, cmd_num=132)
    roll = get_tss_data(clientSocket, cmd_num=133)

    if floats is None or any(v is None for v in (posx, posy, posz, yaw, pitch, roll)):
        print("Error: TSS timeout or bad data.")
        return None
    
    if not isinstance(floats, (list, tuple)):
        print("Error: invalid LiDAR float array format.")
        return None
    
    if any(math.isnan(x) for x in floats):
        print("Error: LiDAR data contains NaN.")
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
    clientSocket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    print(process_lidar(clientSocket))