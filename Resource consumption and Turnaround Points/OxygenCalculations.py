
from resourceConsumption import roverState
import powerCalculations

#oxygen mass of tank in grams


#predict oxyen time left
#refill EVA takes approx 2 min
#refill at approx every 15 min
#complete cycle 18 mins 7.25%
#refueling = 125 ticks = 6.25%
#between refuel = 1% passive intake
def oxygenTimeLeft():
    percentLeft = roverState.data["oxygen_tank"]
    cycles = percentLeft // 7.25
    minutes = cycles * 18
    return minutes - 5

def oxygenForTrip(goalCoordinates, estimatedTaskTime=600):
    
    time = roverState.getTotalTime(goalCoordinates) + estimatedTaskTime
    mins = time / 60
    cycles = mins / 17
    percentOxygenNeeded = cycles * 7.25
    return percentOxygenNeeded

def oxygenForDrive(goalCoordinates):
    time = roverState.getOneWayTime(goalCoordinates)
    mins = time / 60
    cycles = mins / 17
    percentOxygenNeeded = cycles * 7.25
    return percentOxygenNeeded



def enoughOxyen(goalCoordinates, estimatedTimeTask=600):
    lowOxygen = 20
    oxygenNeeded = oxygenForTrip(goalCoordinates, estimatedTimeTask)

    if (roverState.data['oxygen_tank'] - oxygenNeeded) <= lowOxygen:
        return False
    else:
        return True


#oxygen tank pressure not rover
'''
def oxygenPressure():
    p = roverState.data["oxygen_pressure"]

    if p <= 1:
        #fatal oxygen deprivation
        return "Fatal Oxygen Deprivation"
    elif p <= 1.5:
        #Critical oxygen deprivation
        return "Critical Oxygen Deprivation"
    elif p <= 1.8:
        #severe hypoxia
        return "Severe Hypoxia"
    elif p <= 2.3:
        #hypoxia
        return "Hypoxia"
    elif p <= 3:
        #mild hypoxia possible
        return "Mild Hypoxia Possible"
    elif p <= 3.3:
        #perfect conditions
        return "Nominal"
    elif p <= 4:
        #mild oxygen toxicity possible
        return "Mild Oxygen Toxicity Possible"
    elif p <=5:
        #oxygen toxicity
        return "Oxygen Toxicity"
    elif p <= 7:
        #severe oxygen toxicity
        return "Severe Oxygen Toxicity"
    else:
        #lethal oxygen toxicity
        return "Lethal Oxygen Toxicity"
'''


def pressure():

    p = roverState.data["pressure"]
    if p <= 12:
        #risk of hypoxia
        return "Risk of Hypoxia"
    elif p < 14.7:
        #acceptable but should be higher
        return "Acceptable"
    elif p < 15:
        #ideal range
        return "Nominal"
    else:
        #risk of oxygen toxicity
        return "Risk of Oxygen Toxicity"

def oxygenLevels():

    l = roverState.data["oxygen_levels"]
    if l == 0:
        return "No Remaining Oxygen"
    elif l <= 10:
        return "Oxygen Levels Critical"
    elif l <= 30:
        return "Oxygen Levels Low"
    elif l <= 60:
        return "Oxygen Levels Moderate"
    elif l <= 99:
        return "Oxygen Levels High"
    else:
        return "Oxygen Levels Full"
     


def enoughTime(goalCoordinates, estimatedTimeTask=600):
    if powerCalculations.enoughPower(goalCoordinates, estimatedTimeTask) and enoughOxyen(goalCoordinates, estimatedTimeTask):
        return True
    else: 
        return False



