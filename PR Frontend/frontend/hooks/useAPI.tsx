import { APIResponseData } from "@/types/api";
import { useEffect, useState } from "react";

// @TODO add historical data storage too

const API_URL = "http://localhost:8282"; // replace with the python flask server URL

export const useAPI = () => {
  const [data, setData] = useState<APIResponseData>({
    tssData: {},
    lunarlinkData: {},
    mapData: [],
    alertData: [],
  });
  const [error, setError] = useState(null);
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

      const response = await fetch(API_URL + '/get_data', options);
      const result: APIResponseData = await response.json();
    
      setData(result);
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

  const sendPin = async (pin: { x: number; y: number }) => {
  }

  const requestTerrainScan = async () => {

  }

  return { data, error, loading };
};
