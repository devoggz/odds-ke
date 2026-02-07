import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { OddsData } from "../types";
import { fetchOdds } from "../services/api";

export default function OddsPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [odds, setOdds] = useState<OddsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<string>("h2h");
  const [sortBy, setSortBy] = useState<"time" | "popular">("time");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  useEffect(() => {
    const loadOdds = async () => {
      if (!slug) return;

      try {
        const data = await fetchOdds(slug);
        setOdds(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load odds");
        setLoading(false);
      }
    };

    loadOdds();
  }, [slug]);

  const getMarketLabel = (marketKey: string) => {
    const labels: Record<string, string> = {
      h2h: "Match Winner",
      spreads: "Point Spread",
      totals: "Over/Under",
    };
    return labels[marketKey] || marketKey;
  };

  const getMarketIcon = (marketKey: string) => {
    const icons: Record<string, string> = {
      h2h: "🏆",
      spreads: "📊",
      totals: "📈",
    };
    return icons[marketKey] || "🎯";
  };

  const getBestOdds = (bookmakers: any[], marketKey: string) => {
    const allOutcomes: any[] = [];

    bookmakers.forEach((bookmaker) => {
      const market = bookmaker.markets.find((m: any) => m.key === marketKey);
      if (market) {
        market.outcomes.forEach((outcome: any) => {
          allOutcomes.push({
            ...outcome,
            bookmaker: bookmaker.title,
            bookmakerKey: bookmaker.key,
            lastUpdate: market.last_update,
          });
        });
      }
    });

    // Group by outcome name and find best odds
    const grouped = allOutcomes.reduce((acc: any, curr: any) => {
      const key = curr.name;
      if (!acc[key] || curr.price > acc[key].price) {
        acc[key] = curr;
      }
      return acc;
    }, {});

    return Object.values(grouped);
  };

  const getAverageOdds = (
    bookmakers: any[],
    marketKey: string,
    outcomeName: string,
  ) => {
    const prices: number[] = [];

    bookmakers.forEach((bookmaker) => {
      const market = bookmaker.markets.find((m: any) => m.key === marketKey);
      if (market) {
        const outcome = market.outcomes.find(
          (o: any) => o.name === outcomeName,
        );
        if (outcome) {
          prices.push(outcome.price);
        }
      }
    });

    if (prices.length === 0) return null;
    const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
    return avg.toFixed(2);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffMs < 0) {
      return { text: "Live Now", color: "#f44336", badge: "LIVE", time: date };
    } else if (diffHours < 1) {
      return {
        text: `Starting in ${Math.floor(diffMs / (1000 * 60))} min`,
        color: "#ff9800",
        badge: "SOON",
        time: date,
      };
    } else if (diffHours < 24) {
      return {
        text: `Today ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
        color: "#ff9800",
        badge: "TODAY",
        time: date,
      };
    } else if (diffDays < 7) {
      return {
        text: `${date.toLocaleDateString("en-US", { weekday: "short" })} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
        color: "#4caf50",
        badge: "",
        time: date,
      };
    } else {
      return {
        text: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        color: "#666",
        badge: "",
        time: date,
      };
    }
  };

  const sortedOdds = [...odds].sort((a, b) => {
    if (sortBy === "time") {
      return (
        new Date(a.commence_time).getTime() -
        new Date(b.commence_time).getTime()
      );
    } else {
      return b.bookmakers.length - a.bookmakers.length;
    }
  });

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "#f8f9fa",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              display: "inline-block",
              width: "60px",
              height: "60px",
              border: "6px solid #f3f3f3",
              borderTop: "6px solid #007bff",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          <h2 style={{ marginTop: "24px", color: "#333" }}>Loading odds...</h2>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "#f8f9fa",
        }}
      >
        <div
          style={{ textAlign: "center", maxWidth: "500px", padding: "40px" }}
        >
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>😕</div>
          <h2 style={{ color: "#f44336", marginBottom: "16px" }}>{error}</h2>
          <p style={{ color: "#666", marginBottom: "24px" }}>
            We couldn't load the odds for this sport. Please try again.
          </p>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "12px 24px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  const availableMarkets = odds[0]?.bookmakers[0]?.markets.map(
    (m) => m.key,
  ) || ["h2h"];

  return (
    <div
      style={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        paddingBottom: "40px",
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          backgroundColor: "white",
          borderBottom: "1px solid #e0e0e0",
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{ maxWidth: "1400px", margin: "0 auto", padding: "16px 20px" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <button
                onClick={() => navigate("/")}
                style={{
                  padding: "10px 18px",
                  backgroundColor: "#f8f9fa",
                  color: "#333",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#e9ecef";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#f8f9fa";
                }}
              >
                ← Back
              </button>

              <div>
                <h1
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#333",
                    margin: "0 0 4px 0",
                  }}
                >
                  {odds[0]?.sport_title || slug}
                </h1>
                <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
                  {odds.length} {odds.length === 1 ? "match" : "matches"} •{" "}
                  {odds[0]?.bookmakers.length || 0} bookmakers
                </p>
              </div>
            </div>

            {/* View Toggle */}
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => setViewMode("list")}
                style={{
                  padding: "8px 16px",
                  backgroundColor: viewMode === "list" ? "#007bff" : "white",
                  color: viewMode === "list" ? "white" : "#666",
                  border: "1px solid #e0e0e0",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                📋 List
              </button>
              <button
                onClick={() => setViewMode("grid")}
                style={{
                  padding: "8px 16px",
                  backgroundColor: viewMode === "grid" ? "#007bff" : "white",
                  color: viewMode === "grid" ? "white" : "#666",
                  border: "1px solid #e0e0e0",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                ▦ Grid
              </button>
            </div>
          </div>
        </div>
      </div>

      <main
        style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px 20px" }}
      >
        {/* Controls */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            flexWrap: "wrap",
            gap: "16px",
            backgroundColor: "white",
            padding: "16px 20px",
            borderRadius: "12px",
            border: "1px solid #e0e0e0",
          }}
        >
          {/* Market Selector */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {availableMarkets.map((market) => (
              <button
                key={market}
                onClick={() => setSelectedMarket(market)}
                style={{
                  padding: "10px 18px",
                  backgroundColor:
                    selectedMarket === market ? "#007bff" : "white",
                  color: selectedMarket === market ? "white" : "#333",
                  border: `1px solid ${selectedMarket === market ? "#007bff" : "#e0e0e0"}`,
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: selectedMarket === market ? "700" : "600",
                  transition: "all 0.2s",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {getMarketIcon(market)} {getMarketLabel(market)}
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => setSortBy("time")}
              style={{
                padding: "8px 14px",
                backgroundColor: sortBy === "time" ? "#f8f9fa" : "white",
                color: "#333",
                border: "1px solid #e0e0e0",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: sortBy === "time" ? "600" : "500",
              }}
            >
              🕐 By Time
            </button>
            <button
              onClick={() => setSortBy("popular")}
              style={{
                padding: "8px 14px",
                backgroundColor: sortBy === "popular" ? "#f8f9fa" : "white",
                color: "#333",
                border: "1px solid #e0e0e0",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: sortBy === "popular" ? "600" : "500",
              }}
            >
              🔥 Popular
            </button>
          </div>
        </div>

        {odds.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              backgroundColor: "white",
              borderRadius: "12px",
              border: "1px solid #e0e0e0",
            }}
          >
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>📭</div>
            <h3
              style={{ fontSize: "20px", color: "#333", marginBottom: "8px" }}
            >
              No upcoming matches
            </h3>
            <p style={{ color: "#666" }}>Check back later for new odds</p>
          </div>
        ) : (
          <div
            style={{
              display: viewMode === "grid" ? "grid" : "flex",
              gridTemplateColumns:
                viewMode === "grid"
                  ? "repeat(auto-fill, minmax(500px, 1fr))"
                  : "none",
              flexDirection: viewMode === "list" ? "column" : "row",
              gap: "20px",
            }}
          >
            {sortedOdds.map((match) => {
              const timeInfo = formatDateTime(match.commence_time);
              const bestOdds = getBestOdds(match.bookmakers, selectedMarket);

              return (
                <div
                  key={match.id}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    border: "1px solid #e0e0e0",
                    overflow: "hidden",
                    transition: "box-shadow 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(0,0,0,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Match Header */}
                  <div
                    style={{
                      padding: "20px 24px",
                      borderBottom: "1px solid #f0f0f0",
                      background: "linear-gradient(to bottom, #fafafa, white)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "12px",
                        gap: "16px",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <h2
                          style={{
                            fontSize: "20px",
                            fontWeight: "bold",
                            color: "#333",
                            marginBottom: "8px",
                            lineHeight: 1.3,
                          }}
                        >
                          {match.home_team}{" "}
                          <span style={{ color: "#999", fontWeight: "normal" }}>
                            vs
                          </span>{" "}
                          {match.away_team}
                        </h2>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              color: timeInfo.color,
                              fontSize: "14px",
                              fontWeight: "600",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            🕐 {timeInfo.text}
                          </span>
                          {timeInfo.badge && (
                            <span
                              style={{
                                padding: "3px 10px",
                                backgroundColor: timeInfo.color,
                                color: "white",
                                borderRadius: "4px",
                                fontSize: "11px",
                                fontWeight: "bold",
                                letterSpacing: "0.5px",
                              }}
                            >
                              {timeInfo.badge}
                            </span>
                          )}
                        </div>
                      </div>

                      <div
                        style={{
                          textAlign: "right",
                          padding: "8px 14px",
                          backgroundColor: "#f0f7ff",
                          borderRadius: "8px",
                          border: "1px solid #d0e7ff",
                          minWidth: "80px",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "11px",
                            color: "#666",
                            marginBottom: "2px",
                            fontWeight: "600",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          Bookmakers
                        </p>
                        <p
                          style={{
                            fontSize: "24px",
                            fontWeight: "bold",
                            color: "#007bff",
                            margin: 0,
                          }}
                        >
                          {match.bookmakers.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Best Odds Summary */}
                  {bestOdds.length > 0 && (
                    <div
                      style={{
                        padding: "20px 24px",
                        backgroundColor: "#f0f7ff",
                        borderBottom: "1px solid #d0e7ff",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "16px",
                        }}
                      >
                        <h3
                          style={{
                            fontSize: "13px",
                            fontWeight: "bold",
                            color: "#0056b3",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            margin: 0,
                          }}
                        >
                          ⭐ Best {getMarketLabel(selectedMarket)} Odds
                        </h3>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: `repeat(${bestOdds.length}, 1fr)`,
                          gap: "12px",
                        }}
                      >
                        {bestOdds.map((outcome: any, idx: number) => {
                          const avgOdds = getAverageOdds(
                            match.bookmakers,
                            selectedMarket,
                            outcome.name,
                          );
                          const isAboveAverage = avgOdds
                            ? outcome.price > parseFloat(avgOdds)
                            : false;

                          return (
                            <div
                              key={idx}
                              style={{
                                padding: "16px",
                                backgroundColor: "white",
                                borderRadius: "8px",
                                border: "2px solid #007bff",
                                position: "relative",
                                textAlign: "center",
                              }}
                            >
                              {isAboveAverage && (
                                <div
                                  style={{
                                    position: "absolute",
                                    top: "-8px",
                                    right: "8px",
                                    backgroundColor: "#4caf50",
                                    color: "white",
                                    padding: "2px 8px",
                                    borderRadius: "10px",
                                    fontSize: "10px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  VALUE
                                </div>
                              )}

                              <div
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "15px",
                                  marginBottom: "4px",
                                  color: "#333",
                                }}
                              >
                                {outcome.name}
                                {outcome.point && (
                                  <div
                                    style={{
                                      fontSize: "12px",
                                      color: "#666",
                                      fontWeight: "normal",
                                    }}
                                  >
                                    ({outcome.point > 0 ? "+" : ""}
                                    {outcome.point})
                                  </div>
                                )}
                              </div>

                              <div
                                style={{
                                  fontSize: "28px",
                                  color: "#007bff",
                                  fontWeight: "bold",
                                  marginBottom: "4px",
                                }}
                              >
                                {outcome.price.toFixed(2)}
                              </div>

                              <div
                                style={{
                                  fontSize: "11px",
                                  color: "#666",
                                  marginBottom: "4px",
                                }}
                              >
                                via {outcome.bookmaker}
                              </div>

                              {avgOdds && (
                                <div
                                  style={{
                                    fontSize: "10px",
                                    color: "#999",
                                    borderTop: "1px solid #f0f0f0",
                                    paddingTop: "4px",
                                    marginTop: "4px",
                                  }}
                                >
                                  Avg: {avgOdds}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* All Bookmakers */}
                  <details style={{ borderTop: "1px solid #f0f0f0" }}>
                    <summary
                      style={{
                        cursor: "pointer",
                        padding: "16px 24px",
                        backgroundColor: "white",
                        fontWeight: "600",
                        fontSize: "14px",
                        color: "#333",
                        userSelect: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#fafafa";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "white";
                      }}
                    >
                      <span>
                        📊 View All Bookmakers ({match.bookmakers.length})
                      </span>
                      <span style={{ fontSize: "12px", color: "#999" }}>▼</span>
                    </summary>

                    <div
                      style={{
                        padding: "16px 24px 24px",
                        backgroundColor: "#fafafa",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "12px",
                        }}
                      >
                        {match.bookmakers.map((bookmaker) => {
                          const market = bookmaker.markets.find(
                            (m) => m.key === selectedMarket,
                          );
                          if (!market) return null;

                          return (
                            <div
                              key={bookmaker.key}
                              style={{
                                padding: "16px",
                                backgroundColor: "white",
                                borderRadius: "8px",
                                border: "1px solid #e0e0e0",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  marginBottom: "12px",
                                  paddingBottom: "12px",
                                  borderBottom: "1px solid #f0f0f0",
                                }}
                              >
                                <h4
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    color: "#333",
                                    margin: 0,
                                  }}
                                >
                                  {bookmaker.title}
                                </h4>
                                <span
                                  style={{ fontSize: "11px", color: "#999" }}
                                >
                                  Updated:{" "}
                                  {new Date(
                                    market.last_update,
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>

                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: `repeat(${market.outcomes.length}, 1fr)`,
                                  gap: "10px",
                                }}
                              >
                                {market.outcomes.map((outcome, idx) => {
                                  const avgOdds = getAverageOdds(
                                    match.bookmakers,
                                    selectedMarket,
                                    outcome.name,
                                  );
                                  const isAboveAverage = avgOdds
                                    ? outcome.price > parseFloat(avgOdds)
                                    : false;
                                  const isBest = bestOdds.some(
                                    (b: any) =>
                                      b.name === outcome.name &&
                                      b.bookmakerKey === bookmaker.key,
                                  );

                                  return (
                                    <div
                                      key={idx}
                                      style={{
                                        padding: "12px",
                                        backgroundColor: isBest
                                          ? "#f0f7ff"
                                          : "#fafafa",
                                        borderRadius: "6px",
                                        border: `1px solid ${isBest ? "#007bff" : "#e0e0e0"}`,
                                        textAlign: "center",
                                        position: "relative",
                                      }}
                                    >
                                      {isBest && (
                                        <div
                                          style={{
                                            position: "absolute",
                                            top: "-6px",
                                            right: "6px",
                                            backgroundColor: "#007bff",
                                            color: "white",
                                            padding: "2px 6px",
                                            borderRadius: "8px",
                                            fontSize: "9px",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          BEST
                                        </div>
                                      )}

                                      <div
                                        style={{
                                          fontWeight: "600",
                                          marginBottom: "4px",
                                          fontSize: "13px",
                                          color: "#333",
                                        }}
                                      >
                                        {outcome.name}
                                        {outcome.point && (
                                          <div
                                            style={{
                                              fontSize: "11px",
                                              color: "#666",
                                              fontWeight: "normal",
                                            }}
                                          >
                                            ({outcome.point > 0 ? "+" : ""}
                                            {outcome.point})
                                          </div>
                                        )}
                                      </div>

                                      <div
                                        style={{
                                          fontSize: "22px",
                                          color: isBest ? "#007bff" : "#333",
                                          fontWeight: "bold",
                                          marginBottom: "2px",
                                        }}
                                      >
                                        {outcome.price.toFixed(2)}
                                      </div>

                                      {isAboveAverage && !isBest && (
                                        <div
                                          style={{
                                            fontSize: "9px",
                                            color: "#4caf50",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          ↑ Above avg
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </details>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
