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

import threading

stop_flag = False

def get_next_filename(directory, base_name='lidar', ext='.pcd'):
    i = 1
    while os.path.exists(os.path.join(directory, f"{base_name}{i}{ext}")):
        i += 1
    return os.path.join(directory, f"{base_name}{i}{ext}")

def wait_for_exit():
    global stop_flag
    input("Press Enter or type 'q' to stop...\n")
    stop_flag = True

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


# Now you can use the imported functions.
def process_lidar():
    global_points = []
    clientSocket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    threading.Thread(target=wait_for_exit, daemon=True).start()
    print("Getting data...")
    for i in range(100):
        timestamp, commandNums, floats = get_tss_data(clientSocket, cmd_num=167)
        # Update rover's yaw.
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
        # rover_angle = (roll, pitch, yaw)
        coord_const = 1.0
        posx_m = posx / coord_const
        posy_m = posy / coord_const
        posz_m = posz / coord_const
        rover_position = np.array([posx_m, posy_m, posz_m])
        new_points = process_lidar_readings(floats, rover_position, tuple(rover_angle))
        print(floats, rover_angle, rover_position, new_points)
        global_points.extend(new_points)
        time.sleep(.1)
        
    global_points.append(rover_position.tolist())
    # Create a point cloud from the accumulated points.
    pcd = o3d.geometry.PointCloud()
    pcd.points = o3d.utility.Vector3dVector(np.array(global_points))

    # Save the point cloud to a PCD file.
    output_directory = "/Users/Total/Documents/GitHub/JARVIS-2025/LIDAR/pcds"
    pcd_filename = get_next_filename(output_directory, base_name='lidar', ext='.pcd')
    if os.path.exists(pcd_filename):
        os.remove(pcd_filename)
    o3d.io.write_point_cloud(pcd_filename, pcd)
    print("Saved lidar_sweep.pcd with", len(global_points), "points.")
    pcd = o3d.io.read_point_cloud(pcd_filename)
    o3d.visualization.draw_geometries([pcd], window_name="PCD Viewer")

if __name__ == '__main__':
    process_lidar()