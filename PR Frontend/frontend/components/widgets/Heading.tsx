"use client";

import React from "react";
import { Compass } from "lucide-react";
import { TSSData } from "@/types/tss";

type Props = {
  tssData: TSSData;
  pathData: [number, number][];
};

function headingDiff(roverHeading: number, path: [number, number][]) {
  if (path.length < 2) return 0;
  const [startX, startY] = path[0];
  const [endX, endY] = path[path.length - 1];
  const dx = endX - startX;
  const dy = endY - startY;

  let pathHeading = (90 - Math.atan2(dy, dx) * (180 / Math.PI)) % 360;
  if (pathHeading < 0) pathHeading += 360;

  let diff = pathHeading - roverHeading;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return 180 - diff;
}

export default function Heading({ tssData, pathData }: Props) {
  const roverHeading = tssData.ROVER_TELEMETRY.pr_telemetry.heading ?? 0;
  const diffDeg = headingDiff(roverHeading, pathData);

  return (
    <div className="flex flex-col h-full w-full bg-gray-800 rounded-lg border border-blue-600 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center px-4 py-2 bg-gray-700 border-b border-blue-600">
        <div className="flex items-center space-x-2 drag-handle hover:cursor-move">
          <Compass size={18} className="text-blue-400" />
          <span className="font-bold">Steering Assistant</span>
        </div>
      </div>

      {/* Body: compass dial */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="relative w-32 h-32">
          {/* Outer circle */}
          <div className="w-full h-full rounded-full border-2 border-blue-600" />

          {/* Needle */}
          <div
            className="absolute w-1 h-16 bg-blue-400 bottom-1/2 left-1/2 transform origin-bottom"
            style={{ transform: `translateX(-50%) rotate(${diffDeg}deg)` }}
          />

          {/* Center pivot */}
          <div className="absolute w-3 h-3 bg-blue-400 rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Numeric readout */}
        <div className="mt-2 text-sm text-gray-300">
          {diffDeg >= 0 ? "+" : ""}
          {diffDeg.toFixed(0)}°
        </div>
      </div>
    </div>
  );
}
