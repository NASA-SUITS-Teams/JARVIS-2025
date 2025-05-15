import { SpecData, SpecEntry } from "@/types/tss";
import { Terminal } from "lucide-react";

export default function ScanData({ specData }: { specData: SpecData }) {
  return (
    <div className="w-full h-full bg-gray-800 rounded-lg border border-blue-600 shadow-lg shadow-blue-500/10overflow-hidden flex flex-col">
      <div className="bg-gray-700 p-2 border-b border-blue-600 flex items-center space-x-2 drag-handle hover:cursor-move">
        <Terminal size={18} className="text-blue-400" />
        <span className="font-bold">SCAN DATA</span>
      </div>

      <div className="flex-1 p-2 overflow-y-auto">
        <div className="space-y-2">
          <div
            key={specData?.eva1.id}
            className={`p-2 rounded-md border text-xs ${
              checkScientificSignificance(specData?.eva1)
                ? "border-green-500 bg-green-900/30"
                : "border-orange-500 bg-orange-900/30"
            }`}
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
            className={`p-2 rounded-md border text-xs ${
              checkScientificSignificance(specData?.eva2)
                ? "border-green-500 bg-green-900/30"
                : "border-orange-500 bg-orange-900/30"
            }`}
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

const checkScientificSignificance = (specData: SpecEntry) => {
  // hardcoded thresholds for significant elements that can be found on the EVA procedures document
  const significantElements = {
    SiO2: { threshold: 30, comparison: "<" },
    TiO2: { threshold: 10, comparison: ">" },
    Al2O3: { threshold: 25, comparison: ">" },
    FeO: { threshold: 20, comparison: ">" },
    MnO: { threshold: 0.5, comparison: ">" },
    MgO: { threshold: 10, comparison: ">" },
    CaO: { threshold: 5, comparison: "<" },
    K2O: { threshold: 1, comparison: ">" },
    P2O3: { threshold: 1, comparison: ">" },
    other: { threshold: 50, comparison: ">" },
  };

  let isSignificant = false;
  for (const [key, value] of Object.entries(specData || {})) {
    if (significantElements[key]) {
      const { threshold, comparison } = significantElements[key];
      if (
        (comparison === ">" && value > threshold) ||
        (comparison === "<" && value < threshold)
      ) {
        isSignificant = true;
        break;
      }
    }
  }

  return isSignificant;
};
