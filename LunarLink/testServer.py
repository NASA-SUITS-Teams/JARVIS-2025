import socket
import struct

UDP_IP = "127.0.0.1"
UDP_PORT = 5005
sock = socket.socket(socket.AF_INET,
                   socket.SOCK_DGRAM)
sock.bind((UDP_IP, UDP_PORT))

# make a global array of ip addresses connected
while True:
    data, addr = sock.recvfrom(1024) # buffer size is 1024 bytes
    print(f"received message: {data}")

    # code to recieve

    timeStamp = int.from_bytes(data[:4], byteorder='big') 
    cmdNum = int.from_bytes(data[4:8], byteorder='big') #
    inputNum = struct.unpack('>f', data[8:12])[0] # their output data




    print("Server got this ")
    print(f"timestamp - {timeStamp}")
    print(f"command numer {cmdNum}")
    print(f"input Num {inputNum}")

    # code to send 

    data = (
        timeStamp.to_bytes(4, byteorder='big') +
        cmdNum.to_bytes(4, byteorder='big') +
        struct.pack('>f', inputNum)
    )

    # make a one - liner to get other ip address

    sock.sendto(data, (UDP_IP, UDP_PORT))
    print(f"Sent data {data}")