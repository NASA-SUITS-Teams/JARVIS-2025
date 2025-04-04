# 🌕 LunarLink

**LunarLink** is a UDP-based communication system designed to facilitate data exchange between a central server and multiple clients (e.g., lunar rovers). The server maintains a shared state (command list and TPQ dictionary) which clients can update or request using simple JSON-based messages.

---

## 📂 Project Structure

```
lunar_link/
│
├── lunar_link_server.py     # Main server class (LunarLink)
├── export.py                # ExportFormat class used for managing shared state
├── client.py                # Example client sending update and get requests
└── getTSS.py                # (Assumed) provides get_tss_data method
```

---

## 🛰️ How It Works

### Server (`lunar_link_server.py`)

- Listens for incoming JSON messages from clients
- Accepts two main actions:
  - `"update"`: Updates TPQ values and/or command list entries
  - `"get"`: Returns the current state to the requesting client
- Saves state to `lunarLink.json` to preserve data between runs

### Shared State (`ExportFormat` in `export.py`)

- `tpq`: Dictionary for storing task priority queue entries
- `commandList`: Fixed-size list of command values (2 - 166)
- Includes methods for updating, clearing, and exporting to JSON

### Client (`client.py`)

- Sends an update with both TPQ data and command updates
- Then sends a `"get"` request to retrieve the current server state
- Includes a helper function `updateRover()` to mass-update command values from TSS

---

## 📡 Message Formats

### Update Message

```json
{
  "action": "update",
  "tpq": { "scan rocks": 1 },
  "commandUpdate": [
    (50, 50),
    (65, 65)
  ]
}
```

### Get Message

```json
{
  "action": "get"
}
```
