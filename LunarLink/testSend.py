import socket
import json

UDP_IP = "127.0.0.1"
UDP_PORT = 5005

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

# Send update
message = {  # update format to update tpq or command num
    "action": "update",
    "tpq": {"scan rocks": 1},
    "commandUpdate": {
        "commandNum": 50,
        "value": 50
    }
}
sock.sendto(json.dumps(message).encode('utf-8'), (UDP_IP, UDP_PORT))

# Request full state
sock.sendto(json.dumps({"action": "get"}).encode('utf-8'), (UDP_IP, UDP_PORT))
data, addr = sock.recvfrom(4096)
jsonFile = json.loads(data.decode('utf-8'))
print("State:", jsonFile.get("tpq"))
