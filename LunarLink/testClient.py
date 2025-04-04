import socket
import json
import getTSS

UDP_IP = "127.0.0.1" 
UDP_PORT = 5005

lunarSock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
tssSock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)


def updateRover(tssSock, lunarSock, ip, port):
#loop call tss for every rover command value and append number and value tuple into message then send

    roverMessage = {
        "action": "update",
        "commandUpdate": []
    }
    for commandNum in range(119,167):
        data = getTSS.get_tss_data(clientSocket=tssSock, cmd_num=commandNum)
        print(data)
        print(data[2][0])
        roverMessage['commandUpdate'].append((commandNum, data[2][0]))

    
    lunarSock.sendto(json.dumps(roverMessage).encode('utf-8'), (ip, port))

def updateEVA(tssSock, lunarSock, ip, port):
#loop call tss for every rover command value and append number and value tuple into message then send

    EVAMessage = {
        "action": "update",
        "commandUpdate": []
    }
    for commandNum in range(2,119):
        data = getTSS.get_tss_data(clientSocket=tssSock, cmd_num=commandNum)
        print(data)
        print(data[2][0])
        EVAMessage['commandUpdate'].append((commandNum, data[2][0]))

    
    lunarSock.sendto(json.dumps(EVAMessage).encode('utf-8'), (ip, port))


# Send update
updateRover(tssSock, lunarSock, UDP_IP, UDP_PORT)
updateEVA(tssSock, lunarSock, UDP_IP, UDP_PORT)

# Request full state
lunarSock.sendto(json.dumps({"action": "get"}).encode('utf-8'), (UDP_IP, UDP_PORT))
data, addr = lunarSock.recvfrom(4096)
jsonFile = json.loads(data.decode('utf-8'))
print(jsonFile)