"use client";

import React from "react";
import { Clock } from "lucide-react";
import { TSSData } from "@/types/tss";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")} : ${String(s).padStart(2, "0")}`;
}

export default function Timer({ tssData }: { tssData: TSSData }) {
  const data = tssData.EVA.eva;

  const statusText = data.started
    ? data.completed
      ? "Completed"
      : data.paused
      ? "Paused"
      : "In Progress"
    : "Not Started";

  const statusColor = data.completed
    ? "text-green-500"
    : data.paused
    ? "text-yellow-500"
    : data.started
    ? "text-orange-500"
    : "text-gray-500";

  const timers = [
    {
      name: "UIA",
      ...data.uia,
    },
    {
      name: "DCU",
      ...data.dcu,
    },
    {
      name: "Rover",
      ...data.rover,
    },
    {
      name: "Spec",
      ...data.spec,
    },
  ];

  return (
    <div className="flex flex-col h-full w-full bg-gray-800 rounded-lg border border-blue-600 shadow-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-700 border-b border-blue-600">
        <div className="flex items-center space-x-2 drag-handle hover:cursor-move">
          <Clock size={18} className="text-blue-400" />
          <span className="font-bold">EVA Timer</span>
        </div>
        <div className={`flex items-center space-x-6 text-xs text-gray-400`}>
          <div>
            Status: <span className={statusColor}>{statusText}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 items-center justify-center">
        <div className="grid grid-cols-2 gap-2 p-2 w-full h-full">
          {timers.map((timer, index) => (
            <div
              key={index}
              className={`${
                timer.completed
                  ? "bg-green-700/30"
                  : timer.started
                  ? "bg-orange-700/30"
                  : "bg-gray-700"
              } rounded-lg border ${
                timer.completed
                  ? "border-green-500"
                  : timer.started
                  ? "border-orange-500"
                  : "border-blue-600"
              } px-3 py-7 flex items-center justify-center`}
            >
              <div className="flex items-center">
                <span className="text-sm">
                  {timer.name}: {formatTime(timer.time)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
