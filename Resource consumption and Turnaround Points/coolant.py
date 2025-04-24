from resourceConsumption import roverState

#refill coolant evas wit tank
def coolantTimeLeft():

    percentLeft = roverState.data["coolant_tank"]
    cycles = percentLeft // 7.25
    minutes = cycles * 18
    return minutes - 5

def coolantError():

    coolant = roverState.data['coolant_level']

    if coolant == 0:
        return "Out of Coolant"
    elif coolant <= 10:
        return "Coolant Levels Critical"
    elif coolant <= 30:
        return "Coolant Levels Low"
    elif coolant <= 60:
        return "Coolant Levels Moderate"
    elif coolant <= 99:
        return "Coolant Levels High"
    else:
        return "Coolant Full"