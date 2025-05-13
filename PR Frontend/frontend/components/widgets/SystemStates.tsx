import React, { useState, useMemo } from "react";
import { TSSData } from "@/types/tss";
import { PRTelemetry } from "@/types/api";

export default function SystemStates({ tssData }: { tssData: TSSData }) {
  const tabs = ["EVA #1", "EVA #2", "ROVER"] as const;
  const [activeIndex, setActiveIndex] = useState(0);

  // Build an array of telemetry objects every render
  const systemData = useMemo<
    (Partial<PRTelemetry> & { oxygen?: number; co2?: number })[]
  >(
    () => [
      // static EVA values @TODO pull this from LunarLink soon
      { oxygen: 48, co2: 63 },
      { oxygen: 72, co2: 45 },

      // pull rover telemetry and omit some values
      (() => {
        const telem = tssData.ROVER_TELEMETRY?.pr_telemetry;
        if (!telem) return {};

        // destructure to omit all of the telemetry values we don't want
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
          solar_panel_dust_accum,
          solar_panel_efficiency,
          ...rest
        } = telem;
        return rest;
      })(),
    ],
    [tssData]
  );

  const active = systemData[activeIndex] || {};

  return (
    <div className="p-3 bg-gray-800 border-t border-blue-600/50">
      <div className="text-sm font-bold text-blue-300 mb-2">SYSTEM STATES</div>

      {/* tabs */}
      <div className="flex flex-wrap gap-2 mb-3">
        {tabs.map((label, idx) => (
          <button
            key={label}
            onClick={() => setActiveIndex(idx)}
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
              {Array.isArray(val) ? `[${val.join(", ")}]` : String(val)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
