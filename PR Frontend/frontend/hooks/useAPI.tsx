import { APIResponseData } from "@/types/api";
import { useEffect, useState } from "react";

const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8282/get_data"; // replace with the python flask server URL

export const useAPI = () => {
  const [data, setData] = useState<APIResponseData>({
    tssData: {},
    lunarlinkData: {},
    mapData: [],
    alertData: [],
    tpqData: [],
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

      const response = await fetch(API_URL, options);
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

  return { data, error, loading };
};
