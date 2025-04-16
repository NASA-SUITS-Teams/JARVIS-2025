import datetime 
import matplotlib.pyplot as plt
import numpy as np
from scipy.optimize import curve_fit
from resourceConsumption import roverState, getTSSdata


#oxygen mass of tank in grams


#refill EVA takes approx 2 min
#refill at approx every 15 min
def oxygenTimeLeft():
    tank / 0.1 = 





def oxygenTimeLeft(maxOxygen, currentMass = A, decayConstant = B):
    
    target = maxOxygen * 0.05
    #time in seconds
    timeLeft = -np.log(target / currentMass)/decayConstant
    return timeLeft


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
     
def enoughTime(timeLeft):
    #calculated in seconds with 20 minutes buffer time
    #can change buffertime so its at a constant ration to mission time
    if roverState.data["mission_planned_time"] <= (timeLeft + 1200):
        return False
    else:
        return True


