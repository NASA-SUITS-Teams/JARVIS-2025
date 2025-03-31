import socket
import json

UDP_IP = "127.0.0.1"
UDP_PORT = 5005

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

# Request full state
sock.sendto(json.dumps({"action": "get"}).encode('utf-8'), (UDP_IP, UDP_PORT))
data, addr = sock.recvfrom(4096)
jsonFile = json.loads(data.decode('utf-8'))
print("State:", jsonFile.get("tpq"))
