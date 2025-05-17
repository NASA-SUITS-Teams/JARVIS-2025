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
  const [pollServerData, setPollServerData] = useState(false);
  const [loading, setLoading] = useState(true);
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
    if (!pollServerData) return;

    fetchData(); // fetch once on mount

    const interval = setInterval(() => {
      setError(null); // Reset error state before fetching
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, [pollServerData]);

  const sendPin = async (newPin: [number, number]) => {
    await fetch("http://localhost:8282" + "/add_pin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        position: newPin,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          alert("Error adding pin: " + response.statusText);
        }
        return response.json();
      })
      .catch((error) => alert("Error adding pin: " + error));
  };

  const resetPins = async () => {
    await fetch("http://localhost:8282" + "/reset_pins", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          alert("Error resetting pins: " + response.statusText);
        }
        return response.json();
      })
      .catch((error) => alert("Error resetting pins: " + error));
  };

  return { data, error, loading, historicalData, sendPin, setPollServerData, resetPins };
};
