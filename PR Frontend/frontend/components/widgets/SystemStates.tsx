"use client";

import React, { useState } from "react";

type SystemState = {
  name: string;
  oxygen: number;
  co2: number;
  dataError: boolean;
};

const defaultStates: SystemState[] = [
  { name: "EVA #1", oxygen: 48, co2: 63, dataError: false },
  { name: "EVA #2", oxygen: 72, co2: 45, dataError: false },
  { name: "Rover", oxygen: 30, co2: 80, dataError: true },
];

export default function SystemStates({
  states = defaultStates,
}: {
  states?: SystemState[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = states[activeIndex];

  return (
    <div className="p-3 border-b border-blue-600/50">
      <div className="text-sm font-bold text-blue-300 mb-2">SYSTEM STATES</div>

      {/* buttons */}
      <div className="flex flex-wrap gap-2 mb-3">
        {states.map((s, idx) => (
          <button
            key={s.name}
            onClick={() => setActiveIndex(idx)}
            className={`
              px-2 py-1 rounded-md text-xs
              ${
                idx === activeIndex
                  ? "bg-blue-600 hover:bg-blue-500"
                  : "bg-gray-600 hover:bg-gray-500"
              }
            `}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* details */}
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span>Oxygen Level</span>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-1" />
            <span>{active.oxygen}%</span>
          </div>
        </div>

        <div className="flex justify-between">
          <span>CO2 Level</span>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1" />
            <span>{active.co2}%</span>
          </div>
        </div>

        <div className="flex justify-between">
          <span>Communications</span>
          <div className="flex items-center">
            <div
              className={`
                w-2 h-2 rounded-full
                ${active.dataError ? "bg-red-500" : "bg-green-500"}
                mr-1
              `}
            />
            <span>{active.dataError ? "Offline" : "Online"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
