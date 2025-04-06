import requests
import socket
import time
import struct

URL = "data.cs.purdue.edu"
PORT = 14141

def parse_tss_response(data, cmd_num):
	time = int.from_bytes(data[:4],byteorder="big")
	commandNum = int.from_bytes(data[4:8],byteorder="big")
	floats = 0
	# Unpack 13 floats from the remaining data (13 * 4 bytes)
	if (cmd_num == 167): # this is to check for lidar command 
		try:
			floats = list(struct.unpack('>13f', data[8:8+4*13]))
		except:
			print("Did not receive enough bytes")        
	else:
		floats = struct.unpack('>f', data[8:])[0]

	return time, commandNum, floats


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
	print("Received", len(data), "bytes")  # This line prints the number of bytes
	return parse_tss_response(data, cmd_num=cmd_num)


clientSocket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
print("getting data....")
# timeStamp, command, floats = get_tss_data(clientSocket, cmd_num=167) # This is the command to send 
# _, _, posx = get_tss_data(clientSocket, cmd_num=128)
# _, _, posy = get_tss_data(clientSocket, cmd_num=129)
# _, _, posz = get_tss_data(clientSocket, cmd_num=130)
# _, _, yaw = get_tss_data(clientSocket, cmd_num=131)
# _, _, pitch = get_tss_data(clientSocket, cmd_num=132)
# _, _, roll = get_tss_data(clientSocket, cmd_num=133)
# print(floats, posx, posy, posz, yaw, pitch, roll)

_, _, dist = get_tss_data(clientSocket, cmd_num=134)
print(dist)


# _, _, posx0 = get_tss_data(clientSocket, cmd_num=128)
# _, _, posy0 = get_tss_data(clientSocket, cmd_num=129)
# _, _, posz0 = get_tss_data(clientSocket, cmd_num=130)
# _, _, dist_travelled0 = get_tss_data(clientSocket, cmd_num=134)
# time.sleep(1)
# _, _, posx1 = get_tss_data(clientSocket, cmd_num=128)
# _, _, posy1 = get_tss_data(clientSocket, cmd_num=129)
# _, _, posz1 = get_tss_data(clientSocket, cmd_num=130)
# _, _, dist_travelled1 = get_tss_data(clientSocket, cmd_num=134)
# initial_pos = [posx0, posy0, posz0]
# final_pos   = [posx1, posy1, posz1]
# actual_distance = dist_travelled1 - dist_travelled0
# print(initial_pos)
# print(final_pos)
# print(actual_distance)
# print(dist_travelled0)
# print(dist_travelled1)

# import numpy as np

# def compute_conversion_factor(initial_pos, final_pos, actual_distance):
#     # Calculate raw displacement
#     delta_raw = np.linalg.norm(np.array(final_pos) - np.array(initial_pos))
#     # Compute conversion factor: raw_units per meter
#     conversion_factor = delta_raw / actual_distance
#     return conversion_factor

# conversion_factor = compute_conversion_factor(initial_pos, final_pos, actual_distance)
