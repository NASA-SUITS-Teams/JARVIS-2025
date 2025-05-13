import requests

BASE_URL = "http://data.cs.purdue.edu:14141/json_data"

FILE_KEYS = [
    #"DCU",
    "ERROR", # error
    #"IMU",
    "ROVER", # rover
    "SPEC", # spec
    #"UIA", # uia
]

# data will be retruned in a dictionary format with keys as file names as mentioned above in FILE_KEYS
def fetch_json_data():
    data = {}

    for key in FILE_KEYS:
        url = f"{BASE_URL}/{key}.json"

        try:
            resp = requests.get(url, timeout=5)
            resp.raise_for_status()
            
            data[key] = resp.json()
        except requests.RequestException as e:
            print(f"Error fetching {key}.json: {e}")
            data[key] = None

    # fetch rover telemtry data which is a unique URL that is team based
    url = f"{BASE_URL}/teams/0/ROVER_TELEMETRY.json"
    key = "ROVER_TELEMETRY"

    try:
        resp = requests.get(url, timeout=5)
        resp.raise_for_status()
            
        data[key] = resp.json()
    except requests.RequestException as e:
        print(f"Error fetching {key}.json: {e}")
        data[key] = None

    return data