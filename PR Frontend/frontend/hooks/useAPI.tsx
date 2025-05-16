import { APIResponseData } from "@/types/api";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:8282"; // replace with the python flask server URL

export const useAPI = () => {
  const [data, setData] = useState<APIResponseData>({
    tssData: {},
    lunarlinkData: {},
    pinData: [],
  });
  const [error, setError] = useState(null);
  const [historicalData, setHistoricalData] = useState<APIResponseData[]>(
    () => {
      if (typeof window === "undefined") {
        // server or prerender – no localStorage
        return [];
      }

      const saved = localStorage.getItem("historicalData");
      return saved ? JSON.parse(saved) : [];
    }
  );

  // Function to add new data to history
  const addToHistory = (newData: APIResponseData) => {
    setHistoricalData((prev) => {
      const next = [...prev, { ...newData, timestamp: Date.now() }].slice(-20);
      localStorage.setItem("historicalData", JSON.stringify(next));
      return next;
    });
  };

  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };

      const response = await fetch(API_URL + "/get_data", options);
      const result: APIResponseData = await response.json();
      if (!result.tssData) setError("No TSS data found"); // handle error if not recieving TSS data

      setData(result);
      addToHistory(result);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch new data every 5 seconds
  useEffect(() => {
    fetchData(); // fetch once on mount

    const interval = setInterval(() => {
      setError(null); // Reset error state before fetching
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const sendPin = async (pin: { x: number; y: number }) => {};

  const requestTerrainScan = async () => {};

  return { data, error, loading, historicalData };
};
