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

import threading

stop_flag = False

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
        output = struct.unpack('>f', data[8:])        
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
def main():
    global_points = []
    clientSocket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    threading.Thread(target=wait_for_exit, daemon=True).start()
    while not stop_flag:
        timestamp, commandNums, floats = get_tss_data(clientSocket, cmd_num=167)
        # Update rover's yaw.
        timestamp, commandNums, posx = get_tss_data(clientSocket, cmd_num=23)
        timestamp, commandNums, posy = get_tss_data(clientSocket, cmd_num=24)
        timestamp, commandNums, heading = get_tss_data(clientSocket, cmd_num=19)
        rover_position = np.array([posx[0], posy[0], 0])  # in meters
        rover_angles = [0, 0, heading[0]]
        print(floats, posx, posy, heading)
        
        # Simulate constant LIDAR sensor readings (500 cm each).
        new_points = process_lidar_readings(floats, rover_position, tuple(rover_angles))
        global_points.extend(new_points)
        time.sleep(.25)
        
    global_points.append(rover_position.tolist())
    # Create a point cloud from the accumulated points.
    pcd = o3d.geometry.PointCloud()
    pcd.points = o3d.utility.Vector3dVector(np.array(global_points))

    # Save the point cloud to a PCD file.
    o3d.io.write_point_cloud("pcds/lidar_sweep.pcd", pcd)
    print("Saved lidar_sweep.pcd with", len(global_points), "points.")
    pcd = o3d.io.read_point_cloud("pcds/lidar_sweep.pcd")
    o3d.visualization.draw_geometries([pcd], window_name="PCD Viewer")

def main2():
    global_points = []
    clientSocket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

    # Create an Open3D Visualizer window
    vis = o3d.visualization.Visualizer()
    vis.create_window(window_name="Real-Time LIDAR Visualization")

    # Create a point cloud geometry and add it to the Visualizer
    pcd = o3d.geometry.PointCloud()
    vis.add_geometry(pcd)

    # Main loop to grab data, process, and update visualization
    while True:
        # Get LIDAR data
        timestamp, commandNum, floats = get_tss_data(clientSocket, cmd_num=167)
        
        # Get rover's position/heading
        _, _, posx = get_tss_data(clientSocket, cmd_num=23)
        _, _, posy = get_tss_data(clientSocket, cmd_num=24)
        _, _, heading = get_tss_data(clientSocket, cmd_num=19)
        
        rover_position = np.array([posx[0], posy[0], 0])  # in meters
        rover_angles = (0, 0, heading[0])  # roll, pitch, yaw in degrees

        # Convert LIDAR readings into 3D points in global frame
        new_points = process_lidar_readings(floats, rover_position, rover_angles)
        global_points.extend(new_points)

        # Update the Open3D point cloud geometry
        pcd.points = o3d.utility.Vector3dVector(np.array(global_points))

        # Let the visualizer know we have updated the geometry
        vis.update_geometry(pcd)
        vis.poll_events()
        vis.update_renderer()

        time.sleep(0.25)

    print("Finished capturing data, close window to exit.")

    # Keep the window open until the user closes it
    vis.run()
    vis.destroy_window()

if __name__ == '__main__':
    main()