import { SpecData } from "@/types/tss";
import { Terminal } from "lucide-react";

export default function ScanData({ specData }: { specData: SpecData }) {
  console.log("ScanData", specData);

  return (
    <div className="w-full h-full bg-gray-800 rounded-lg border border-blue-600 shadow-lg shadow-blue-500/20 overflow-hidden flex flex-col">
      <div className="bg-gray-700 p-2 border-b border-blue-600 flex items-center space-x-2 drag-handle hover:cursor-move">
        <Terminal size={18} className="text-blue-400" />
        <span className="font-bold">SCAN DATA</span>
      </div>

      <div className="flex-1 p-2 overflow-y-auto">
        <div className="space-y-2">
          <div
            key={specData?.eva1.id}
            className={`p-2 rounded-md border text-xs border-green-500 bg-green-900/30`}
          >
            <div className="font-bold text-blue-200">
              Name: {specData?.eva1.name}
            </div>

            <div className="text-gray-400">Who: EVA1</div>
            <div className="text-gray-400 pb-2">ID: {specData?.eva1.id}</div>

            {Object.entries(specData?.eva1.data || {}).map(([key, value]) => (
              <div className="text-gray-400 pt-1" key={key}>
                {key}: {value}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <div
            key={specData?.eva2.id}
            className={`p-2 rounded-md border text-xs border-green-500 bg-green-900/30`}
          >
            <div className="font-bold text-blue-200">
              Name: {specData?.eva2.name}
            </div>

            <div className="text-gray-400">Who: EVA2</div>
            <div className="text-gray-400 pb-2">ID: {specData?.eva2.id}</div>

            {Object.entries(specData?.eva2.data || {}).map(([key, value]) => (
              <div className="text-gray-400 pt-1" key={key}>
                {key}: {value}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
