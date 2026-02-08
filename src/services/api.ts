import axios from 'axios';
import type { Sport, OddsData } from '../types';

const API_KEY = import.meta.env.VITE_ODDS_API_KEY;
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

console.log('API_KEY:', API_KEY ? 'Loaded ✓' : 'NOT LOADED ✗');
console.log('BASE_URL:', BASE_URL);

export const fetchSports = async (): Promise<Sport[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/sports`, {
      params: {
        apiKey: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching sports:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response:', error.response?.data);
      console.error('Status:', error.response?.status);
    }
    throw error;
  }
};

export const fetchOdds = async (sportKey: string): Promise<OddsData[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/sports/${sportKey}/odds`, {
      params: {
        apiKey: API_KEY,
        regions: 'uk,us,eu,au',
        markets: 'h2h,spreads,totals',
        oddsFormat: 'decimal',
        dateFormat: 'iso',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching odds:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response:', error.response?.data);
      console.error('Status:', error.response?.status);
    }
    throw error;
  }
};

// Fetch scores for completed or live games
export const fetchScores = async (sportKey: string, daysFrom: number = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/sports/${sportKey}/scores`, {
      params: {
        apiKey: API_KEY,
        daysFrom: daysFrom,
        dateFormat: 'iso',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching scores:', error);
    throw error;
  }
};

// Fetch today's games across top leagues
export const fetchTodaysGames = async () => {
  const topLeagues = [
    'soccer_epl',
    'basketball_nba',
    'americanfootball_nfl',
    'soccer_uefa_champs_league',
    'baseball_mlb',
    'icehockey_nhl',
  ];

  try {
    const allGames = await Promise.all(
        topLeagues.map(async (league) => {
          try {
            const odds = await fetchOdds(league);
            // Filter for games today (next 24 hours)
            const now = new Date();
            const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

            return odds
                .filter(game => {
                  const gameTime = new Date(game.commence_time);
                  return gameTime >= now && gameTime <= tomorrow;
                })
                .map(game => ({ ...game, league }));
          } catch (err) {
            console.error(`Error fetching ${league}:`, err);
            return [];
          }
        })
    );

    return allGames.flat().sort((a, b) =>
        new Date(a.commence_time).getTime() - new Date(b.commence_time).getTime()
    );
  } catch (error) {
    console.error('Error fetching todays games:', error);
    throw error;
  }
};

// Fetch best value odds for today
export const fetchBestOddsToday = async () => {
  const topLeagues = [
    'soccer_epl',
    'basketball_nba',
    'americanfootball_nfl',
    'soccer_uefa_champs_league',
    'baseball_mlb',
  ];

  try {
    const allOdds = await Promise.all(
        topLeagues.map(async (league) => {
          try {
            const odds = await fetchOdds(league);
            // Filter for games today
            const now = new Date();
            const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

            return odds
                .filter(game => {
                  const gameTime = new Date(game.commence_time);
                  return gameTime >= now && gameTime <= tomorrow;
                })
                .map(game => ({ ...game, league }));
          } catch (err) {
            console.error(`Error fetching ${league}:`, err);
            return [];
          }
        })
    );

    // Flatten and calculate best value odds
    const gamesWithValue = allOdds.flat().map(game => {
      const h2hMarket = game.bookmakers[0]?.markets.find(m => m.key === 'h2h');
      if (!h2hMarket) return null;

      // Calculate average and best odds for each outcome
      const outcomes = h2hMarket.outcomes.map(outcome => {
        const allPrices = game.bookmakers
            .map(b => b.markets.find(m => m.key === 'h2h')?.outcomes.find(o => o.name === outcome.name)?.price)
            .filter(Boolean) as number[];

        const avg = allPrices.reduce((a, b) => a + b, 0) / allPrices.length;
        const best = Math.max(...allPrices);
        const valueScore = best - avg;

        return {
          name: outcome.name,
          bestOdds: best,
          avgOdds: avg,
          valueScore,
        };
      });

      const maxValueOutcome = outcomes.reduce((max, curr) =>
          curr.valueScore > max.valueScore ? curr : max
      );

      return {
        ...game,
        valueOutcome: maxValueOutcome,
      };
    }).filter(Boolean);

    // Sort by value score descending
    return gamesWithValue.sort((a, b) =>
        (b?.valueOutcome?.valueScore || 0) - (a?.valueOutcome?.valueScore || 0)
    ).slice(0, 10); // Top 10 value bets
  } catch (error) {
    console.error('Error fetching best odds:', error);
    throw error;
  }
};