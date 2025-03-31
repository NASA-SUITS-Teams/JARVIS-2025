"""
CURRENT ISSUES:

1. Braking does not work -- most likely on NASA's end, commands are being sent.
2. Lighting -- cannot see in some areas, add lights to rover?
3. Reversing?
    - Cannot send (throttle, -100), then (throttle, 100) or vice versa. Rover will come to a complete stop, and no other commands work despite being sent.
4. If command (throttle, 100) is sent and then (throttle, 0) the rover will go indefinately maintain speed of (throttle, 100); could be issue with code, but I think it is a similar issue as 3.
5. No commands sent, but when menu button is hit on controller, rover jumps forward.
6. Is throttle acceleration or speed.
"""

import pygame
import socket
import struct
import time

# UDP Configuration
COMMANDS = {
    "brake": 1107, # 0 to 1
    "throttle": 1109, # -100 to 100
    "steering": 1110 # -100 to 100
}
URL = "128.10.2.13"
PORT = 14141

# Initialize UDP socket
udp_client = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

def send_command(command, value):
    timestamp = int(time.time())
    message = struct.pack(">IIf", timestamp, command, value)
    udp_client.sendto(message, (URL, PORT))
    print(f"Sent Command {command}: {value}")

# Initialize Pygame
pygame.init()
pygame.joystick.init()
send_command(COMMANDS["throttle"], 0)
send_command(COMMANDS["brake"], 0)
send_command(COMMANDS["steering"], 0)




class Controller:
    def __init__(self):
        self.controller = pygame.joystick.Joystick(0) if pygame.joystick.get_count() > 0 else None
        if self.controller:
            self.controller.init()
        self.deadzone = 0.5  # Deadzone to ignore small joystick movements

    def handle_input(self):
        if self.controller:
            axis_y = self.controller.get_axis(1)  # throttle (-100 to 100)
            axis_x = self.controller.get_axis(0)  # Steering (-1 to 1)
            lt = (self.controller.get_axis(4) + 1) / 2  # LT (0 to 1)
            rt = (self.controller.get_axis(5) + 1) / 2  # RT (0 to 1)

            up = self.controller.get_button(5) # RB (0 to 1)

            # Throttle and Brake
            if rt > 0.1 and rt != 0.5:
                send_command(COMMANDS["throttle"], 100)
            if lt > 0.1 and lt != 0.5:
                send_command(COMMANDS["brake"], 1)
            elif lt < 0.1:
                send_command(COMMANDS["brake"], 0)

            # throttling with deadzone
            if (up > 0.1):
                send_command(COMMANDS["throttle"], -100)

            elif abs(axis_y) > self.deadzone:
                send_command(COMMANDS["throttle"], 100)

            # steering with deadzone
            if abs(axis_x) > self.deadzone:
                send_command(COMMANDS["steering"], axis_x)
            else:
                send_command(COMMANDS["steering"], 0)

# Pygame Main Loop
controller = Controller()
clock = pygame.time.Clock()

running = True

while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            send_command(COMMANDS["throttle"], 0)
            send_command(COMMANDS["brake"], 0)
            send_command(COMMANDS["steering"], 0)

            running = False
    controller.handle_input()
    clock.tick(40)

pygame.quit()
udp_client.close()


