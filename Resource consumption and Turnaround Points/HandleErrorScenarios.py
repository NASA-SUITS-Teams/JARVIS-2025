import json
battMin = 720
oxyMin = 720
coolantMin = 20

# This script is used for checking EVA telemetry values to make sure they are within nominal ranges.



# EVA Telemetry values we need to keep track of, and their corresponding nominal ranges
TELEMETRY_RANGES = {
    "batt_time_left": (3600, 10800),
    "oxy_pri_storage": (20, 100),
    "oxy_sec_storage": (20, 100),
    "oxy_pri_pressure": (600, 3000),
    "oxy_sec_pressure": (600, 3000),
    "oxy_time_left": (3600, 21600),
    "coolant_storage": (80, 100),
    "heart_rate": (50, 160),
    "oxy_consumption": (0.05, 0.15),
    "co2_production": (0.05, 0.15),
    "suit_pressure_oxy": (3.5, 4.1),
    "suit_pressure_co2": (0.0, 0.1),
    "suit_pressure_other": (0.0, 0.5),
    "suit_pressure_total": (3.5, 4.5),
    "helmet_pressure_co2": (0.0, 0.15),
    "fan_pri_rpm": (20000, 30000),
    "fan_sec_rpm": (20000, 30000),
    "scrubber_a_co2_storage": (0, 60),
    "scrubber_b_co2_storage": (0, 60),
    "temperature": (50, 90),
    "coolant_liquid_pressure": (100, 700),
    "coolant_gas_pressure": (0, 700),
}


# Alert that the detected Heart Rate is too high and that the astronaut will need to slow down for a second.
def heartrateError(data):
    _,max_val = TELEMETRY_RANGES["heart_rate"]
    if data["heart_rate"] > max_val:
        return "Detected heart rate is too high. The astronaut will need to slow down for a second."
    
# Alert that the detected temperature is too high and that the astronaut needs to slow down.
def temperatureError(data):
    _,max_val = TELEMETRY_RANGES["temperature"]
    if data["temperature"] > max_val:
        return "Temperature is high. The astronaut will need to slow down for a second."

# The Primary Oxygen Tank is not suppling enough (or too much) oxygen and we must swap to the Secondary Oxygen Tank. 
# This is done using the Oxygen Switch on the DCU. 
def suitPressureOxygenError(data):
    min_val,max_val = TELEMETRY_RANGES["oxy_pri_pressure"]
    if data["oxy_pri_pressure"] > max_val:
        return "Primary oxygen pressure is too high, switch to secondary oxygen tank."
    elif data["oxy_pri_pressure"] < min_val:
        return "Primary oxygen pressure is too low, switch to secondary oxygen tank."
    elif data["oxy_sec_pressure"] > max_val:
        return "Secondary oxygen pressure is too high, switch to primary oxygen tank."
    elif data["oxy_sec_pressure"] < min_val:
        return "Secondary oxygen pressure is too low, switch to primary oxygen tank."

# The scrubber has filled up and must be vented. This is done using the Carbon Dioxide Switch on the DCU.
def suitPressureCo2Error(data):
    _,max_val = TELEMETRY_RANGES["suit_pressure_co2"]
    if data["suit_pressure_co2"] > max_val:
        return "Co2 pressure too high. Vent scrubbers."

# The partial pressure of all other gases should be zero in the suit after the decompress sequence. 
# Alter the user if this value is too high only after that step.
def suitPressureOtherError(data):
    min_val,_ = TELEMETRY_RANGES["suit_pressure_other"]
    if data["suit_pressure_other"] > min_val:
        return "Other gasses pressure is greater than 0.0."

# The suit total pressure being too low/high alludes to a problem with either the oxygen tank or the scrubber. 
# Review those values and perform their procedures.
def suitPressureTotalError(data):
    min_val,max_val = TELEMETRY_RANGES["suit_pressure_total"]
    if data["suit_pressure_total"] > max_val:
        return "Total suit pressure is too high. There is a problem with either the oxygen tank or the scrubber."
    elif data["suit_pressure_total"] < min_val:
        return "Total suit pressure is too low. There is a problem with either the oxygen tank or the scrubber."

