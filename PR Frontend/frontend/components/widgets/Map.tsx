"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MapIcon } from "lucide-react";
import { TSSData } from "@/types/tss";
import { PinElement } from "@/types/api";

// coordinate ranges for the maps as provided
const coordinateRanges = {
  moon: { x: [-6550, -5450], y: [-10450, -9750] },
  rock: { x: [-5765, -5545], y: [-10075, -9940] },
};

const mapDimensions = {
  moon: { width: 3507, height: 2232 },
  rock: { width: 3507, height: 2220 },
};

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
  pinData,
  visibleLayers,
}: {
  tssData: TSSData;
  pinData: PinElement[];
  visibleLayers: {
    eva: boolean;
    pr: boolean;
    pin: boolean;
    poi: boolean;
  };
}) {
  const [activeMap, setActiveMap] = useState<"moon" | "rock">("moon");

  // calculate rover position from tssData
  const rover = tssData.ROVER?.rover;
  const roverPos = rover
    ? percentPosition([rover.posx, rover.posy], activeMap)
    : null;

  // calculate EVA position from tssData
  const eva1 = tssData.IMU?.imu.eva1;
  const eva2 = tssData.IMU?.imu.eva2;
  const eva1Pos = eva1
    ? percentPosition([eva1.posx, eva1.posy], activeMap)
    : null;
  const eva2Pos = eva2
    ? percentPosition([eva2.posx, eva2.posy], activeMap)
    : null;

  const poiArray = rover
    ? [
        [rover.poi_1_x, rover.poi_1_y],
        [rover.poi_2_x, rover.poi_2_y],
        [rover.poi_3_x, rover.poi_3_y],
      ].filter(([x, y]) => (x != null && x != 0 && y != null && y != 0))
    : []; // only keep the ones where both coords are not null/undefined

  // @TODO handle adding points to the map

  // @TODO offer option to store historical data pointa and draw a line from starting to end

  return (
    <div className="flex flex-col h-full w-full bg-gray-800 rounded-lg border border-blue-600 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-700 border-b border-blue-600">
        <div className="flex items-center space-x-2 drag-handle hover:cursor-move">
          <MapIcon size={18} className="text-blue-400" />
          <span className="font-bold">MAP</span>
          <span className="text-xs text-gray-400">
            {" "}
            (X:{rover?.posx?.toFixed(1) || "N/A"} Y:
            {rover?.posy?.toFixed(1) || "N/A"})
          </span>
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

      <div className="flex-1 flex items-center justify-center">
        <div className="relative h-full w-full">
          <Image
            src={`/maps/${activeMap}.tiff`}
            alt={activeMap === "moon" ? "Moon surface" : "Rock yard"}
            width={mapDimensions[activeMap].width}
            height={mapDimensions[activeMap].height}
          />

          {roverPos && visibleLayers.pr && (
            <div
              className="absolute z-20"
              style={{
                left: `${roverPos.left}%`,
                top: `${roverPos.top}%`,
                transform: `translate(-50%, -50%) rotate(${
                  tssData.ROVER_TELEMETRY?.pr_telemetry.heading || 0
                }deg)`,
              }}
            >
              <svg width="30" height="30" viewBox="0 0 24 24">
                <polygon
                  points="12,2 4,20 12,15 20,20"
                  fill="#9333ea"
                  stroke="white"
                  strokeWidth="2"
                  className="drop-shadow-md"
                />
              </svg>
            </div>
          )}

          {eva1Pos && visibleLayers.eva && (
            <div
              className="absolute z-20"
              style={{
                left: `${eva1Pos.left}%`,
                top: `${eva1Pos.top}%`,
                transform: `translate(-50%, -50%) rotate(${
                  tssData.IMU.imu.eva1.heading || 0
                }deg)`,
              }}
            >
              <svg width="30" height="30" viewBox="0 0 24 24">
                <polygon
                  points="12,2 4,20 12,15 20,20"
                  fill="#ec4899"
                  stroke="white"
                  strokeWidth="2"
                  className="drop-shadow-md"
                />
              </svg>
            </div>
          )}

          {poiArray.length > 0 &&
            visibleLayers.poi &&
            poiArray.map(([x, y], index) => {
              const pos = percentPosition([x, y], activeMap);
              return (
                <div
                  key={`poi-${index}`}
                  style={{
                    position: "absolute",
                    left: `${pos.left}%`,
                    top: `${pos.top}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  className="absolute w-5 h-5 bg-yellow-500 rounded-full border-2 border-white z-20"
                />
              );
            })}

          {eva2Pos && visibleLayers.eva && (
            <div
              className="absolute z-20"
              style={{
                left: `${eva2Pos.left}%`,
                top: `${eva2Pos.top}%`,
                transform: `translate(-50%, -50%) rotate(${
                  tssData.IMU.imu.eva1.heading || 0
                }deg)`,
              }}
            >
              <svg width="30" height="30" viewBox="0 0 24 24">
                <polygon
                  points="12,2 4,20 12,15 20,20"
                  fill="#ec4899"
                  stroke="white"
                  strokeWidth="2"
                  className="drop-shadow-md"
                />
              </svg>
            </div>
          )}

          {pinData.map((el) => {
            const [x, y] = el.position;
            const pos = percentPosition([x, y], activeMap);

            if (!visibleLayers.pin) return null;

            return (
              <div
                key={el.name}
                style={{
                  position: "absolute",
                  left: `${pos.left}%`,
                  top: `${pos.top}%`,
                  transform: "translate(-50%, -50%)",
                  // conditionally show the icon based on if top/left is an axtreme like 0 or 100
                  opacity: pos.left === 0 || pos.left === 100 ? 0 : 1,
                }}
                className={`absolute w-5 h-5 bg-green-500 rounded-full border-2 border-white z-20`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
