"use client";

import React from "react";
import { Clock, Play, Pause, CheckCircle } from "lucide-react";
import { TSSData } from "@/types/tss";

interface SubTimer {
  started: boolean;
  completed: boolean;
  time: number; // seconds
}

interface EvaData {
  started: boolean;
  paused: boolean;
  completed: boolean;
  total_time: number; // seconds
  uia: SubTimer;
  dcu: SubTimer;
  rover: SubTimer;
  spec: SubTimer;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")} : ${String(s).padStart(2, "0")}`;
}

export default function Timer({ tssData }: { tssData: TSSData }) {
  const data: EvaData = tssData.EVA.eva;
  const sections: [
    keyof Omit<EvaData, "started" | "paused" | "completed" | "total_time">,
    SubTimer
  ][] = [
    ["uia", data.uia],
    ["dcu", data.dcu],
    ["rover", data.rover],
    ["spec", data.spec],
  ];

  return (
    <div className="flex flex-col h-full w-full bg-gray-800 rounded-lg border border-blue-600 shadow-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-700 border-b border-blue-600">
        <div className="flex items-center space-x-2">
          <Clock size={18} className="text-blue-400" />
          <span className="font-bold">EVA Timer</span>
        </div>
        <div className="text-xs text-gray-400">
          Total: {formatTime(data.total_time)}
        </div>
      </div>

      <div className="flex-1 p-4 grid grid-cols-2 gap-4">
        {sections.map(([name, timer]) => (
          <div
            key={name}
            className="bg-gray-700 rounded-lg border border-blue-600 p-3 flex items-center justify-between"
          >
            <div className="flex items-center space-x-2">
              <Clock size={16} className="text-purple-300" />
              <span className="capitalize text-sm">{name}</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-base font-mono">
                {formatTime(timer.time)}
              </span>
              {timer.completed ? (
                <CheckCircle size={16} className="text-green-400" />
              ) : timer.started ? (
                <Pause size={16} className="text-yellow-400" />
              ) : (
                <Play size={16} className="text-blue-400" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
