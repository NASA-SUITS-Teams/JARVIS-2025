import requests

BASE_URL = "http://data.cs.purdue.edu:14141/json_data"
TEAM_NUMBER = 0

DATA_KEYS = [
    #"DCU",
    "ERROR", # error
    "IMU",
    "ROVER", # rover
    "SPEC", # spec
    #"UIA", # uia
]

TEAM_DATA_KEYS = [
    "ROVER_TELEMETRY", # rover telemetry
    "TELEMETRY", # eva telemetry
    "EVA" # eva status
]

# data will be retruned in a dictionary format with keys as file names as mentioned above in FILE_KEYS
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