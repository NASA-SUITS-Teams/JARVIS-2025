import { PRTelemetry, EVATelemetry, Alert } from "@/types/api";

// Load any persisted timestamps
function loadStartTimes(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem("alertStartTimes") || "{}");
  } catch {
    return {};
  }
}

// Persist timestamps in local storage
function saveStartTimes(times: Record<string, number>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("alertStartTimes", JSON.stringify(times));
  } catch {
    // ignore for now
  }
}

const ROVER_THRESHOLDS: Record<keyof PRTelemetry, [number, number]> = {
  pitch: [0.0, 50.0],
  roll: [0.0, 50.0],
  speed: [0.0, 18.0],
  surface_incline: [0.0, 50.0],
  oxygen_tank: [25.0, 100.0],
  oxygen_pressure: [2997.0, 3000.0],
  oxygen_levels: [20.0, 21.0],
  ac_fan_pri: [29999.0, 30005.0],
  ac_fan_sec: [29999.0, 30005.0],
  cabin_pressure: [3.5, 4.1],
  cabin_temperature: [50.0, 90.0],
  battery_level: [30.0, 100.0],
  solar_panel_efficiency: [40.0, 100.0],
  pr_coolant_level: [40.0, 45.0],
  pr_coolant_pressure: [495.0, 501.0],
  pr_coolant_tank: [60.0, 100.0],
  solar_panel_dust_accum: [0.0, 25.0],
  distance_from_base: [0.0, 2500.0],
};

const EVA_THRESHOLDS: Record<keyof EVATelemetry, [number, number]> = {
  batt_time_left: [3600, 10800],
  oxy_pri_storage: [20, 100],
  oxy_sec_storage: [20, 100],
  oxy_pri_pressure: [600, 3000],
  oxy_sec_pressure: [600, 3000],
  oxy_time_left: [3600, 21600],
  heart_rate: [50, 160],
  oxy_consumption: [0.05, 0.15],
  co2_production: [0.05, 0.15],
  suit_pressure_oxy: [3.5, 4.1],
  suit_pressure_co2: [0.0, 0.1],
  suit_pressure_other: [0.0, 0.5],
  suit_pressure_total: [3.5, 4.5],
  helmet_pressure_co2: [0.0, 0.15],
  fan_pri_rpm: [20000, 30000],
  fan_sec_rpm: [20000, 30000],
  scrubber_a_co2_storage: [0, 60],
  scrubber_b_co2_storage: [0, 60],
  temperature: [50, 90],
  coolant_liquid_pressure: [100, 700],
  coolant_gas_pressure: [0, 700],
};

const alertStartTimes: Record<string, number> = loadStartTimes();

function computeAlerts(
  telemetry: Record<string, any>,
  thresholds: Record<string, [number, number]>,
  label: string,
  elapsedTime: number
): Alert[] {
  const now = Date.now();
  const out: Alert[] = [];

  for (const key in thresholds) {
    const raw = telemetry[key];
    if (typeof raw !== "number") continue;
    const val = raw;
    const [minV, maxV] = thresholds[key];

    // build a unique key per source+field
    const uniqueKey = `${label}:${key}`;

    // start timer if first seen
    if (!(uniqueKey in alertStartTimes) || elapsedTime < 10) {
      alertStartTimes[uniqueKey] = now;
      saveStartTimes(alertStartTimes);
    }

    // out of range?
    if (val < minV || val > maxV) {
      // ignore zero readings
      if (val === 0) {
        delete alertStartTimes[uniqueKey];
        saveStartTimes(alertStartTimes);
        continue;
      }

      const pctOut =
        val < minV ? ((minV - val) / minV) * 100 : ((val - maxV) / maxV) * 100;
      const elapsed = Math.floor((now - alertStartTimes[uniqueKey]) / 1000);

      out.push({
        name: `${label} ${key.toUpperCase().replace(/_/g, " ")} Out Of Range`,
        description: `Current: ${val.toFixed(2)} ${
          val < minV
            ? `- below by ${Math.abs(pctOut).toFixed(2)}%`
            : `above by ${Math.abs(pctOut).toFixed(2)}%`
        }`,
        time: `${elapsed} seconds`,
        type: label,
      });
    } else {
      // back in range → clear timer
      if (uniqueKey in alertStartTimes) {
        delete alertStartTimes[uniqueKey];
        saveStartTimes(alertStartTimes);
      }
    }
  }

  return out;
}

export function getAlerts(
  prTelemetry: PRTelemetry,
  evaTelemetryList: {
    eva1: EVATelemetry;
    eva2: EVATelemetry;
  },
  evaStarted: boolean
): Alert[] {
  const all: Alert[] = [];
  const elapsedTime: number = prTelemetry.mission_elapsed_time || 0;

  // Rover
  all.push(
    ...computeAlerts(prTelemetry, ROVER_THRESHOLDS, "ROVER", elapsedTime)
  );

  // EVA1 and EVA2 - only add EVA alerts if they are being actively used

  if (evaStarted) {
    all.push(
      ...computeAlerts(
        evaTelemetryList.eva1,
        EVA_THRESHOLDS,
        "EVA1",
        elapsedTime
      )
    );
    all.push(
      ...computeAlerts(
        evaTelemetryList.eva2,
        EVA_THRESHOLDS,
        "EVA2",
        elapsedTime
      )
    );
  }
  return all;
}
