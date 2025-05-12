import time
import struct
import math

URL = "data.cs.purdue.edu"
PORT = 14141

def parse_tss_response(data):
	return (int.from_bytes(data[:4]), int.from_bytes(data[4:8]), struct.unpack('>f', data[8:]))

def get_tss_data(clientSocket, 
				addr = (URL, PORT), 
				cmd_num = 58,  
				tstamp = 'now'):
	# by default gets the EVA time for team 1	
	if tstamp == 'now':
		tstamp = int(time.time())

	clientSocket.sendto(tstamp.to_bytes(4) + cmd_num.to_bytes(4), addr)
	data, server = clientSocket.recvfrom(1024)
	return parse_tss_response(data)

def calc_distance_to(x_0, y_0, x_1,y_1):
	''' Calculate the distance from the rover's current position to x,y '''
	distance = (x_1 - x_0) ** 2 + (y_1 - y_0) ** 2
	return math.sqrt(distance)

def get_rover_coordinates(clientSocket):
	_, _, posx = get_tss_data(clientSocket, cmd_num=128)
	_, _, posy = get_tss_data(clientSocket, cmd_num=129)
	return (posx, posy)