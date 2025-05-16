/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useMemo } from "react";
import { EVATelemetry, TSSData } from "@/types/tss";
import { PRTelemetry } from "@/types/api";
import { EVAState } from "@/types/EVAStateTypes"; // the interface you generated

export default function SystemStates({
  tssData,
  changeLayout,
}: {
  tssData: TSSData & { eva?: EVAState }; // assume `eva` is your state payload
}) {
  const tabs = ["ROVER", "EVA #1", "EVA #2"] as const;
  const [activeIndex, setActiveIndex] = useState(0);

  const systemData = useMemo<
    (Partial<PRTelemetry> & EVATelemetry & Partial<EVAState>)[]
  >(() => {
    const roverTelemetry = tssData.ROVER_TELEMETRY?.pr_telemetry;
    let roverData: Partial<PRTelemetry> = {};

    // destructure to remove all the telemtry data values that we don't need
    if (roverTelemetry) {
      const {
        lidar,
        throttle,
        current_pos_x,
        current_pos_y,
        current_pos_alt,
        motor_power_consumption,
        mission_elapsed_time,
        mission_planned_time,
        terrain_condition,
        sim_running,
        sim_paused,
        sim_completed,
        latitude,
        longitude,
        dest_x,
        dest_y,
        dest_z,
        in_sunlight,
        internal_lights_on,
        ac_cooling,
        ac_heating,
        dust_wiper,
        fan_pri,
        ac_fan_pri,
        ac_fan_sec,
        co2_scrubber,
        ...rest
      } = roverTelemetry;
      roverData = rest;
    }

    // @TODO integrate EVA data from lunarlink fist and thn use the tss data as a backup
    const eva1Telemetry = tssData.TELEMETRY?.telemetry?.eva1 ?? {};
    const eva2Telemetry = tssData.TELEMETRY?.telemetry?.eva2 ?? {};

    return [roverData, eva1Telemetry, eva2Telemetry];
  }, [tssData]);

  const active = systemData[activeIndex] || {};

  return (
    <div className="p-3 bg-gray-800 border-t border-blue-600/50">
      <div className="text-sm font-bold text-blue-300 mb-2">SYSTEM STATES</div>

      {/* tabs */}
      <div className="flex flex-wrap gap-2 mb-3">
        {tabs.map((label, idx) => (
          <button
            key={label}
            onClick={() => {
              // Edit the layout of the entire UI when selecting either the EVA or the rover tabs
              if (idx === 0) {
                changeLayout("rover");
              } else {
                changeLayout("eva");
              }

              setActiveIndex(idx);
            }}
            className={`px-2 py-1 rounded-md text-xs ${
              idx === activeIndex
                ? "bg-blue-600 hover:bg-blue-500"
                : "bg-gray-600 hover:bg-gray-500"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* details */}
      <div className="space-y-2 text-xs">
        {Object.entries(active).map(([key, val]) => (
          <div key={key} className="flex justify-between">
            <span className="capitalize">{key.replace(/_/g, " ")}</span>
            <span>
              {typeof val === "boolean"
                ? val.toString()
                : Array.isArray(val)
                ? `[${val
                    .map((v) =>
                      typeof v === "number" ? Math.round(v * 100) / 100 : v
                    )
                    .join(", ")}]`
                : typeof val === "number"
                ? Math.round(val * 100) / 100
                : String(val)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
