"use client";

import React, { useState, useEffect } from "react";
import { CheckSquare, RefreshCcw } from "lucide-react";

/*
POIS for PR
-5855.60, -10168.60
-5868.10, -10016.10
-5745.90, -9977.30
*/

/*
GEOLOGY POIS
LTV POI 1: -5635.00, -9970.00 

LTV POI 2: -5610.00, -9971.00
LTV POI 3: -5615.00, -9995.00*/

const TASKS = [
  { id: "battery", label: "Pilot verify battery level is > 95%" },
  { id: "o2-level", label: "Pilot verify O₂ levels are > 95%" },
  { id: "o2-pressure", label: "Verify O₂ pressure is > 2900 psi" },
  { id: "cabin-pressure", label: "Verify PR cabin pressure is > 3.95 psi" },
  { id: "headlights", label: "Toggle PR headlights ON then OFF" },
  { id: "drop-pin-current", label: "Drop pin at current location" },

  { id: "select-point-a", label: "Drop pin at point A (-5855.60, -10168.60)" },
  { id: "nav-point-a", label: "Begin navigation to Point A" },
  { id: "stop-at-point-a", label: "Verify PR has come to a complete stop" },
  { id: "scan-point-a", label: "Conduct terrain scan at Point A" },
  { id: "verify-pnr-a", label: "Verify PNR at Point A" },
  {                                   
    id: "verify-consumables-a",
    label: "Note anticipiated consumables at Point A",
  },
  { id: "verify-storage-a", label: "ensure successful storage of terrain data"},
  { id: "announce-completion-a", label: "Announce successful completion of terrain scan"},


  { id: "select-point-b", label: "Drop pin at point B (-5868.10, -10016.10)" },
  { id: "nav-point-b", label: "Begin navigation to Point B" },
  { id: "stop-at-point-b", label: "Verify PR has come to a complete stop" },
  { id: "scan-point-b", label: "Conduct terrain scan at Point B" },
  { id: "verify-pnr-b", label: "Verify PNR at Point B" },
  {
    id: "verify-consumables-b",
    label: "Note anticipiated consumables at Point B",
  },
  { id: "verify-storage-b", label: "ensure successful storage of terrain data"},
  { id: "announce-completion-b", label: "Announce successful completion of terrain scan"},


  { id: "select-point-c", label: "Drop pin at point C (-5745.90, -9977.30)" },
  { id: "nav-point-c", label: "Begin navigation to Point C" },
  { id: "stop-at-point-c", label: "Verify PR has come to a complete stop" },
  { id: "check-telementry-c", label: "Check telemetry data and look for any off-nominal values"}, 
  { id: "scan-point-c", label: "Conduct terrain scan at Point C" },
  { id: "verify-pnr-c", label: "Verify PNR at Point C" },
  {
    id: "verify-consumables-c",
    label: "Note anticipiated consumables at Point C",
  },
  { id: "verify-storage-c", label: "ensure successful storage of terrain data"},
  { id: "announce-completion-c", label: "Announce successful completion of terrain scan"},


  { id: "verify-home-path", label: "Verify path to home base is generated" },
  { id: "nav-home", label: "Begin navigation to home base" },

  // EVA egress coordination
  { id: "verify-ping", label: "Verify ping received from LTV" },
  { id: "verify-pois", label: "Verify worksite POI locations provided by LTV" },
  { id: "verify-ev1-pois", label: "Verify EV1 has received LTV POIs" },
  {
    id: "announce-pr-complete",
    label: "Announce PR operations complete and begin monitoring EVA",
  },

  // Final airlock clearance
  { id: "unlock-airlock", label: "Unlock airlock & announce all-clear for EV" },
];

export default function Procedures() {
  // Lazy-load from localStorage so state persists across refresh
  const [done, setDone] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const saved = localStorage.getItem("proceduresDone");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Persist any changes
  useEffect(() => {
    localStorage.setItem("proceduresDone", JSON.stringify(done));
  }, [done]);

  const toggle = (id: string) =>
    setDone((prev) => ({ ...prev, [id]: !prev[id] }));

  const resetAll = () => {
    setDone({});
    localStorage.removeItem("proceduresDone");
  };

  return (
    <div className="w-full h-full bg-gray-800 rounded-lg border border-blue-600 shadow-lg overflow-hidden flex flex-col">
      <div className="bg-gray-700 p-2 border-b border-blue-600 flex items-center justify-between">
        <div className="flex items-center space-x-2 drag-handle hover:cursor-move">
          <CheckSquare size={18} className="text-blue-400" />
          <span className="font-bold">ROVER PROCEDURES</span>
          <span className="text-sm text-gray-400">
            -{" "}
            {(
              (Object.values(done).filter(Boolean).length / TASKS.length) *
              100
            ).toFixed(0)}
            %
          </span>
        </div>
        <button
          onClick={resetAll}
          className="flex items-center space-x-1 text-xs text-gray-400 hover:text-gray-200"
        >
          <RefreshCcw size={16} />
          <span>Reset</span>
        </button>
      </div>

      <div className="flex-1 p-3 overflow-y-auto">
        <ul className="space-y-2">
          {TASKS.map(({ id, label }) => (
            <li key={id} className="flex items-center">
              <input
                type="checkbox"
                checked={!!done[id]}
                onChange={() => toggle(id)}
                className="form-checkbox h-4 w-4 text-green-400 bg-gray-700 border-gray-600 rounded focus:ring-0 hover:cursor-pointer"
              />
              <span
                className={`ml-2 text-sm ${
                  done[id] ? "text-gray-500 line-through" : "text-gray-200"
                }`}
              >
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
