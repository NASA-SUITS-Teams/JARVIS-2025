#power consumption
from resourceConsumption import roverState
#power in kW
totalPower = 100


#take into account mission elapsed time
#calculate power needed for trip given distance, 
def calculatePowerForTrip(rover, distanceMeters):
    motorPower = rover.data["motorPowerConsumption"]
    otherPower = rover.data["powerConsumptionRate"] - motorPower
    seconds = distanceMeters / rover.data["speed"]
    #motor power only depends on throttle not speed take this into account
    powerNeeded = otherPower/3600 * seconds + rover.data["powerConsumptionRate"]/distanceMeters * rover.data["speed"] * 10 / 36 
    return powerNeeded



def kWforTrip(goalCoordinates, estimatedTaskTime):
    motorPower = roverState.data["motorPowerConsumption"]
    totalPower = roverState.data["powerConsumptionRate"]
    otherPower = totalPower - motorPower


    timeSec = roverState.getTotalTime(goalCoordinates, estimatedTaskTime)
    totalOtherPower = timeSec * otherPower / 36000


#calculate power needed to get to goal andn back to base, 
def powerBackToBase(rover, goalCoordinates, baseCoordinates):
    totalDist = roverState.getTotalDist()
    powerNeeded = calculatePowerForTrip(rover, totalDist)
    return powerNeeded


#if trip can be made without going below 10% battery return True
def enoughPower(rover, powerNeeded, totalPower):
    batteryLow = 0.1 * totalPower
    powerLeft = rover.data["batteryLevel"] / 100 * totalPower
    if powerLeft - powerNeeded <= batteryLow:
        return False
    else:
        return True


#battery time left:
def batteryTimeLeft(rover):

    #calculate seconds left with current power use (doesn't account for changes)
    secondsLeft = rover.data["batteryLevel"] / rover.data["powerConsumptionRate"]
    return secondsLeft


#calculate time left with constant (almost) max power usage
#compare with oxygen time left to find actual time left
def minTimeLeft(rover, avg_throttle):
    #calculate MAX power consumption rate / sec

    battLevel = rover.data["batteryLevel"]
    #consumption values in % per second
    passiveConsumption = 0.0005
    #find averaeg throttle for mission to estimate power
    throttleConsumption = 0.01 * avg_throttle
    wiperConsumption = 0.001
    heatingConsumption = 0.005
    coolingConsumption = 0.005
    scrubberConsumption = 0.001
    externalLightsConsumption = 0.001
    internalLightsConsumption = 0.000

    maxEnergyUse = passiveConsumption + throttleConsumption + wiperConsumption + heatingConsumption + coolingConsumption + scrubberConsumption + externalLightsConsumption + internalLightsConsumption  

    #no recharge
    secondsLeft = battLevel / maxEnergyUse
    return secondsLeft


