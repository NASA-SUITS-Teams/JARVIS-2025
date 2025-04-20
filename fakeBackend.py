#for testing

from LunarLink import LunarLink_Server as LunarLink
from LunarLink import LunarClient as client
import threading
import time

lunar_link = LunarLink.LunarLink("0.0.0.0")
server_thread = threading.Thread(target=lunar_link.server_loop)
server_thread.daemon = True
server_thread.start()

update_thread = threading.Thread(target=lunar_link.updateRover_loop)
update_thread.daemon = True
update_thread.start()
lunarClient = client.lunarClient()

try:
    print("Server is running. Press Ctrl+C to stop.")
    while True:
        time.sleep(1)  # Keeps the main thread alive
        print(lunarClient.getData("172.20.10.2"))
except KeyboardInterrupt:
    print("\nShutting down server gracefully...")