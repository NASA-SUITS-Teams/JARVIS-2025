import { List } from "lucide-react";

export default function TaskQueue() {
  const tasks = [
    {
      id: 1,
      priority: "high",
      title: "Oxygen level maintenance",
      status: "pending",
      eta: "00:01:30",
    },
    {
      id: 2,
      priority: "critical",
      title: "Sample #2 scan incomplete",
      status: "pending",
      eta: "00:02:00",
    },
    {
      id: 3,
      priority: "medium",
      title: "Sample #3 scan",
      status: "queued",
      eta: "00:04:00",
    },
    {
      id: 4,
      priority: "low",
      title: "Comms check",
      status: "queued",
      eta: "00:00:30",
    },
    {
      id: 5,
      priority: "high",
      title: "Ingress",
      status: "queued",
      eta: "00:03:00",
    },
    {
      id: 6,
      priority: "low",
      title: "Sample #1 scan",
      status: "complete",
      eta: "00:02:37",
    },
  ];

  return (
    <div className="col-start-3 row-start-1 bg-gray-800 rounded-lg border border-blue-600 shadow-lg shadow-blue-500/20 overflow-hidden flex flex-col">
      <div className="bg-gray-700 p-2 border-b border-blue-600 flex items-center space-x-2">
        <List size={18} className="text-blue-400" />
        <span className="font-bold">TASK QUEUE</span>
      </div>

      <div className="flex-1 p-2 overflow-y-auto">
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`p-2 rounded-md border text-xs ${
                task.priority === "critical"
                  ? "border-red-500 bg-red-900/30"
                  : task.priority === "high"
                  ? "border-orange-500 bg-orange-900/30"
                  : task.priority === "medium"
                  ? "border-yellow-500 bg-yellow-900/30"
                  : "border-green-500 bg-green-900/30"
              }`}
            >
              <div className="flex justify-between">
                <span className="font-bold text-blue-200">{task.title}</span>
                <span
                  className={`uppercase text-xs ${
                    task.priority === "critical"
                      ? "text-red-400"
                      : task.priority === "high"
                      ? "text-orange-400"
                      : task.priority === "medium"
                      ? "text-yellow-400"
                      : "text-green-400"
                  }`}
                >
                  {task.priority}
                </span>
              </div>
              <div className="flex justify-between mt-1 text-gray-400">
                <span>Status: {task.status}</span>
                <span>ETA: {task.eta}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
