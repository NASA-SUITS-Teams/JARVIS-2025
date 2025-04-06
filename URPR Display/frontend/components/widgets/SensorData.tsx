import { Terminal } from "lucide-react";

export default function SensorData() {
  const samples = [
    {
      id: 1,
      size: "5x3x4 cm",
      color: "Gray",
      texture: "Fine",
      status: "complete",
    },
    {
      id: 2,
      size: "1x2x3 cm",
      color: "Red",
      texture: "N/A",
      status: "incomplete",
    },
    { id: 3, size: "N/A", color: "N/A", texture: "N/A", status: "incomplete" },
    { id: 4, size: "N/A", color: "N/A", texture: "N/A", status: "incomplete" },
  ];

  return (
    <div className="col-start-4 row-start-1 bg-gray-800 rounded-lg border border-blue-600 shadow-lg shadow-blue-500/20 overflow-hidden flex flex-col">
      <div className="bg-gray-700 p-2 border-b border-blue-600 flex items-center space-x-2">
        <Terminal size={18} className="text-blue-400" />
        <span className="font-bold">SENSOR DATA</span>
      </div>

      <div className="flex-1 p-2 overflow-y-auto">
        <div className="space-y-2">
          {samples.map((sample) => (
            <div
              key={sample.id}
              className={`p-2 rounded-md border text-xs ${
                sample.status === "complete"
                  ? "border-green-500 bg-green-900/30"
                  : "border-yellow-500 bg-yellow-900/30"
              }`}
            >
              <div className="font-bold text-blue-200">Sample #{sample.id}</div>
              <div className="text-gray-400">Size: {sample.size}</div>
              <div className="text-gray-400">Color: {sample.color}</div>
              <div className="text-gray-400">Texture: {sample.texture}</div>
              <div className="text-gray-400">Status: {sample.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
