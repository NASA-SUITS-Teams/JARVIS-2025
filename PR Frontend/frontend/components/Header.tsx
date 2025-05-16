import { useEffect, useState } from "react";

export default function Header({
  elapsedTime,
  error,
}: {
  elapsedTime: number;
  error: any;
}) {
  const [time, setTime] = useState<number | null>(elapsedTime ?? 0);

  useEffect(() => {
    setTime(elapsedTime ?? 0);
  }, [elapsedTime]);

  useEffect(() => {
    const id = setInterval(() => {
      setTime((prev) => prev + 0.1);
    }, 100);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-gray-800 p-3 border-b border-blue-500 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <span className="text-xl font-bold tracking-wider text-blue-400">
          TEAM JARVIS
        </span>
      </div>
      <div className="flex space-x-4">
        <div
          className={`flex items-center space-x-2 ${
            error ? "text-red-500" : "text-green-500"
          }`}
        >
          <div
            className={`w-3 h-3 rounded-full ${
              error ? "bg-red-500" : "bg-green-500"
            } animate-pulse`}
          ></div>
          <span>SYSTEMS {error ? "FAILURE" : "NORMAL"}</span>
        </div>
        <div
          className={`flex items-center space-x-2 ${
            error ? "text-red-500" : "text-green-500"
          }`}
        >
          <div
            className={`w-3 h-3 rounded-full ${
              error ? "bg-red-500" : "bg-green-500"
            } animate-pulse`}
          ></div>
          <span>LunarLink {error ? "FAILURE" : "NORMAL"}</span>{" "}
          {/* @TODO change this to actually use lunarlink status */}
        </div>
        <div className="text-blue-300">
          Mission Timer: {convertTimeToString(time)} (
          {calculateTimePercentage(time).toFixed(0)}%)
        </div>
      </div>
    </div>
  );
}

const convertTimeToString = (time: number) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
};

// Calculate the percentage of time elapsed out of 45 minutes
const calculateTimePercentage = (time: number) => {
  const totalTime = 45 * 60;
  const percentage = (time / totalTime) * 100;

  return percentage;
};
