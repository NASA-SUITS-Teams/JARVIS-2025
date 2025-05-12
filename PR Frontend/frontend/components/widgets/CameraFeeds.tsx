import { Sliders } from "lucide-react";

export default function CameraFeeds() {
  return (
    <div className="col-start-4 row-start-2 bg-gray-800 rounded-lg border border-blue-600 shadow-lg shadow-blue-500/20 overflow-hidden flex flex-col">
      <div className="bg-gray-700 p-2 border-b border-blue-600 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sliders size={18} className="text-blue-400" />
          <span className="font-bold">CAM FEEDS</span>
        </div>
        <div className="flex space-x-2">
          <button className="px-2 py-1 rounded-md text-xs bg-gray-600 hover:bg-gray-500">
            EVA #1
          </button>
          <button className="px-2 py-1 rounded-md text-xs bg-gray-600 hover:bg-gray-500">
            EVA #2
          </button>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center bg-gray-700">
        <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
          [Placeholder for Camera Feed]
        </div>
      </div>
    </div>
  );
}
