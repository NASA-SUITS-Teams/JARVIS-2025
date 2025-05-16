import React, { useState } from "react";
import { CheckSquare } from "lucide-react";

const TASKS = [
  // PR Terrain Scouting
  { id: "battery", label: "Pilot verify battery level is > 95%" },
  { id: "o2-level", label: "Pilot verify O₂ levels are > 95%" },
  { id: "o2-pressure", label: "Verify O₂ pressure is > 2900 psi" },
  { id: "cabin-pressure", label: "Verify PR cabin pressure is > 3.95 psi" },
  { id: "headlights", label: "Toggle PR headlights ON then OFF" },
  { id: "drop-pin-current", label: "Drop pin at current location" },
  { id: "select-point-a", label: "Determine “Point A” and drop pin" },

  // Point A Terrain Scan
  { id: "nav-point-a", label: "Navigate to Point A" },
  { id: "stop-at-point-a", label: "Verify PR has come to a complete stop" },
  { id: "scan-point-a", label: "Begin terrain scan at Point A" },
  { id: "select-point-b", label: "Determine “Point B” and drop pin" },
  {
    id: "save-point-a-data",
    label: "Ensure terrain data for Point A is stored",
  },

  // Point B Terrain Scan
  { id: "nav-point-b", label: "Navigate to Point B" },
  { id: "stop-at-point-b", label: "Verify PR has come to a complete stop" },
  { id: "scan-point-b", label: "Begin terrain scan at Point B" },
  { id: "select-point-c", label: "Determine “Point C” and drop pin" },
  {
    id: "save-point-b-data",
    label: "Ensure terrain data for Point B is stored",
  },

  // Point C Terrain Scan
  { id: "nav-point-c", label: "Navigate to Point C" },
  { id: "stop-at-point-c", label: "Verify PR has come to a complete stop" },
  { id: "scan-point-c", label: "Begin terrain scan at Point C" },
  {
    id: "save-point-c-data",
    label: "Ensure terrain data for Point C is stored",
  },
  { id: "verify-home-path", label: "Verify path to home base is generated" },
  { id: "nav-home", label: "Begin navigation to home base" },

  // EVA egress
  { id: "verify-ping", label: "Verify ping received from LTV" },
  { id: "verify-pois", label: "Verify worksite POI locations provided by LTV" },

  // Determine nav path
  { id: "unlock-airlock", label: "Unlock airlock & announce all-clear for EV" },
];

export default function Procedures() {
  const [done, setDone] = useState<Record<string, boolean>>({});

  const toggle = (id: string) =>
    setDone((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="w-full h-full bg-gray-800 rounded-lg border border-blue-600 shadow-lg shadow-blue-500/10 overflow-hidden flex flex-col">
      <div className="bg-gray-700 p-2 border-b border-blue-600 flex items-center space-x-2 drag-handle hover:cursor-move">
        <CheckSquare size={18} className="text-blue-400" />
        <span className="font-bold">ROVER PROCEDURES</span>
      </div>

      <div className="flex-1 p-3 overflow-y-auto">
        <ul className="space-y-2">
          {TASKS.map(({ id, label }) => (
            <li key={id} className="flex items-center">
              <input
                type="checkbox"
                checked={!!done[id]}
                onChange={() => toggle(id)}
                className="form-checkbox h-4 w-4 text-green-400 bg-gray-700 border-gray-600 rounded focus:ring-0"
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
