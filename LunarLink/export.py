import json

UDP_IP = "127.0.0.1"
UDP_PORT = 5005
EXPORT_FILE = "lunarLink"

class ExportFormat:
    def __init__(self, tpq = {}, commandList = [-1] * 165):
        self.tpq = tpq
        self.commandList = commandList


    def to_dict(self):
        return {
            "tpq": self.tpq,
            "commandList": self.commandList
        }

    def to_json(self):
        return json.dumps(self.to_dict())
    
    def save_to_file(self, filename=EXPORT_FILE):
        with open(filename, 'w') as file:
            json.dump(self.to_dict(), file, indent=4)
        print(f"[INFO] Exported to {filename}")

    def update_command(self, index, value):
        index -= 2 # commands are 2 indexed and this zero index's them
        if 0 <= index < len(self.commandList):
            self.commandList[index] = value
        else:
            raise IndexError("Command index out of bounds")
    
    def update_tpq(self, updateTPQ):
        if type(updateTPQ) is not dict:
            raise ValueError("TPQ must be dictionary")

        self.tpq.update(updateTPQ)
        
    def clear_tpq(self):
        self.tpq.clear()