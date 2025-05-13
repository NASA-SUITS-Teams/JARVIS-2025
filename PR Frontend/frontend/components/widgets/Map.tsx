"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MapIcon, BarChart2, Satellite, AlertCircle } from "lucide-react";
import { TSSData } from "@/types/tss";
import { MapElement } from "@/types/api";

// coordinate ranges for the maps as provided
const coordinateRanges = {
  moon: { x: [-6500, -5500], y: [-10400, -9800] },
  rock: { x: [-5760, -5550], y: [-10070, -9940] },
};

// clamp helper
const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);

function toPercent(value: number, [min, max]: readonly [number, number]) {
  return ((value - min) / (max - min)) * 100;
}

// Given an [x,y] and the active map, return { left, top } in percents
function percentPosition(pos: readonly [number, number], map: "moon" | "rock") {
  const ranges = coordinateRanges[map];
  const xPct = clamp(toPercent(pos[0], ranges.x), 0, 100);
  const yPct = clamp(toPercent(pos[1], ranges.y), 0, 100);

  // note: we flip Y so 0% is at bottom of the image
  return { left: xPct, top: 100 - yPct };
}

export default function Map({
  tssData,
  mapData,
  visibleLayers,
}: {
  tssData: TSSData;
  mapData: MapElement[];
  visibleLayers: {
    eva: boolean;
    pr: boolean;
    pin: boolean;
    poi: boolean;
  };
}) {
  const [activeMap, setActiveMap] = useState<"moon" | "rock">("moon");
  const [poiMode, setPoiMode] = useState(false);
  const poiCount = mapData.filter((e) => e.type === "poi").length + 1;

  // calculate rover position from tssData
  const rover = tssData.ROVER?.rover;
  const roverPos = rover
    ? percentPosition([rover.posx, rover.posy], activeMap)
    : null;

  // @TODO calculate EVA position from lunar link or TSS data

  // @TODO handle adding points to the map

  // @TODO offer option to store historical data pointa and draw a line from starting to end

  return (
    <div className="flex flex-col h-full w-full bg-gray-800 rounded-lg border border-blue-600 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-700 border-b border-blue-600">
        <div className="flex items-center space-x-2 drag-handle">
          <MapIcon size={18} className="text-blue-400" />
          <span className="font-bold">MAP</span>
        </div>
        <div className="flex space-x-2">
          {(["moon", "rock"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setActiveMap(mode)}
              className={`px-2 py-1 rounded text-xs ${
                activeMap === mode
                  ? "bg-blue-600"
                  : "bg-gray-600 hover:bg-gray-500"
              }`}
            >
              {mode === "moon" ? "MOON" : "ROCK YARD"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative w-full aspect-[9/7] overflow-hidden rounded-sm">
          <Image
            src={`/maps/${activeMap}.tiff`}
            alt={activeMap === "moon" ? "Moon surface" : "Rock yard"}
            fill
            className="object-cover"
          />

          {roverPos && visibleLayers.pr && (
            <div
              className="absolute w-5 h-5 bg-purple-500 rounded-full border-2 border-white z-20"
              style={{
                left: `${roverPos.left}%`,
                top: `${roverPos.top}%`,
                transform: "translate(-50%, -50%)",
              }}
            />
          )}

          <div className="absolute top-2 right-2 bg-gray-800/80 text-xs text-blue-300 p-1 rounded">
            X {rover?.posx.toFixed(1)} Y {rover?.posy.toFixed(1)}
          </div>

          {mapData.map((el) => {
            const [x, y] = el.position;
            const pos = percentPosition([x, y], activeMap);

            // calculate color based on type
            let color;
            switch (el.type) {
              case "pin":
                color = "bg-green-500";
                break;
              case "poi":
                color = "bg-orange-500";
                break;
              default:
                color = "bg-blue-500";
            }

            // loop through and check if layer is visible
            const isVisible =
              //(el.type === "eva" && visibleLayers.eva) ||
              (el.type === "pin" && visibleLayers.pin) ||
              (el.type === "poi" && visibleLayers.poi);
            if (!isVisible) return null;

            return (
              <div
                key={el.name}
                style={{
                  position: "absolute",
                  left: `${pos.left}%`,
                  top: `${pos.top}%`,
                  transform: "translate(-50%, -50%)",
                }}
                className={`absolute w-5 h-5 ${color} rounded-full border-2 border-white z-20`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
