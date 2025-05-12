export default function Alerts({ alertData }: { alertData: Alert[] }) {
  if (alertData.length === 0) {
    return (
      <div className="p-3 border-b border-blue-600/50">
        <div className="text-sm font-bold text-blue-300 mb-2">ALERTS</div>
        <div className="text-xs text-gray-500">No alerts at the moment.</div>
      </div>
    )
  }

  return (
    <div className="p-3 border-b border-blue-600/50">
      <div className="text-sm font-bold text-blue-300 mb-2">ALERTS</div>
      <div className="space-y-2 text-xs">
      {alertData.map((alert, index) => (
        <div key={index} className="p-2 bg-gray-800 border border-blue-600 rounded-md mb-2">
          <div className="font-bold">{alert.name}</div>
          <div className="text-gray-300">{alert.description}</div>
          <div className="text-gray-400 text-xs">{alert.time}</div>
        </div>
      ))}
    </div>
    </div>
  );
}
