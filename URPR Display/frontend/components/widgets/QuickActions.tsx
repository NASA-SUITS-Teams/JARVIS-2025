import { AlertCircle, Grid, MapIcon, Satellite } from "lucide-react";

export default function QuickActions({ handleAddPoint }) {
  return (
    <div className="p-3">
      <div className="text-sm font-bold text-blue-300 mb-2">QUICK ACTIONS</div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <button className="p-2 bg-blue-900/50 hover:bg-blue-800/50 border border-blue-600 rounded-md flex flex-col items-center">
          <Satellite size={16} className="mb-1" />
          <span>Path to Rover</span>
        </button>
        <button
          className="p-2 bg-blue-900/50 hover:bg-blue-800/50 border border-blue-600 rounded-md flex flex-col items-center"
          onClick={handleAddPoint}
        >
          <AlertCircle size={16} className="mb-1" />
          <span>Add Point</span>
        </button>
        <button className="p-2 bg-blue-900/50 hover:bg-blue-800/50 border border-blue-600 rounded-md flex flex-col items-center">
          <Grid size={16} className="mb-1" />
          <span>Breadcrumb Editor</span>
        </button>
        <button className="p-2 bg-blue-900/50 hover:bg-blue-800/50 border border-blue-600 rounded-md flex flex-col items-center">
          <MapIcon size={16} className="mb-1" />
          <span>Reset Minimap</span>
        </button>
      </div>
    </div>
  );
}
