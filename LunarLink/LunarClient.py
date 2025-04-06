import socket
import json
import getTSS


def updateRover(ip, port, TssIP, TssPort):
    lunarSock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    tssSock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    #loop call tss for every rover command value and append number and value tuple into message then send

    roverMessage = {
        "action": "update",
        "commandUpdate": []
    }
    for commandNum in range(119,167):
        #not including LIDAR command since EVA won't need that information
        data = getTSS.get_tss_data(clientSocket=tssSock, cmd_num=commandNum, addr=(TssIP, TssPort))
        print(data)
        print(data[2][0])
        roverMessage['commandUpdate'].append((commandNum, data[2][0]))

    
    lunarSock.sendto(json.dumps(roverMessage).encode('utf-8'), (ip, port))

def updateEVA(ip, port, TssIP, TssPort):
#loop call tss for every rover command value and append number and value tuple into message then send
    lunarSock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    tssSock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    
    EVAMessage = {
        "action": "update",
        "commandUpdate": []
    }
    for commandNum in range(2,119):
        data = getTSS.get_tss_data(clientSocket=tssSock, cmd_num=commandNum, addr=(TssIP, TssPort))
        print(data)
        print(data[2][0])
        EVAMessage['commandUpdate'].append((commandNum, data[2][0]))

    
    lunarSock.sendto(json.dumps(EVAMessage).encode('utf-8'), (ip, port))

def getData(ip, port): # returns a json file of the entire lunar link
    lunarSock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    lunarSock.sendto(json.dumps({"action": "get"}).encode('utf-8'), (ip, port))
    data, addr = lunarSock.recvfrom(4096)
    jsonFile = json.loads(data.decode('utf-8'))

    return jsonFile
