import { useAPI } from "@/hooks/useAPI";
import { AlertCircle, MapIcon, Satellite, ScanSearchIcon } from "lucide-react";

export default function QuickActions({ setAddPinClicked, addPinClicked }) {
  const { resetPins } = useAPI();

  return (
    <div className="p-3">
      <div className="text-sm font-bold text-blue-300 mb-2">QUICK ACTIONS</div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <button className="p-2 bg-blue-900/50 hover:bg-blue-800/50 border border-blue-600 rounded-md flex flex-col items-center">
          <Satellite size={16} className="mb-1" />
          <span>Calc Best Path</span>
        </button>
        <button
          className={`p-2 ${
            addPinClicked
              ? "bg-orange-900/50 hover:bg-orange-800/50 border border-orange-600"
              : "bg-blue-900/50 hover:bg-blue-800/50 border border-blue-600"
          } rounded-md flex flex-col items-center`}
          onClick={() => {
            setAddPinClicked(true);
          }}
        >
          <AlertCircle size={16} className="mb-1" />
          <span>Add Pin</span>
        </button>
        <button
          className="p-2 bg-blue-900/50 hover:bg-blue-800/50 border border-blue-600 rounded-md flex flex-col items-center"
          onClick={async () => {
            await resetPins();
            alert("Pins reset, will be updated in 0-10 seconds");
          }}
        >
          <MapIcon size={16} className="mb-1" />
          <span>Reset Map</span>
        </button>
        <button className="p-2 bg-blue-900/50 hover:bg-blue-800/50 border border-blue-600 rounded-md flex flex-col items-center">
          <ScanSearchIcon size={16} className="mb-1" />
          <span>Scan Terrain</span>
        </button>
      </div>
    </div>
  );
}
