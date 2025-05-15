// utils/alerts.ts
import { PRTelemetry, Alert } from "@/types/api";

const STORAGE_KEY = "alertStartTimes";

function loadStartTimes(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveStartTimes(times: Record<string, number>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(times));
  } catch {
    /* ignore quota errors */
  }
}

const THRESHOLDS: Record<keyof PRTelemetry, [number, number]> = {
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

// Rehydrate on module import
const alertStartTimes: Record<string, number> = loadStartTimes();

export function getAlerts(telemetry: Partial<PRTelemetry>): Alert[] {
  const now = Date.now();
  const alerts: Alert[] = [];

  for (const key in THRESHOLDS) {
    // skip if missing or not numeric
    const valRaw = (telemetry as any)[key];
    if (typeof valRaw !== "number") continue;
    const val = valRaw;
    const [minV, maxV] = THRESHOLDS[key as keyof typeof THRESHOLDS];

    // start the clock if first trip
    if (!(key in alertStartTimes)) {
      alertStartTimes[key] = now;
      saveStartTimes(alertStartTimes);
    }

    if (val < minV || val > maxV) {
      if (val === 0) {
        // bad reading → clear
        delete alertStartTimes[key];
        saveStartTimes(alertStartTimes);
        continue;
      }

      // compute percentage out
      const pctOut =
        val < minV && minV !== 0
          ? ((minV - val) / minV) * 100
          : ((val - maxV) / maxV) * 100;
      const elapsedSec = Math.floor((now - alertStartTimes[key]) / 1000);

      alerts.push({
        name: key.toUpperCase().replace(/_/g, " ") + " Out Of Range",
        description:
          `Current: ${val.toFixed(2)} ` +
          (val < minV
            ? `- below by ${Math.abs(pctOut).toFixed(2)}%`
            : `above by ${Math.abs(pctOut).toFixed(2)}%`),
        time: `${elapsedSec} seconds`,
      });
    } else {
      // back in range → clear timer
      if (key in alertStartTimes) {
        delete alertStartTimes[key];
        saveStartTimes(alertStartTimes);
      }
    }
  }

  return alerts;
}
