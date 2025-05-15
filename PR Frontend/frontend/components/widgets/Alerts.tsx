import { Alert } from "@/types/api";
import { Bell } from "lucide-react";

export default function Alerts({ alertData }: { alertData: Alert[] }) {
  return (
    <div className="w-full h-full bg-gray-800 rounded-lg border border-blue-600 shadow-lg shadow-blue-500/10 overflow-hidden flex flex-col">
      <div className="bg-gray-700 p-2 border-b border-blue-600 flex items-center space-x-2 drag-handle hover:cursor-move">
        <Bell size={18} className="text-blue-400" />
        <span className="font-bold">ALERTS</span>
      </div>

      <div className="flex-1 p-2 overflow-y-auto">
        <div className="space-y-2">
          {alertData.map((alert, idx) => (
            <div
              key={idx}
              className="p-2 rounded-md border border-red-500 bg-red-900/30 text-xs"
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
