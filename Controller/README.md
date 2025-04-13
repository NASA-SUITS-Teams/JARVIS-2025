# Game Controller to UDP Vehicle Interface

This Python script allows you to control a remote vehicle or simulator using a game controller (e.g., Xbox controller). It sends throttle, brake, steering, and light commands over UDP in real-time.

## Features

- Real-time control via joystick inputs
- Throttle, braking, steering, and lights
- Smooth acceleration/deceleration logic
- Customizable deadzone
- UDP-based communication using binary packet structure

---

## Requirements

- Python 3.x
- `pygame` library  
  Install with:  
  ```bash
  pip install pygame
  ```
- A compatible game controller (e.g., Xbox controller)
- A network-accessible system listening for UDP packets

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/controller-udp-interface.git
cd controller-udp-interface
```

### 2. Configure the Target Address

Update the following lines in the script to match the IP and port of your target system:

```python
URL = "128.10.2.13"  # Target IP address
PORT = 14141         # Target UDP port
```

### 3. Run the Script

```bash
python controller_udp.py
```

---

## Controls

| Input             | Action                         |
|------------------|--------------------------------|
| **Left Stick X**  | Steering left/right            |
| **Right Trigger** | Throttle (increase speed)      |
| **Left Trigger**  | Brake                          |
| **RB (Button 5)** | Reverse throttle (decrease speed) |
| **LB (Button 4)** | Toggle lights on/off           |

---

## UDP Packet Structure

UDP messages are sent using the following binary structure:

```python
struct.pack(">IIf", timestamp, command_id, value)
```

| Field       | Type        | Description                      |
|-------------|-------------|----------------------------------|
| `timestamp` | `uint32`    | Unix timestamp                   |
| `command_id`| `uint32`    | Unique ID for each command       |
| `value`     | `float32`   | The value of the command         |

---

## Command Reference

| Command   | ID    | Value Range       |
|-----------|-------|-------------------|
| `light`   | 1103  | `True` / `False`  |
| `brake`   | 1107  | `0.0` to `1.0`    |
| `throttle`| 1109  | `-100` to `100`   |
| `steering`| 1110  | `-100` to `100`   |

---
