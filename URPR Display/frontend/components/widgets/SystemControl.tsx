import React from 'react';
import SystemStates from '@/components/widgets/SystemStates';
import Alerts from '@/components/widgets/Alerts';
import QuickActions from '@/components/widgets/QuickActions';

export default function SystemControl ({ handleAddPoint }) {
  return (
    <div className="w-64 border-l border-blue-600 bg-gray-800 flex flex-col">
      <div className="bg-gray-700 p-2 border-b border-blue-600 flex items-center justify-center">
        <span className="font-bold">SYSTEM CONTROL</span>
      </div>
      <SystemStates />
      <Alerts />
      <QuickActions handleAddPoint={handleAddPoint} />
      <div className="mt-auto p-3 text-xs text-gray-500">
        <div className="text-center">TEAM JARVIS</div>
        <div className="text-center">UI v4.2.25</div>
      </div>
    </div>
  );
};
