import socket
import struct
import time

UDP_IP = "127.0.0.1"
UDP_PORT = 5005
MESSAGE = b"Hi Benji!"
print(f"UDP target IP: {UDP_IP}")
print(f"UDP target port: {UDP_PORT}")
print(f"message: {MESSAGE}")
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM) # INTERNET, sUDP


timeStamp = int(time.time()) #starter send to be in global list of IP's -1 is ignored
cmdNum = 200
inputData = 200 

data = (
    timeStamp.to_bytes(4, byteorder='big') +
    cmdNum.to_bytes(4, byteorder='big') +
    struct.pack('>f', inputData)
)

sock.sendto(data, (UDP_IP, UDP_PORT))

# In global list of IP's now 


#actual command after this
timeStamp = int(time.time()) # time stamp for command same as tss
cmdNum = 165 # command number same as tss as well
inputData = 1 # input data same as tss


data = (
    timeStamp.to_bytes(4, byteorder='big') +
    cmdNum.to_bytes(4, byteorder='big') +
    struct.pack('>f', inputData)
)

sock.sendto(data, (UDP_IP, UDP_PORT))
print(f"Sent data {data}")

