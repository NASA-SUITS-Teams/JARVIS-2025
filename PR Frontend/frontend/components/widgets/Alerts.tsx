import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { getAlerts } from "@/utils/alerts";
import { TSSData } from "@/types/tss";
import { Alert } from "@/types/api";

export default function Alerts({ tssData }: { tssData: TSSData }) {
  const [alertData, setAlertData] = useState<Alert[]>([]);

  useEffect(() => {
    // pull out the rover and eva telemetry and run the threshold checker
    const pr = tssData.ROVER_TELEMETRY.pr_telemetry;
    const evas = tssData.TELEMETRY.telemetry;

    if (!pr || !evas) return;

    setAlertData(getAlerts(pr, evas, tssData.EVA.eva.started, tssData.EVA.eva.total_time));
  }, [tssData]);

  return (
    <div className="w-full h-full bg-gray-800 rounded-lg border border-blue-600 shadow-lg shadow-blue-500/10 overflow-hidden flex flex-col">
      <div className="bg-gray-700 p-2 border-b border-blue-600 flex items-center space-x-2 drag-handle hover:cursor-move">
        <Bell size={18} className="text-blue-400" />
        <span className="font-bold">ALERTS</span>
        <span className="text-xs text-white bg-blue-600 px-2 py-1 ml-auto rounded-md">
          {alertData.length || "None"}
        </span>
      </div>

      <div className="flex-1 p-2 overflow-y-auto">
        <div className="space-y-2">
          {alertData.map((alert, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-md border ${
                alert.type == "ROVER"
                  ? "border-red-500 bg-red-900/30"
                  : "border-orange-500 bg-orange-900/30"
              } text-xs`}
            >
              <div className="flex justify-between">
                <span className="font-bold text-blue-200">{alert.name}</span>
              </div>
              <div className="mt-1 text-gray-300">{alert.description}</div>
              <div className="mt-1 text-gray-400 flex">
                <span>Time: {alert.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
