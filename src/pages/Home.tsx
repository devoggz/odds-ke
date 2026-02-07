import { useEffect, useState } from "react";
import SportsCard from "../components/SportsCard";
import type { Sport } from "../types";
import { fetchSports } from "../services/api";

export default function Home() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  // Featured sports - the most popular betting sports (reduced to 4 for single row)
  const featuredSportKeys = [
    "soccer_epl",
    "basketball_nba",
    "americanfootball_nfl",
    "soccer_uefa_champs_league",
  ];

  useEffect(() => {
    const loadSports = async () => {
      try {
        const data = await fetchSports();
        setSports(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load sports");
        setLoading(false);
      }
    };

    loadSports();
  }, []);

  const featuredSports = sports.filter(
    (sport) => featuredSportKeys.includes(sport.key) && sport.active,
  );

  const otherSports =
    filter === "all"
      ? sports.filter((sport) => !featuredSportKeys.includes(sport.key))
      : sports.filter(
          (sport) =>
            sport.group === filter && !featuredSportKeys.includes(sport.key),
        );

  const groups = [...new Set(sports.map((sport) => sport.group))];

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <div
          style={{
            display: "inline-block",
            width: "50px",
            height: "50px",
            border: "5px solid #f3f3f3",
            borderTop: "5px solid #007bff",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <h2 style={{ marginTop: "20px" }}>Loading sports...</h2>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "red" }}>
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px" }}>
      {/* Header Section */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "50px",
          padding: "60px 20px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "20px",
          color: "white",
          boxShadow: "0 10px 30px rgba(102, 126, 234, 0.3)",
        }}
      >
        <h1
          style={{
            fontSize: "56px",
            marginBottom: "16px",
            fontWeight: "bold",
            textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          254 Betting Odds
        </h1>
        <p
          style={{
            fontSize: "20px",
            opacity: 0.95,
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          Live odds from top bookmakers across {sports.length} sports worldwide
        </p>
      </div>

      {/* Featured Sports Section */}
      {featuredSports.length > 0 && (
        <section style={{ marginBottom: "60px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "24px",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <h2
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                color: "#333",
                margin: 0,
              }}
            >
              ⭐ Featured Sports
            </h2>
            <span
              style={{
                padding: "6px 16px",
                backgroundColor: "#f0f0f0",
                borderRadius: "20px",
                fontSize: "14px",
                color: "#666",
                fontWeight: "600",
              }}
            >
              Most Popular
            </span>
          </div>

          {/* Featured sports in single row grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "20px",
            }}
          >
            {featuredSports.map((sport) => (
              <SportsCard
                key={sport.key}
                sport={sport}
                size="medium"
                featured={true}
              />
            ))}
          </div>
        </section>
      )}

      {/* Divider */}
      <div
        style={{
          height: "1px",
          backgroundColor: "#e0e0e0",
          marginBottom: "40px",
          marginTop: "40px",
        }}
      />

      {/* Other Sports Section */}
      <section>
        <div style={{ marginBottom: "24px" }}>
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#333",
              marginBottom: "20px",
            }}
          >
            All Sports
          </h2>

          {/* Filter Buttons */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => setFilter("all")}
              style={{
                padding: "10px 20px",
                backgroundColor: filter === "all" ? "#007bff" : "white",
                color: filter === "all" ? "white" : "#333",
                border: `2px solid ${filter === "all" ? "#007bff" : "#ddd"}`,
                borderRadius: "20px",
                cursor: "pointer",
                fontWeight: filter === "all" ? "bold" : "normal",
                transition: "all 0.3s",
                fontSize: "14px",
              }}
            >
              All ({otherSports.length})
            </button>
            {groups.map((group) => {
              const count = sports.filter(
                (s) => s.group === group && !featuredSportKeys.includes(s.key),
              ).length;
              if (count === 0) return null;

              return (
                <button
                  key={group}
                  onClick={() => setFilter(group)}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: filter === group ? "#007bff" : "white",
                    color: filter === group ? "white" : "#333",
                    border: `2px solid ${filter === group ? "#007bff" : "#ddd"}`,
                    borderRadius: "20px",
                    cursor: "pointer",
                    fontWeight: filter === group ? "bold" : "normal",
                    transition: "all 0.3s",
                    fontSize: "14px",
                    textTransform: "capitalize",
                  }}
                >
                  {group} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Other Sports Grid */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "flex-start",
          }}
        >
          {otherSports.map((sport) => (
            <SportsCard
              key={sport.key}
              sport={sport}
              size="small"
              featured={false}
            />
          ))}
        </div>

        {otherSports.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              backgroundColor: "white",
              borderRadius: "12px",
              border: "1px solid #e0e0e0",
            }}
          >
            <p style={{ fontSize: "18px", color: "#666" }}>
              No sports found in this category
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
