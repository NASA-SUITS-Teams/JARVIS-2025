export default function Alerts() {
  return (
    <div className="p-3 border-b border-blue-600/50">
      <div className="text-sm font-bold text-blue-300 mb-2">RECENT ALERTS</div>
      <div className="space-y-2 text-xs">
        <div className="p-2 bg-yellow-900/30 border border-yellow-600 rounded-md">
          <div className="font-bold">Low O2 Warning</div>
          <div className="text-gray-300">Tank level below 50%</div>
          <div className="text-gray-400 text-xs">00:06:02</div>
        </div>
        <div className="p-2 bg-red-900/30 border border-red-600 rounded-md">
          <div className="font-bold">Sample #2 Scan Incomplete</div>
          <div className="text-gray-300">Return to Sample #2</div>
          <div className="text-gray-400 text-xs">00:05:37</div>
        </div>
      </div>
    </div>
  );
}
