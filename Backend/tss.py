import requests

BASE_URL = "http://192.168.51.110:14141/json_data"
TEAM_NUMBER = 4

DATA_KEYS = [
    "ERROR", # error
    "IMU",
    "SPEC", # spec
    "ROVER", # rover
    #"DCU",
    #"UIA", # uia
]

TEAM_DATA_KEYS = [
    "ROVER_TELEMETRY", # rover telemetry
    "TELEMETRY", # eva telemetry
    "EVA", # eva status,
]


# data will be returned in a dictionary format with keys as file names as mentioned above in FILE_KEYS
def fetch_tss_json_data():
    data = {}

    # fetch all general data from TSS
    for key in DATA_KEYS:
        url = f"{BASE_URL}/{key}.json"

        try:
            resp = requests.get(url, timeout=5)
            resp.raise_for_status()
            
            data[key] = resp.json()
        except requests.RequestException as e:
            print(f"Error fetching {key}.json: {e}")
            data[key] = None

    # fetch all specific team data from TSS
    for key in TEAM_DATA_KEYS:
        url = f"{BASE_URL}/teams/{TEAM_NUMBER}/{key}.json"

        try:
            resp = requests.get(url, timeout=5)
            resp.raise_for_status()
            
            data[key] = resp.json()
        except requests.RequestException as e:
            print(f"Error fetching {key}.json: {e}")
            data[key] = None

    return data

# Helper function to fetch the needed LIDAR and rover telemtry data to process lidar in the pathfinding_map setup
def convert_tss_for_lidar():
    raw = fetch_tss_json_data()

    # If any fetch failed, error out
    if raw is None or any(raw[k] is None for k in ['ROVER', 'ROVER_TELEMETRY']):
        print("Error: incomplete TSS data")
        return None

    # Construct the LIDAR and rover telemetry data
    try:
        rt = raw['ROVER_TELEMETRY']['pr_telemetry']
        lidar = rt['lidar']
        position = [
            rt['current_pos_x'],
            rt['current_pos_y'],
            rt['current_pos_alt'],  # altitude
            rt['heading'],          # yaw
            rt['pitch'],
            rt['roll'],
        ]
    except KeyError as e:
        print(f"Error: missing key {e} in TSS payload")
        return None

    return lidar, position