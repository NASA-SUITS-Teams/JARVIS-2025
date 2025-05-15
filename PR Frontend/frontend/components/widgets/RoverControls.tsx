import React from "react";
import { TSSData } from "@/types/tss";
import { TowerControl } from "lucide-react";

type RoverControlsProps = {
  tssData: TSSData;
  onToggleControl?: (control: string, newValue: boolean) => void;
};

export default function RoverControls({
  tssData,
  onToggleControl, // @ TODO implement the toggle controls to send commands to the rover via UDP socket
}: RoverControlsProps) {
  const prTelemetry = tssData.ROVER_TELEMETRY?.pr_telemetry || {};

  // Map controls to TSS data properties
  const controls: { key: string; label: string; value: boolean }[] = [
    {
      key: "ac_heating",
      label: "AC Heating",
      value: prTelemetry.ac_heating || false,
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
      key: "ac_cooling",
      label: "AC Cooling",
      value: prTelemetry.ac_cooling || false,
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

  // Handle toggle events
  const handleToggle = (key: string, currentValue: boolean) => {
    if (onToggleControl) {
      onToggleControl(key, !currentValue);
    }
  };

  return (
    <div className="w-full h-full bg-gray-800 rounded-lg border border-blue-600 shadow-lg shadow-blue-500/10 overflow-hidden flex flex-col">
      <div className="bg-gray-700 p-2 border-b border-blue-600 flex items-center space-x-2 drag-handle hover:cursor-move">
        <TowerControl size={18} className="text-blue-400" />
        <span className="font-bold">ROVER CONTROLS</span>
      </div>

      <div className="flex-1 p-3 grid grid-cols-2 gap-x-4 gap-y-1">
        {controls.map(({ key, label, value }) => {
          const isOn = value;
          return (
            <div key={key} className="flex items-center">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  isOn ? "bg-green-400" : "bg-gray-500"
                }`}
              />

              <button
                onClick={() => handleToggle(key, isOn)}
                className={`w-10 h-5 p-1 rounded-full transition-colors duration-200 relative ${
                  isOn ? "bg-green-500" : "bg-gray-600"
                }`}
              >
                <div
                  className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all duration-200 ${
                    isOn ? "left-6" : "left-1"
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
