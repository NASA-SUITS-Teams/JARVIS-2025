import React, { useState, useMemo } from "react";
import { APIResponseData } from "@/types/api";
import { estimateFutureUsage } from "@/utils/resourceConsumption";
import { Terminal } from "lucide-react";
import { TSSData } from "@/types/tss";

export default function ResourceConsumption({
  historicalData,
  currentData,
}: {
  historicalData: APIResponseData[];
  currentData: TSSData;
}) {
  const [estimateTime, setEstimateTime] = useState(0);

  const calculateEndTime = () => {
    if (!currentData.ROVER_TELEMETRY.pr_telemetry) return;
    const remainingTime =
      45 - currentData.ROVER_TELEMETRY.pr_telemetry.mission_elapsed_time / 60;
    setEstimateTime(remainingTime);
  };

  const predictions = useMemo(() => {
    if (estimateTime <= 0) return {};
    return estimateFutureUsage(historicalData, currentData, estimateTime);
  }, [historicalData, currentData, estimateTime]);

  return (
    <div className="w-full h-full bg-gray-800 rounded-lg border border-blue-600 shadow-lg shadow-blue-500/10 flex flex-col overflow-hidden">
      <div className="bg-gray-700 p-2 border-b border-blue-600 flex items-center space-x-2">
        <div className="flex items-center space-x-2 drag-handle hover:cursor-move">
          <Terminal size={18} className="text-blue-400" />
          <span className="font-bold">RESOURCE CONSUMPTION</span>
        </div>
      </div>
      <div className="p-3 flex flex-col space-y-3">
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-300">Estimate in (mins):</label>
          <input
            type="number"
            className="w-20 p-1 rounded bg-gray-700 text-gray-200 text-sm"
            value={estimateTime}
            onChange={(e) => setEstimateTime(parseInt(e.target.value, 10) || 0)}
          />
          <button
            className="bg-blue-600 py-1 px-2 text-sm text-white rounded hover:bg-blue-700"
            onClick={() => calculateEndTime()}
          >
            Calc End
          </button>
        </div>
        <div className="flex-1 overflow-auto text-xs">
          {estimateTime > 0 ? (
            <div className="space-y-2">
              {Object.entries(predictions).map(([key, val]) => (
                <div key={key} className="flex justify-between">
                  <span className="capitalize">{key.replace(/_/g, " ")}</span>
                  <span>{Math.round(val * 100) / 100}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-sm">
              Enter minutes above to see predictions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
