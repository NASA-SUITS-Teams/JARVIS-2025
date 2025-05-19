import requests
import time

# @TODO change this URL to the correct one that AetherNet is using
BASE_URL = "http://100.64.66.81:5000"

# make request to /now
def fetch_lunarlink_json_data(tss_data):
    data = {}
    url = f"{BASE_URL}/now"

    try:
        print(f"Fetching data from {url}")
        resp = requests.get(url, timeout=5)
        resp.raise_for_status()
        data = resp.json()
    except requests.RequestException as e:
        print(f"Error fetching data from {url}: {e}")
        data = None

    return parse_lunarlink_json_data(data, tss_data)

def parse_lunarlink_json_data(unparsed_data, tss_data):
    copy_tss = tss_data

    # DCU EVA 1
    copy_tss["DCU"]["dcu"]["eva1"]["batt"] = unparsed_data["data"]["2"]
    copy_tss["DCU"]["dcu"]["eva1"]["oxy"] = unparsed_data["data"]["3"]
    copy_tss["DCU"]["dcu"]["eva1"]["comm"] = unparsed_data["data"]["4"]
    copy_tss["DCU"]["dcu"]["eva1"]["fan"] = unparsed_data["data"]["5"]
    copy_tss["DCU"]["dcu"]["eva1"]["pump"] = unparsed_data["data"]["6"]
    copy_tss["DCU"]["dcu"]["eva1"]["co2"] = unparsed_data["data"]["7"]

    # DCU EVA 2
    copy_tss["DCU"]["dcu"]["eva2"]["batt"] = unparsed_data["data"]["8"]
    copy_tss["DCU"]["dcu"]["eva2"]["oxy"] = unparsed_data["data"]["9"]
    copy_tss["DCU"]["dcu"]["eva2"]["comm"] = unparsed_data["data"]["10"]
    copy_tss["DCU"]["dcu"]["eva2"]["fan"] = unparsed_data["data"]["11"]
    copy_tss["DCU"]["dcu"]["eva2"]["pump"] = unparsed_data["data"]["12"]
    copy_tss["DCU"]["dcu"]["eva2"]["co2"] = unparsed_data["data"]["13"]

    # ERROR STATES
    copy_tss["ERROR"]["error"]["fan_error"] = unparsed_data["data"]["14"]
    copy_tss["ERROR"]["error"]["oxy_error"] = unparsed_data["data"]["15"]
    copy_tss["ERROR"]["error"]["pump_error"] = unparsed_data["data"]["16"]

    # EVA1 IMU
    copy_tss["IMU"]["imu"]["eva1"]["posx"] = unparsed_data["17"]
    copy_tss["IMU"]["imu"]["eva1"]["posy"] = unparsed_data["18"]
    copy_tss["IMU"]["imu"]["eva1"]["heading"] = unparsed_data["19"]

    # EVA2 IMU
    copy_tss["IMU"]["imu"]["eva2"]["posx"] = unparsed_data["20"]
    copy_tss["IMU"]["imu"]["eva2"]["posy"] = unparsed_data["21"]
    copy_tss["IMU"]["imu"]["eva2"]["heading"] = unparsed_data["22"]

    # EVA 1 SPEC
    copy_tss["SPEC"]["spec"]["eva1"]["id"] = unparsed_data["31"]
    copy_tss["SPEC"]["spec"]["eva1"]["SiO2"] = unparsed_data["32"]
    copy_tss["SPEC"]["spec"]["eva1"]["TiO2"] = unparsed_data["33"]
    copy_tss["SPEC"]["spec"]["eva1"]["Al203"] = unparsed_data["34"]
    copy_tss["SPEC"]["spec"]["eva1"]["Fe0"] = unparsed_data["35"]
    copy_tss["SPEC"]["spec"]["eva1"]["Mn0"] = unparsed_data["36"]
    copy_tss["SPEC"]["spec"]["eva1"]["Mg0"] = unparsed_data["37"]
    copy_tss["SPEC"]["spec"]["eva1"]["Ca0"] = unparsed_data["38"]
    copy_tss["SPEC"]["spec"]["eva1"]["K20"] = unparsed_data["39"]
    copy_tss["SPEC"]["spec"]["eva1"]["P2O3"] = unparsed_data["40"]
    copy_tss["SPEC"]["spec"]["eva1"]["other"] = unparsed_data["41"]

    # EVA 2 SPEC
    copy_tss["SPEC"]["spec"]["eva2"]["id"] = unparsed_data["42"]
    copy_tss["SPEC"]["spec"]["eva2"]["SiO2"] = unparsed_data["43"]
    copy_tss["SPEC"]["spec"]["eva2"]["TiO2"] = unparsed_data["44"]
    copy_tss["SPEC"]["spec"]["eva2"]["Al203"] = unparsed_data["45"]
    copy_tss["SPEC"]["spec"]["eva2"]["Fe0"] = unparsed_data["46"]
    copy_tss["SPEC"]["spec"]["eva2"]["Mn0"] = unparsed_data["47"]
    copy_tss["SPEC"]["spec"]["eva2"]["Mg0"] = unparsed_data["48"]
    copy_tss["SPEC"]["spec"]["eva2"]["Ca0"] = unparsed_data["49"]
    copy_tss["SPEC"]["spec"]["eva2"]["K20"] = unparsed_data["50"]
    copy_tss["SPEC"]["spec"]["eva2"]["P2O3"] = unparsed_data["51"]
    copy_tss["SPEC"]["spec"]["eva2"]["other"] = unparsed_data["52"]

    # UIA
    copy_tss["UIA"]["uia"]["eva1_power"] = unparsed_data["53"]
    copy_tss["UIA"]["uia"]["eva1_oxy"] = unparsed_data["54"]
    copy_tss["UIA"]["uia"]["eva1_water_supply"] = unparsed_data["55"]
    copy_tss["UIA"]["uia"]["eva1_water_waste"] = unparsed_data["56"]
    copy_tss["UIA"]["uia"]["eva2_power"] = unparsed_data["57"]
    copy_tss["UIA"]["uia"]["eva2_oxy"] = unparsed_data["58"]
    copy_tss["UIA"]["uia"]["eva2_water_supply"] = unparsed_data["59"]
    copy_tss["UIA"]["uia"]["eva2_water_waste"] = unparsed_data["60"]
    copy_tss["UIA"]["uia"]["oxy_vent"] = unparsed_data["61"]
    copy_tss["UIA"]["uia"]["depress"] = unparsed_data["62"]

    # TELEMETRY
    copy_tss["TELEMETRY"]["telemetry"]["eva_time"] = unparsed_data["63"]

    # EVA1 TELEMETRY
    copy_tss["TELEMETRY"]["telemetry"]["eva1"]["batt_time_left"] = unparsed_data["64"]
    copy_tss["TELEMETRY"]["telemetry"]["eva1"]["oxi_pri_storage"] = unparsed_data["65"]
    copy_tss["TELEMETRY"]["telemetry"]["eva1"]["oxy_sec_storage"] = unparsed_data["66"]
    copy_tss["TELEMETRY"]["telemetry"]["eva1"]["oxi_pri_pressure"] = unparsed_data["67"]
    copy_tss["TELEMETRY"]["telemetry"]["eva1"]["oxy_sec_pressure"] = unparsed_data["68"]
    copy_tss["TELEMETRY"]["telemetry"]["eva1"]["oxy_time_left"] = unparsed_data["69"]
    copy_tss["TELEMETRY"]["telemetry"]["eva1"]["heart_rate"] = unparsed_data["70"]
    copy_tss["TELEMETRY"]["telemetry"]["eva1"]["oxy_consumption"] = unparsed_data["71"]
    copy_tss["TELEMETRY"]["telemetry"]["eva1"]["co2_production"] = unparsed_data["72"]
    copy_tss["TELEMETRY"]["telemetry"]["eva1"]["suit_pressure_oxy"] = unparsed_data["73"]
    copy_tss["TELEMETRY"]["telemetry"]["eva1"]["suit_pressure_co2"] = unparsed_data["74"]
    copy_tss["TELEMETRY"]["telemetry"]["eva1"]["suit_pressure_other"] = unparsed_data["75"]
    copy_tss["TELEMETRY"]["telemetry"]["eva1"]["suit_pressure_total"] = unparsed_data["76"]
    copy_tss["TELEMETRY"]["telemetry"]["eva1"]["fan_pri_rpm"] = unparsed_data["77"]
    copy_tss["TELEMETRY"]["telemetry"]["eva1"]["fan_sec_rpm"] = unparsed_data["78"]
    copy_tss["TELEMETRY"]["telemetry"]["eva1"]["helmet_pressure_co2"] = unparsed_data["79"]
    copy_tss["TELEMETRY"]["telemetry"]["eva1"]["scrubber_a_co2_storage"] = unparsed_data["80"]
    copy_tss["TELEMETRY"]["telemetry"]["eva1"]["scrubber_b_co2_storage"] = unparsed_data["81"]
    copy_tss["TELEMETRY"]["telemetry"]["eva1"]["temperature"] = unparsed_data["82"]
    copy_tss["TELEMETRY"]["telemetry"]["eva1"]["coolant_ml"] = unparsed_data["83"]
    copy_tss["TELEMETRY"]["telemetry"]["eva1"]["coolant_gas_pressure"] = unparsed_data["84"]
    copy_tss["TELEMETRY"]["telemetry"]["eva1"]["coolant_liquid_pressure"] = unparsed_data["85"]

    # EVA2 TELEMETRY
    copy_tss["TELEMETRY"]["telemetry"]["eva2"]["batt_time_left"] = unparsed_data["86"]
    copy_tss["TELEMETRY"]["telemetry"]["eva2"]["oxi_pri_storage"] = unparsed_data["87"]
    copy_tss["TELEMETRY"]["telemetry"]["eva2"]["oxy_sec_storage"] = unparsed_data["88"]
    copy_tss["TELEMETRY"]["telemetry"]["eva2"]["oxi_pri_pressure"] = unparsed_data["89"]
    copy_tss["TELEMETRY"]["telemetry"]["eva2"]["oxy_sec_pressure"] = unparsed_data["90"]
    copy_tss["TELEMETRY"]["telemetry"]["eva2"]["oxy_time_left"] = unparsed_data["91"]
    copy_tss["TELEMETRY"]["telemetry"]["eva2"]["heart_rate"] = unparsed_data["92"]
    copy_tss["TELEMETRY"]["telemetry"]["eva2"]["oxy_consumption"] = unparsed_data["93"]
    copy_tss["TELEMETRY"]["telemetry"]["eva2"]["co2_production"] = unparsed_data["94"]
    copy_tss["TELEMETRY"]["telemetry"]["eva2"]["suit_pressure_oxy"] = unparsed_data["95"]
    copy_tss["TELEMETRY"]["telemetry"]["eva2"]["suit_pressure_co2"] = unparsed_data["96"]
    copy_tss["TELEMETRY"]["telemetry"]["eva2"]["suit_pressure_other"] = unparsed_data["97"]
    copy_tss["TELEMETRY"]["telemetry"]["eva2"]["suit_pressure_total"] = unparsed_data["98"]
    copy_tss["TELEMETRY"]["telemetry"]["eva2"]["fan_pri_rpm"] = unparsed_data["99"]
    copy_tss["TELEMETRY"]["telemetry"]["eva2"]["fan_sec_rpm"] = unparsed_data["100"]
    copy_tss["TELEMETRY"]["telemetry"]["eva2"]["helmet_pressure_co2"] = unparsed_data["101"]
    copy_tss["TELEMETRY"]["telemetry"]["eva2"]["scrubber_a_co2_storage"] = unparsed_data["102"]
    copy_tss["TELEMETRY"]["telemetry"]["eva2"]["scrubber_b_co2_storage"] = unparsed_data["103"]
    copy_tss["TELEMETRY"]["telemetry"]["eva2"]["temperature"] = unparsed_data["104"]
    copy_tss["TELEMETRY"]["telemetry"]["eva2"]["coolant_ml"] = unparsed_data["105"]
    copy_tss["TELEMETRY"]["telemetry"]["eva2"]["coolant_gas_pressure"] = unparsed_data["106"]
    copy_tss["TELEMETRY"]["telemetry"]["eva2"]["coolant_liquid_pressure"] = unparsed_data["107"]

    # EVA states
    copy_tss["EVA"]["eva"]["started"] = unparsed_data["108"]
    copy_tss["EVA"]["eva"]["paused"] = unparsed_data["109"]
    copy_tss["EVA"]["eva"]["completed"] = unparsed_data["110"]
    copy_tss["EVA"]["eva"]["total_time"] = unparsed_data["111"]
    copy_tss["EVA"]["eva"]["uia"]["started"] = unparsed_data["112"]
    copy_tss["EVA"]["eva"]["uia"]["completed"] = unparsed_data["113"]
    copy_tss["EVA"]["eva"]["uia"]["time"] = unparsed_data["114"]
    copy_tss["EVA"]["eva"]["dcu"]["started"] = unparsed_data["115"]
    copy_tss["EVA"]["eva"]["dcu"]["completed"] = unparsed_data["116"]
    copy_tss["EVA"]["eva"]["dcu"]["time"] = unparsed_data["117"]
    copy_tss["EVA"]["eva"]["rover"]["started"] = unparsed_data["118"]
    copy_tss["EVA"]["eva"]["rover"]["completed"] = unparsed_data["119"]
    copy_tss["EVA"]["eva"]["rover"]["time"] = unparsed_data["120"]
    copy_tss["EVA"]["eva"]["spec"]["started"] = unparsed_data["121"]
    copy_tss["EVA"]["eva"]["spec"]["completed"] = unparsed_data["122"]
    copy_tss["EVA"]["eva"]["spec"]["time"] = unparsed_data["123"]

    return copy_tss

def send_lunarlink_data(tss_data, pin_data):
    rover_telemetry = tss_data.get("ROVER_TELEMETRY", {})
    rover_position = tss_data.get("ROVER")

    if not rover_telemetry or not rover_position:
        return {"error": "Rover telemetry or position data not available"}

    return {
        "rover_telemetry": rover_telemetry,
        "rover_position": rover_position,
        "pins": pin_data
    }
