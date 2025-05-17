import React from "react";
import { TSSData } from "@/types/tss";
import { TowerControl } from "lucide-react";

type RoverControlsProps = {
  tssData: TSSData;
};

export default function RoverControls({ tssData }: RoverControlsProps) {
  const prTelemetry = tssData.ROVER_TELEMETRY.pr_telemetry || {};

  const controls: { key: string; label: string; value: boolean }[] = [
    {
      key: "ac_heating",
      label: "AC Heating",
      value: prTelemetry.ac_heating || false,
    },
    {
      key: "ac_cooling",
      label: "AC Cooling",
      value: prTelemetry.ac_cooling || false,
    },
    {
      key: "co2_scrubber",
      label: "CO₂ Scrubber",
      value: prTelemetry.co2_scrubber || false,
    },
    { key: "brakes", label: "Brakes", value: prTelemetry.brakes || false },
    {
      key: "fan_pri",
      label: "Fan: primary",
      value: prTelemetry.fan_pri || false,
    },
    {
      key: "in_sunlight",
      label: "In sunlight",
      value: prTelemetry.in_sunlight || false,
    },
    {
      key: "lights_on",
      label: "Lights on",
      value: prTelemetry.lights_on || false,
    },
    {
      key: "internal_lights_on",
      label: "Internal lights on",
      value: prTelemetry.internal_lights_on || false,
    },
    {
      key: "dust_wiper",
      label: "Dust wiper",
      value: prTelemetry.dust_wiper || false,
    },
  ];

  const handleToggle = async (key: string, currentValue: boolean) => {
    const newValue = !currentValue;
    const param = `pr_${key}=${newValue}`;

    try {
      await fetch("http://127.0.0.1:14141/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: param,
      });
    } catch (error) {
      console.error("Error toggling control:", error);
    }

    // NOTE: THIS WILL THROW A CORS ERROR
    // we don't care, since it will still throw the switch on the backend, but it just won't let is read the acutal response which we don't care about
  };

  return (
    <div className="w-full h-full bg-gray-800 rounded-lg border border-blue-600 shadow-lg shadow-blue-500/10 flex flex-col overflow-hidden">
      <div className="bg-gray-700 p-2 border-b border-blue-600 flex items-center space-x-2 drag-handle hover:cursor-move">
        <TowerControl size={18} className="text-blue-400" />
        <span className="font-bold">ROVER CONTROLS</span>
      </div>

      <div className="flex-1 p-3 grid grid-cols-2 gap-x-4 gap-y-2">
        {controls.map(({ key, label, value }) => {
          return (
            <div key={key} className="flex items-center">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  value ? "bg-green-400" : "bg-gray-500"
                }`}
              />

              <button
                onClick={() => handleToggle(key, value)}
                className={`w-10 h-5 p-1 rounded-full transition-colors duration-200 relative ${
                  value ? "bg-green-500" : "bg-gray-600"
                }`}
              >
                <div
                  className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all duration-200 ${
                    value ? "left-6" : "left-1"
                  }`}
                />
              </button>

              <span className="ml-2 text-sm text-gray-200">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