# The helmet carbon dioxide partial pressure builds up on a fan failure. 
# Swap to the secondary fan. This is done using the Fan Switch on the DCU.
def helmetPressureCo2Error(data):
    _,max_val = TELEMETRY_RANGES["helmet_pressure_co2"]
    if data["helmet_pressure_co2"] > max_val:
        return "Too much Co2 pressure buildup. Swap to other fan."


# If either of the fans are on and not spinning at the expected 30,000 rpm, then there is a fan error.
# Swap to the secondary fan. This is done using the Fan Switch on the DCU.
def fanRPMError(data):
    _,max_val = TELEMETRY_RANGES["fan_pri_rpm"]
    if data["fan_pri_rpm"] < max_val and data["fan_sec_rpm"] < max_val:
        return "Both fans spinning at less than 30,000 rpm. Return to rover to get them fixed."
    elif data["fan_pri_rpm"] < max_val:
        return "Primary fan spinning at less than 30,000 rpm. Switch to secondary fan."
    elif data["fan_sec_rpm"] < max_val:
        return "Secondary fan spinning at less than 30,000 rpm. Switch to primary fan."


# If either scrubber filled beyond 60% capacity, it must be vented. 
# This will happen a few times during the EVA and the astronaut should be alerted 
# that they need to vent their collected carbon dioxide. 
# This is done by flipping the Carbon Dioxide Switch on the DCU.
def scrubberCo2StorageError(data):
    _,max_val = TELEMETRY_RANGES["scrubber_a_co2_storage"]
    if data["scrubber_a_co2_storage"] > max_val and data["scrubber_b_co2_storage"] > max_val:
        return "Scrubber A and B filled beyond 60%. Vent Scrubber A and B."
    elif data["scrubber_a_co2_storage"] > max_val:
        return "Scrubber A filled beyond 60%. Vent Scrubber A."
    elif data["scrubber_b_co2_storage"] > max_val:
        return "Scrubber B filled beyond 60%. Vent Scrubber B."


# If the battery is below 3600, return an error telling the EVA to return to Rover
def batteryError(data):
    min_val,_ = TELEMETRY_RANGES["batt_time_left"]
    if data["batt_time_left"] < min_val:
        return "Battery time is getting too low. Return to rover."




def main():
    telemetry_json = '''
    {
        "batt_time_left": 3300,
        "heart_rate": 170,
        "oxy_pri_pressure": 3100,
        "suit_pressure_oxy": 3.2,
        "suit_pressure_co2": 0.2,
        "suit_pressure_other": 0.6,
        "suit_pressure_total": 5.0,
        "helmet_pressure_co2": 0.16,
        "fan_pri_rpm": 25000,
        "fan_sec_rpm": 10000,
        "scrubber_a_co2_storage": 65,
        "scrubber_b_co2_storage": 20,
        "temperature": 95
    }
    '''
    data = json.loads(telemetry_json)
    errors = []

    # Check all the possible errors and print them out
    heartrate_error = heartrateError(data)
    if heartrate_error != None:
        errors.append(heartrate_error)

    temperature_error = temperatureError(data)
    if temperature_error != None:
        errors.append(temperature_error)

    suit_pressure_oxygen_error = suitPressureOxygenError(data)
    if suit_pressure_oxygen_error != None:
        errors.append(suit_pressure_oxygen_error)
    
    suit_pressure_co2_error = suitPressureCo2Error(data)
    if suit_pressure_co2_error != None:
        errors.append(suit_pressure_co2_error)

    suit_pressure_other_error = suitPressureOtherError(data)
    if suit_pressure_other_error != None:
        errors.append(suit_pressure_other_error)

    suit_pressure_total_error = suitPressureTotalError(data)
    if suit_pressure_total_error != None:
        errors.append(suit_pressure_total_error)

    helmet_pressure_co2_error = helmetPressureCo2Error(data)
    if helmet_pressure_co2_error != None:
        errors.append(helmet_pressure_co2_error)

    fan_rpm_error = fanRPMError(data)
    if fan_rpm_error != None:
        errors.append(fan_rpm_error)

    scrubber_error = scrubberCo2StorageError(data)
    if scrubber_error != None:
        errors.append(scrubber_error)

    battery_error = batteryError(data)
    if battery_error != None:
        errors.append(battery_error)
    print(errors)
main()
    