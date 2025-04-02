import socket
import json
import export

UDP_IP = "127.0.0.1"
UDP_PORT = 5005
EXPORT_FILE = "lunarLink.json"


sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.bind((UDP_IP, UDP_PORT))


# global set of ip addresses
ipAddresses = set()

jsonFile = export.ExportFormat() # initializes the json file with tpq being an emtpy dicitionary and command array of 166 entries of invalid value of 200 for now


while True:
    #look for json files being sent from client here to update main one here    
    # update and send new data that is requested from clients
    data, addr = sock.recvfrom(4096)

    ipAddresses.add(addr)

    try:
        message = json.loads(data.decode('utf-8'))
        action = message.get("action")

        if action == "update": # update new value in jason file

            tpq_update = message.get("tpq", {})
            jsonFile.tpq.update(tpq_update)  # update tpq

            command_update = message.get("commandUpdate")
            if command_update: # command update route
                try:
                    commandNum = command_update.get("commandNum")
                    value = command_update.get("value")
                    jsonFile.update_command(commandNum, value)
                    print(f"[UPDATE] Updated command at commandNum {commandNum} with value {value}")
                except Exception as e:
                    print(f"[ERROR] Command update error: {e}")

            jsonFile.save_to_file(EXPORT_FILE) # saves the file locally to save data in case of crash

        elif action == "get": # get value from json file
            sock.sendto(jsonFile.to_json().encode('utf-8'), addr)
            print(f"[SENT] Sent current state to {addr}")

        else:
            # Invalid action
            response = {"status": "error", "message": "Invalid action"}
            sock.sendto(json.dumps(response).encode('utf-8'), addr)


    except json.JSONDecodeError:
        print(f"[ERROR] Invalid JSON received from {addr}")
        sock.sendto(b'{"status": "error", "message": "Invalid JSON"}', addr)

