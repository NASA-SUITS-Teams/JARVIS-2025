import { APIResponseData } from "@/types/api";
import { PRTelemetry } from "@/types/api";
import { TSSData } from "@/types/tss";
import { ROVER_THRESHOLDS } from "./alerts";

/**
 * Estimate future usage for selected rover metrics by linear extrapolation
 * assuming each historical entry is spaced by 10 seconds.
 *
 * @param history array of past APIResponseData entries (ordered oldest to newest)
 * @param current current TSSData entry
 * @param delta number of minutes into the future to project
 */
export function estimateFutureUsage(
  history: APIResponseData[],
  current: TSSData,
  delta: number
): Record<string, number> {
  const result: Record<string, number> = {};
  const deltaSec = delta * 60; // convert minutes to seconds

  // filter out entries without rover telemetry
  const entries = history.filter(
    (e) => e.tssData?.ROVER_TELEMETRY.pr_telemetry
  );

  if (entries.length < 2) {
    return result;
  }

  // assume uniform spacing: N-1 intervals of 10 seconds
  const intervalCount = entries.length - 1;
  const dtHist = intervalCount * 10; // total seconds between first and last

  const earliest = entries[0].tssData.ROVER_TELEMETRY.pr_telemetry;
  const latest =
    entries[entries.length - 1].tssData.ROVER_TELEMETRY.pr_telemetry;

  // list of keys to project
  const keys: (keyof PRTelemetry)[] = [
    "battery_level",
    "oxygen_tank",
    "oxygen_levels",
    "oxygen_pressure",
    "cabin_temperature"
    // @TODO add more keys as needed
  ];

  keys.forEach((key) => {
    const v0 = earliest[key];
    const v1 = latest[key];
    if (typeof v0 === "number" && typeof v1 === "number") {
      const rate = (v1 - v0) / dtHist;
      const curVal = (current.ROVER_TELEMETRY.pr_telemetry as PRTelemetry)[key];

      if (typeof curVal === "number") {
        result[key] = curVal + rate * deltaSec;
      }
    }
  });

  return result;
}

/*
 * Calculates the maximum range of the rover
 */
export function calculateRange(
  history: APIResponseData[],
  current: TSSData
): number {
  // Extract safe thresholds
  const [minBattery] = ROVER_THRESHOLDS.battery_level;
  const maxDistanceThreshold = 1700; // TSS says it can be 2500 but none of the maps go that far

  // Unwrap current telemetry
  const { battery_level: batteryLevel, distance_from_base: currentDist } =
    current.ROVER_TELEMETRY.pr_telemetry;

  // Build consumption rates (percent battery per distance unit)
  const rates: number[] = [];
  for (let i = 1; i < history.length; i++) {
    const prev = history[i - 1].tssData.ROVER_TELEMETRY.pr_telemetry;
    const curr = history[i].tssData.ROVER_TELEMETRY.pr_telemetry;

    const deltaDist = Math.abs(
      curr.distance_from_base - prev.distance_from_base
    );
    const deltaBatt = prev.battery_level - curr.battery_level;

    if (deltaDist > 0 && deltaBatt > 0) {
      rates.push(deltaBatt / deltaDist);
    }
  }

  // If no movement history, assume full threshold distance is reachable (2500)
  if (rates.length === 0) {
    return maxDistanceThreshold;
  }

  // Use worst-case consumption for safety
  const worstRate = Math.max(...rates);

  // Compute how much battery can be used
  const availableBattery = batteryLevel - minBattery;
  if (availableBattery <= 0) {
    return currentDist;
  }

  // additional range based on worst-case rate
  const additionalRange = availableBattery / worstRate;

  // capped at threshold
  return Math.min(currentDist + additionalRange, maxDistanceThreshold);
}
