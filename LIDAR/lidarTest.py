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
		floats = struct.unpack('>f', data[8:])

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

timeStamp, command, floats = get_tss_data(clientSocket, cmd_num=167) # This is the command to send 
print(floats)