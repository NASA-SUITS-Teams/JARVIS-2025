import socket
import json
import export

class LunarLink:
    def __init__(self, ip = "127.0.0.1", port = 5005): # put everything in init so it can be called opened in another file
        UDP_IP = ip
        UDP_PORT = port
        EXPORT_FILE = "lunarLink.json"

        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.bind((UDP_IP, UDP_PORT))

        jsonFile = export.ExportFormat() # initializes the json file with tpq being an emtpy dicitionary and command array of 166 entries of invalid value of 200 for now


        while True:
            #look for json files being sent from client here to update main one here    
            # update and send new data that is requested from clients
            data, addr = sock.recvfrom(4096)

            try:
                message = json.loads(data.decode('utf-8'))
                action = message.get("action")

                if action == "update": # update new value in jason file

                    tpq_update = message.get("tpq", {})
                    jsonFile.tpq.update(tpq_update)  # update tpq

                    command_update = message.get("commandUpdate")
                    if command_update: # command update route
                        for pair in command_update:
                            commandNum, value = pair
                            jsonFile.update_command(commandNum, value)

                    jsonFile.save_to_file(EXPORT_FILE) # saves the file locally to save data in case of crash

                elif action == "get": # get value from json file
                    sock.sendto(jsonFile.to_json().encode('utf-8'), addr)
                    print(f"[SENT] Sent current state to {addr}")

                else:
                    # Invalid action
                    response = {"status": "error", "message": "Invalid action"}
                    sock.sendto(json.dumps(response).encode('utf-8'), addr)
                    continue

            except UnicodeDecodeError as e:
                print(f"[UNICODE ERROR] {e} - Raw data: {data}")
                sock.sendto(b'{"status": "error", "message": "Invalid JSON"}', addr)
                continue
            except json.JSONDecodeError:
                print(f"[ERROR] Invalid JSON received from {addr}")
                sock.sendto(b'{"status": "error", "message": "Invalid JSON"}', addr)
                continue