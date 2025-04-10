import React from 'react';

export default function SystemStates () {
  return (
    <div className="p-3 border-b border-blue-600/50">
      <div className="text-sm font-bold text-blue-300 mb-2">SYSTEM STATES</div>
      <div className="flex flex-wrap gap-2 mb-3">
        <button className="px-2 py-1 rounded-md text-xs bg-gray-600 hover:bg-gray-500">EVA #1</button>
        <button className="px-2 py-1 rounded-md text-xs bg-gray-600 hover:bg-gray-500">EVA #2</button>
        <button className="px-2 py-1 rounded-md text-xs bg-gray-600 hover:bg-gray-500">Suit</button>
        <button className="px-2 py-1 rounded-md text-xs bg-gray-600 hover:bg-gray-500">LTV</button>
      </div>
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span>Oxygen Level</span>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
            <span>48%</span>
          </div>
        </div>
        <div className="flex justify-between">
          <span>CO2 Level</span>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
            <span>63%</span>
          </div>
        </div>
        <div className="flex justify-between">
          <span>Communications</span>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
            <span>Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};
