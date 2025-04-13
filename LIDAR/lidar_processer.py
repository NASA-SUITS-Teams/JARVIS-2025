# main.py
from lidar_utils import process_lidar_readings

import numpy as np
import math
import open3d as o3d
import requests
import socket
import time
import struct
import time
import os

URL = "data.cs.purdue.edu"
PORT = 14141

def parse_tss_response(data, cmd_num):
    time = int.from_bytes(data[:4],byteorder="big")
    commandNum = int.from_bytes(data[4:8],byteorder="big")
    output = 0
    # Unpack 13 floats from the remaining data (13 * 4 bytes)
    if (cmd_num == 167): # this is to check for lidar command 
        try:
            output = list(struct.unpack('>13f', data[8:8+4*13]))
        except:
            print("Did not receive enough bytes")        
    else:
        output = struct.unpack('>f', data[8:])[0]
    return time, commandNum, output


def get_tss_data(clientSocket, 
                addr = (URL, PORT), 
                cmd_num = 58, 
                input_data = 1, 
                tstamp = 'now'):
    # by default gets the EVA time for team 1
    if tstamp == 'now':
        tstamp = int(time.time())

    clientSocket.sendto(tstamp.to_bytes(4, byteorder="big") + cmd_num.to_bytes(4,byteorder="big"), addr)
    data, server = clientSocket.recvfrom(1024)
    # print("Received", len(data), "bytes")  # This line prints the number of bytes
    return parse_tss_response(data, cmd_num=cmd_num)


def process_lidar(clientSocket):
    """
    Given a web socket (to communicate with TSS), return a list of tuples in global
    coordinates detected by LiDAR
    """
    _, _, floats = get_tss_data(clientSocket, cmd_num=167)
    _, _, posx = get_tss_data(clientSocket, cmd_num=128)
    _, _, posy = get_tss_data(clientSocket, cmd_num=129)
    _, _, posz = get_tss_data(clientSocket, cmd_num=130)
    _, _, yaw = get_tss_data(clientSocket, cmd_num=131)
    _, _, pitch = get_tss_data(clientSocket, cmd_num=132)
    _, _, roll = get_tss_data(clientSocket, cmd_num=133)

    rover_angle = (
        math.radians(roll),
        math.radians(pitch),
        math.radians(yaw + 180)
    )
    posx_m = posx
    posy_m = posy
    posz_m = posz
    rover_position = np.array([posx_m, posy_m, posz_m])
    new_points = process_lidar_readings(floats, rover_position, tuple(rover_angle))
    return new_points

if __name__ == '__main__':
    clientSocket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    process_lidar(clientSocket)