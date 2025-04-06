import { Moon } from "lucide-react";

export default function Header() {
  return (
    <div className="bg-gray-800 p-4 border-b border-blue-500 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Moon className="text-blue-400" size={24} />
        <span className="text-xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
          PRESSURIZED ROVER UI
        </span>
      </div>
      <div className="flex space-x-4">
        <div className="flex items-center space-x-2 text-green-400">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
          <span>SYSTEMS NOMINAL</span>
        </div>
        <div className="text-blue-300">Mission Timer: 00:07:37</div>
      </div>
    </div>
  );
}
