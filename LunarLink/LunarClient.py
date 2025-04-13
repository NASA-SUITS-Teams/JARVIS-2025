import socket
import json
import getTSS
import time
class lunarClient():
    def __init__(self):
        self.lunarSock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.tssSock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

    def updateRover(self, ip = "127.0.0.1", port = 5005, TssIP = "data.cs.purdue.edu", TssPort = 14141):
        #loop call tss for every rover command value and append number and value tuple into message then send

        roverMessage = {
            "action": "update",
            "commandUpdate": []
        }
        for commandNum in range(119,167):
            #not including LIDAR command since EVA won't need that information
            data = getTSS.get_tss_data(clientSocket=self.tssSock, cmd_num=commandNum, addr=(TssIP, TssPort))
            roverMessage['commandUpdate'].append((commandNum, data[2][0]))

        
        self.lunarSock.sendto(json.dumps(roverMessage).encode('utf-8'), (ip, port))

    def updateEVA(self, ip = "127.0.0.1", port = 5005, TssIP = "data.cs.purdue.edu", TssPort = 14141):
    #loop call tss for every rover command value and append number and value tuple into message then send
        EVAMessage = {
            "action": "update",
            "commandUpdate": []
        }
        for commandNum in range(2,119):
            data = getTSS.get_tss_data(clientSocket=self.tssSock, cmd_num=commandNum, addr=(TssIP, TssPort))
            EVAMessage['commandUpdate'].append((commandNum, data[2][0]))

        
        self.lunarSock.sendto(json.dumps(EVAMessage).encode('utf-8'), (ip, port))

    def getData(self, ip = "127.0.0.1", port = 5005): # returns a json file of the entire lunar link
        self.lunarSock.sendto(json.dumps({"action": "get"}).encode('utf-8'), (ip, port))
        data, addr = self.lunarSock.recvfrom(4096)
        jsonFile = json.loads(data.decode('utf-8'))

        return jsonFile
lunar = lunarClient()
# while True:
#      test2 = lunar.updateEVA(ip = "172.20.10.2", port = 5005, TssIP = "data.cs.purdue.edu", TssPort = 14141)
#      test1 = lunar.getData(ip = "172.20.10.2", port = 5005)
#      print(test1)

variable = 0
for i in range(100, 110):
    roverMessage = {
        "action": "update",
        "commandUpdate": [(2,i)]
    }
    lunar.updateEVA(ip = "172.20.10.2", port = 5005, TssIP = "data.cs.purdue.edu", TssPort = 14141)
    test1 = lunar.getData(ip = "172.20.10.2", port = 5005)
    print(test1)
    time.sleep(1)