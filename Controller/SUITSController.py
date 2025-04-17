import pygame
import socket
import struct
import time

# UDP Configuration
COMMANDS = {
    "light": 1103, #true or false
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
send_command(COMMANDS["light"], False)
send_command(COMMANDS["throttle"], 0)
send_command(COMMANDS["brake"], 0)
send_command(COMMANDS["steering"], 0)

class Controller:
    def __init__(self):
        self.controller = pygame.joystick.Joystick(0) if pygame.joystick.get_count() > 0 else None
        if self.controller:
            self.controller.init()
        self.deadzone = 0.5  # Deadzone to ignore small joystick movements

        self.lights = False
        self.light_pressed_last = False
        self.speed = 0
        self.music = False
        self.Interstellar = pygame.mixer.Sound('Interstellar.mp3')


    def handle_input(self):
        if self.controller:
            axis_y = self.controller.get_axis(1)  # throttle (-100 to 100)
            axis_x = self.controller.get_axis(0)  # Steering (-1 to 1)
            lt = (self.controller.get_axis(4) + 1) / 2  # LT/Brake (0 to 1)
            rt = (self.controller.get_axis(5) + 1) / 2  # RT/Gas (0 to 1)
            but0 = (self.controller.get_button(0))
            but4 = (self.controller.get_button(4))
            up = self.controller.get_button(5) # RB (0 to 1)

            # Lights
            if but4 and not self.light_pressed_last:
                print("music!!!!!")
                self.lights = not self.lights
                send_command(COMMANDS["light"], self.lights)
            self.light_pressed_last = but4

            # Music
            if but0 and not self.music:
                self.music = not self.music
                self.Interstellar.play()            
            self.music = but0

            # Throttle and Brake
            if rt > 0.1 and rt != 0.5:
                if (self.speed < 100):
                    self.speed += 1
                send_command(COMMANDS["throttle"], self.speed)
            if lt > 0.1 and lt != 0.5:
                send_command(COMMANDS["brake"], 1)
                send_command(COMMANDS['throttle'], 0)
            #elif lt < 0.1:
                #send_command(COMMANDS["brake"], 0)

            # throttling with deadzone
            if (up > 0.5):
                if (self.speed > -100):
                    self.speed -= 1
                send_command(COMMANDS["throttle"], self.speed)
            #if (axis_y > 0.5):
                #send_command(COMMANDS['throttle'], -100)

            elif abs(axis_y) > self.deadzone:
                send_command(COMMANDS["throttle"], 100)

            # steering with deadzone
            if abs(axis_x) > self.deadzone:
                send_command(COMMANDS["steering"], axis_x)
            else:
                send_command(COMMANDS["steering"], 0)
            
            if (up < 0.5 and rt <0.1 and self.speed > 0):
                self.speed -= 0.5
                if (lt < 0.1):
                    
                    send_command(COMMANDS["throttle"], self.speed)

            if (up < 0.5 and rt <0.1 and self.speed < 0):
                self.speed += 0.5
                if (lt < 0.1):
                    send_command(COMMANDS["throttle"], self.speed)


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


