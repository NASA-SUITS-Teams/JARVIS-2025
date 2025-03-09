import socket
import struct

UDP_IP = "127.0.0.1"
UDP_PORT = 5005
sock = socket.socket(socket.AF_INET,
                   socket.SOCK_DGRAM)
sock.bind((UDP_IP, UDP_PORT))
while True:
    data, addr = sock.recvfrom(1024) # buffer size is 1024 bytes
    print(f"received message: {data}")

    timestamp = int.from_bytes(data[:4], byteorder='big')
    cmdNum = int.from_bytes(data[4:8], byteorder='big')
    inputNum = struct.unpack('>f', data[8:12])[0]

    print("Server got this ")
    print(f"timestamp - {timestamp}")
    print(f"command numer {cmdNum}")
    print(f"input Num {inputNum}")