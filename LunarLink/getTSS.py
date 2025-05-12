import socket
import time
import struct

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

	clientSocket.sendto(tstamp.to_bytes(4) + (69).to_bytes(4), addr)
	data, server = clientSocket.recvfrom(1024)
	
	return parse_tss_response(data)


clientSocket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
data = get_tss_data(clientSocket, cmd_num=137)

print(data)
