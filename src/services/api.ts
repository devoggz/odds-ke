import axios from "axios";
import type { Sport, OddsData } from "../types";

const API_KEY = import.meta.env.VITE_ODDS_API_KEY;
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

console.log("API_KEY:", API_KEY ? "Loaded ✓" : "NOT LOADED ✗");
console.log("BASE_URL:", BASE_URL);

export const fetchSports = async (): Promise<Sport[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/sports`, {
      params: {
        apiKey: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching sports:", error);
    if (axios.isAxiosError(error)) {
      console.error("Response:", error.response?.data);
      console.error("Status:", error.response?.status);
    }
    throw error;
  }
};

export const fetchOdds = async (sportKey: string): Promise<OddsData[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/sports/${sportKey}/odds`, {
      params: {
        apiKey: API_KEY,
        regions: "uk,us,eu,au", // Multiple regions for more bookmakers
        markets: "h2h,spreads,totals", // Multiple markets: winner, spreads, over/under
        oddsFormat: "decimal",
        dateFormat: "iso",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching odds:", error);
    if (axios.isAxiosError(error)) {
      console.error("Response:", error.response?.data);
      console.error("Status:", error.response?.status);
    }
    throw error;
  }
};

// NEW: Fetch event/game scores (for completed or live games)
export const fetchScores = async (sportKey: string, daysFrom: number = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/sports/${sportKey}/scores`, {
      params: {
        apiKey: API_KEY,
        daysFrom: daysFrom, // How many days back to fetch scores
        dateFormat: "iso",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching scores:", error);
    throw error;
  }
};
