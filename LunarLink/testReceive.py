import socket
import struct
import time


UDP_IP = "127.0.0.1"
UDP_PORT = 5005
sock = socket.socket(socket.AF_INET,
                   socket.SOCK_DGRAM)


timeStamp = int(time.time()) #starter send to be in global list of IP's -1 is ignored
cmdNum = 200
inputData = 200


data = (
    timeStamp.to_bytes(4, byteorder='big') +
    cmdNum.to_bytes(4, byteorder='big') +
    struct.pack('>f', inputData)
)

sock.sendto(data, (UDP_IP, UDP_PORT))
print(f"Sent data {data}")

data, addr = sock.recvfrom(1024)

timeStamp = int.from_bytes(data[:4], byteorder='big') 
cmdNum = int.from_bytes(data[4:8], byteorder='big') #
inputNum = struct.unpack('>f', data[8:12])[0] # their output data


print("receiver got this ")
print(f"timestamp - {timeStamp}")
print(f"command numer {cmdNum}")
print(f"input Num {inputNum}")

