All TSS data relating to rover is stored in class roverState in roverState.data
roverState also contains general functions to determine time and distance rover has to travel for next goal location, this also includes time for getting back to base to refuel. Don't need to go right back to base after but need to make sure we have at least enough resources to make it back

Oxygen Calculations contains function for determinin how much oxygen time is left by calculatin cycles of oxygen use (15 mins passive use and 2 mins refuleing) which in total takes 7.25% of oxygen tank and takes 18 mins, can add larger buffer though
Also contains warnings/monitors for pressure, oxygen pressure, and oxygen levels

Power calculations predicts power left based on current power use and also calculates power needed for trip (one way), power needed for trip (there and back to base), and power time left, all based off of current or average power consumption

Coolant calculations predicts coolant time left using the same cycles used for oxygen

Handle Error Scenarios contains error handling for biometrics and resources such as heart rate, temperature, suit oxygen pressure, suit CO2, suit pressure, helmet CO2, fan RPM, scrubber CO2 storage, and battery. Returns list of errors
