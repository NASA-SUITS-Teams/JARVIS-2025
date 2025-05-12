import { TPQItem } from "@/types/api";
import { List } from "lucide-react";

export default function TaskQueue({ taskData }: { taskData: TPQItem[] }) {
  return (
    <div className="col-start-3 row-start-1 bg-gray-800 rounded-lg border border-blue-600 shadow-lg shadow-blue-500/20 overflow-hidden flex flex-col">
      <div className="bg-gray-700 p-2 border-b border-blue-600 flex items-center space-x-2">
        <List size={18} className="text-blue-400" />
        <span className="font-bold">TASK QUEUE</span>
      </div>

      <div className="flex-1 p-2 overflow-y-auto">
        <div className="space-y-2">
          {taskData.map((task, index) => (
            <div
              key={index}
              className={`p-2 rounded-md border text-xs ${
                calculatePriority(task.priority) === "critical"
                  ? "border-red-500 bg-red-900/30"
                  : calculatePriority(task.priority) === "high"
                  ? "border-orange-500 bg-orange-900/30"
                  : calculatePriority(task.priority) === "medium"
                  ? "border-yellow-500 bg-yellow-900/30"
                  : "border-green-500 bg-green-900/30"
              }`}
            >
              <div className="flex justify-between">
                <span className="font-bold text-blue-200">{task.name}</span>
                <span
                  className={`uppercase text-xs ${
                    calculatePriority(task.priority) === "critical"
                      ? "text-red-400"
                      : calculatePriority(task.priority) === "high"
                      ? "text-orange-400"
                      : calculatePriority(task.priority) === "medium"
                      ? "text-yellow-400"
                      : "text-green-400"
                  }`}
                >
                  {calculatePriority(task.priority)}
                </span>
              </div>
              <div className="flex justify-between mt-1 text-gray-400">
                <span>ETA: {task.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const calculatePriority = (priority: number) =>  {
  switch (priority) {
    case priority < 2:
      return "critical";
    case priority >= 2 && priority < 4:
      return "high";
    case priority >= 4 && priority < 6:
      return "medium";
    case priority >= 6:
      return "low";
    default:
      return "low";
  }
}
