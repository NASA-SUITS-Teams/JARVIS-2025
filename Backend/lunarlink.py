import requests
import time

# @TODO change this URL to the correct one that AetherNet is using
BASE_URL = "100.66.113.144:14141"
PORT=5000

# make request to /now
def fetch_lunarlink_json_data():
    data = {}
    url = f"http://{BASE_URL}:{PORT}/now"

    try:
        resp = requests.get(url, timeout=5)
        resp.raise_for_status()
        data = resp.json()
    except requests.RequestException as e:
        print(f"Error fetching data from {url}: {e}")
        data = None

    return data


def send_lunarlink_data(tss_data):
    rover_telemetry = tss_data.get("ROVER_TELEMETRY", {})
    rover_position = tss_data.get("ROVER")

    if not rover_telemetry or not rover_position:
        return {"error": "Rover telemetry or position data not available"}

    return {
        "rover_telemetry": rover_telemetry,
        "rover_position": rover_position,
        "pins": [{
            "x": -5766.5,
            "y": -10200.1,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        },
        {
            "x": -5766.5,
            "y": -10200.1,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        }]
    }
