import socket
import struct

UDP_IP = "127.0.0.1"
UDP_PORT = 5005
sock = socket.socket(socket.AF_INET,
                   socket.SOCK_DGRAM)
sock.bind((UDP_IP, UDP_PORT))

# make a global array of ip addresses connected
ipAddresses = set() 

while True:
    data, addr = sock.recvfrom(1024) # buffer size is 1024 bytes
    print(f"received message: {data}")

    ipAddresses.add(addr) # 0(1) by the way for duplication checking


    # code to recieve
    timeStamp = int.from_bytes(data[:4], byteorder='big') 
    cmdNum = int.from_bytes(data[4:8], byteorder='big') #
    inputNum = struct.unpack('>f', data[8:12])[0] # their output data

    if cmdNum == 200:
        continue # received starter message to put in array


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
    sent = None
    for address in ipAddresses:
        if address != addr:
            sent = address
            break


    sock.sendto(data, sent)
    print(f"Sent data {data}")