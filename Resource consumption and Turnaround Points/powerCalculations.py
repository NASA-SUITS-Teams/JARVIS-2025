#power consumption
import resourceConsumption
#power in kW
totalPower = 100


#take into account mission elapsed time
def calculatePowerForTrip(distanceMeters, data):
    motorPower = getMotorConsumption(data)
    otherPower = getPowerConsumption(data) - motorPower
    seconds = distanceMeters / getSpeed(data)
    powerNeeded = otherPower/3600 * seconds + getPowerConsumption(data)/distanceMeters * getSpeed(data) * 10 / 36
    return powerNeeded


#calculate power needed to get back to base, and use enough power to see if theres enpough power left to make the trip
def powerBackToBase(goalCoordinates, baseCoordinates, data):
    curr = (getLongitude(data), getLatitude(data))
    distToGoal = ((curr[0] - goalCoordinates[0]) ** 2 + (curr[1] - goalCoordinates[1]) ** 2) ** (1/2)
    distToBase = ((baseCoordinates[0] - goalCoordinates[0]) ** 2 + (baseCoordinates[1] - goalCoordinates[1]) ** 2) ** (1/2)
    totalDist = distToGoal + distToBase
    powerNeeded = calculatePowerForTrip(totalDist, data)



#if trip can be made without going below 10% battery return True
def enoughPower(powerNeeded, data):

    batteryLow = 0.1 * totalPower

    powerLeft = resourceConsumption.getRoverBatteryLevel(data) / 100 * totalPower
    if powerLeft - powerNeeded <= batteryLow:
        return False
    else:
        return True


def getDistanceFromBase(data):
    return data["rover"]["distanceFromBase"]

def getPowerConsumption(data):
    #power consumption in kWh
    return data["rover"]["powerConsumption"]

def getMotorConsumption(data):
    #power consumption in kWh
    return data["rover"]["motorConsumption"]

def getSpeed(data):
    #speed in m/s
    return data["rover"]["speed"]