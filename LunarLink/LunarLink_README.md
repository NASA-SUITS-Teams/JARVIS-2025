# LunarLink: EVA & Rover Data Synchronization Server

LunarLink is a Python-based UDP server-client system that interfaces with a telemetry data provider (TSS) to retrieve, update, and manage command data for both an EVA suit and rover systems. The system is designed to be modular and expandable, supporting both local and network communication.

---

## 📁 Project Structure

```
LunarLink/
├── LunarLink_Server.py       # Main server loop handling client updates and retrieval
├── LunarClient.py            # Client interface to send/receive EVA/Rover data
├── getTSS.py                 # Utility to connect and fetch telemetry data from TSS
├── export.py                 # Class to manage JSON export format and file I/O
├── lunarLink.json            # Local JSON cache storing TPQ and commandList
└── README.md                 # This file
```

---

## ⚙️ Features

- **UDP Server** that listens for:
  - `update` requests to modify EVA or rover command values
  - `get` requests to retrieve the current system state
- **TPQ (Task Priority Queue)** updates are supported via client messages.
- **Periodic Rover Command Updates** using the `updateRover_loop()` (designed to be threaded).
- **Modular Client** with methods:
  - `updateRover()`
  - `updateEVA()`
  - `getData()`
- **Fault-Tolerant JSON Parsing** with robust error handling.
- **Local Data Persistence** in the `lunarLink.json` file to safeguard against data loss.

---

## 🚀 How It Works

### Server (`LunarLink_Server.py`)
- **Listening for Messages:**  
  The server listens on a UDP port for incoming JSON messages.
  
- **Processing Actions:**  
  Depending on the action received in the JSON message, the server will either:
  - **Update:** Modify the internal TPQ and command list, then save the changes to file.
  - **Get:** Send the current system state back to the requesting client.

### Client (`LunarClient.py`)
- **Command Data Retrieval:**  
  Periodically fetches command values from TSS for either EVA or rover modules.

- **Data Transmission:**  
  Sends update messages to the server using a UDP socket.
  
- **Data Retrieval:**  
  Can request the current state of the system with the `getData()` method.

### Data Export (`export.py`)
- **Data Handling:**  
  Manages the JSON structure used for communication and storage.
  
- **Features:**  
  - Converts internal data to JSON.
  - Provides methods to update commands or TPQ values.
  - Saves data to disk to prevent loss in the event of a crash.

---

## 🔌 Getting Started

### Prerequisites
- Python 3.6 or higher.
- Access to the telemetry server (`data.cs.purdue.edu`).
- Ensure port 14141 is open for TSS communication.

### Running the Server
Start the server by executing:

```bash
python3 LunarLink_Server.py
```

### Running the Client
Instantiate the client in a Python script and use its methods:

```python
from LunarClient import lunarClient

client = lunarClient()

# Updating rover commands
client.updateRover(ip="127.0.0.1", port=5005)

# Updating EVA commands
client.updateEVA(ip="127.0.0.1", port=5005)

# Getting the current state
state = client.getData(ip="127.0.0.1", port=5005)
print(state)
```

---

## 🧪 Testing

The project includes commented-out sections in the code (within `LunarClient.py`) for testing periodic updates and data retrievals. Uncomment these sections to simulate a continuous stream of EVA or rover data updates and observe the server's JSON updates.

---

## 📝 Additional Notes

- **Command Indexing:**  
  Command numbers are provided as 2-indexed values but are stored as zero-indexed internally.
  
- **Data Persistence:**  
  The server periodically saves all updates to `lunarLink.json` to mitigate data loss during unexpected shutdowns.
  
- **LIDAR Commands:**  
  LIDAR command retrievals have been intentionally omitted for EVA.

---

## 📌 Future Improvements

- Integrate more advanced TPQ task prioritization logic.
- Enhance multi-threading support for continuous TSS data updates on the server.
- Explore adding secure communication layers (e.g., DTLS).
- Consider a REST API implementation to complement UDP communication.

---

## 📜 License

MIT License – see the `LICENSE.md` file for details.

