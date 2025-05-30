import socket
import json
from LunarLink import export, getTSS
import time


class LunarLink:
    def __init__(self, tpq, cmd_lst, ip = "127.0.0.1", port = 5005): # put everything in init so it can be called opened in another file
        self.UDP_IP = ip
        self.UDP_PORT = port
        self.EXPORT_FILE = "lunarLink.json"

        self.sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.sock.bind((self.UDP_IP, self.UDP_PORT))

        self.jsonFile = export.ExportFormat(tpq, cmd_lst) # initializes the json file with tpq being an emtpy dicitionary and command array of 166 entries of invalid value of 200 for now

    def server_loop(self):
        while True:


            print(self.jsonFile)


            # self.updateRover_loop() needs to be threaded
            #look for json files being sent from client here to update main one here    
            # update and send new data that is requested from clients
            data, addr = self.sock.recvfrom(4096)


            try:
                message = json.loads(data.decode('utf-8'))
                action = message.get("action")


                if action == "update": # update new value in jason file


                    tpq_update = message.get("tpq", {})
                    self.jsonFile.update_tpq(tpq_update)  # update tpq


                    command_update = message.get("commandUpdate")
                    if command_update: # command update route
                        for pair in command_update:
                            commandNum, value = pair
                            self.jsonFile.update_command(commandNum, value)


                    self.jsonFile.save_to_file(self.EXPORT_FILE) # saves the file locally to save data in case of crash


                elif action == "get": # get value from json file
                    self.sock.sendto(self.jsonFile.to_json().encode('utf-8'), addr)
                    print(f"[SENT] Sent current state to {addr}")


                else:
                    # Invalid action
                    response = {"status": "error", "message": "Invalid action"}
                    self.sock.sendto(json.dumps(response).encode('utf-8'), addr)
                    continue


            except UnicodeDecodeError as e:
                print(f"[UNICODE ERROR] {e} - Raw data: {data}")
                self.sock.sendto(b'{"status": "error", "message": "Invalid JSON"}', addr)
                continue
            except json.JSONDecodeError:
                print(f"[ERROR] Invalid JSON received from {addr}")
                self.sock.sendto(b'{"status": "error", "message": "Invalid JSON"}', addr)
                continue

    
           








