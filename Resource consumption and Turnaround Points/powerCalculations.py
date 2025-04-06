#power consumption
import resourceConsumption
#power in kW
totalPower = 100


#take into account mission elapsed time
def calculatePowerForTrip(rover, distanceMeters):
    motorPower = rover.data["motorPowerConsumption"]
    otherPower = rover.data["powerConsumptionRate"] - motorPower
    seconds = distanceMeters / rover.data["speed"]
    powerNeeded = otherPower/3600 * seconds + rover.data["powerConsumptionRate"]/distanceMeters * rover.data["speed"] * 10 / 36 
    return powerNeeded


#calculate power needed to get back to base, and use enough power to see if theres enpough power left to make the trip
def powerBackToBase(rover, goalCoordinates, baseCoordinates):
    curr = (rover.data["longitude"], rover.data["latitude"])
    distToGoal = ((curr[0] - goalCoordinates[0]) ** 2 + (curr[1] - goalCoordinates[1]) ** 2) ** (1/2)
    distToBase = ((baseCoordinates[0] - goalCoordinates[0]) ** 2 + (baseCoordinates[1] - goalCoordinates[1]) ** 2) ** (1/2)
    totalDist = distToGoal + distToBase
    powerNeeded = calculatePowerForTrip(rover, totalDist)
    return powerNeeded



#if trip can be made without going below 10% battery return True
def enoughPower(rover, powerNeeded):

    batteryLow = 0.1 * totalPower

    powerLeft = rover.data["batteryLevel"] / 100 * totalPower
    if powerLeft - powerNeeded <= batteryLow:
        return False
    else:
        return True
