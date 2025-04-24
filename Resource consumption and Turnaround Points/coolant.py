from resourceConsumption import roverState

#refill coolant evas wit tank
def coolantTimeLeft():

    percentLeft = roverState.data["coolant_tank"]
    cycles = percentLeft // 7.25
    minutes = cycles * 18
    return minutes - 5