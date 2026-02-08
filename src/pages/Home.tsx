import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SportsCard from '../components/SportsCard';
import type { Sport } from '../types';
import { fetchSports, fetchTodaysGames, fetchBestOddsToday } from '../services/api';

export default function Home() {
    const [sports, setSports] = useState<Sport[]>([]);
    const [todaysGames, setTodaysGames] = useState<any[]>([]);
    const [bestOdds, setBestOdds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [gamesLoading, setGamesLoading] = useState(true);
    const [oddsLoading, setOddsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>('all');

    const featuredSportKeys = [
        'soccer_epl',
        'basketball_nba',
        'americanfootball_nfl',
        'soccer_uefa_champs_league',
    ];

    useEffect(() => {
        const loadSports = async () => {
            try {
                const data = await fetchSports();
                setSports(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load sports');
                setLoading(false);
            }
        };

        const loadTodaysGames = async () => {
            try {
                const games = await fetchTodaysGames();
                setTodaysGames(games.slice(0, 6));
                setGamesLoading(false);
            } catch (err) {
                console.error('Failed to load todays games:', err);
                setGamesLoading(false);
            }
        };

        const loadBestOdds = async () => {
            try {
                const odds = await fetchBestOddsToday();
                setBestOdds(odds.slice(0, 8));
                setOddsLoading(false);
            } catch (err) {
                console.error('Failed to load best odds:', err);
                setOddsLoading(false);
            }
        };

        loadSports();
        loadTodaysGames();
        loadBestOdds();
    }, []);

    const featuredSports = sports.filter(sport =>
        featuredSportKeys.includes(sport.key) && sport.active
    );

    const otherSports = filter === 'all'
        ? sports.filter(sport => !featuredSportKeys.includes(sport.key))
        : sports.filter(sport => sport.group === filter && !featuredSportKeys.includes(sport.key));

    const groups = [...new Set(sports.map(sport => sport.group))];

    const getTimeUntilMatch = (commenceTime: string) => {
        const now = new Date();
        const matchTime = new Date(commenceTime);
        const diff = matchTime.getTime() - now.getTime();

        if (diff < 0) return 'Live';

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (hours === 0) return `${minutes}m`;
        if (hours < 24) return `${hours}h ${minutes}m`;
        return matchTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const getSportIcon = (league: string) => {
        const icons: Record<string, string> = {
            'soccer_epl': '⚽',
            'basketball_nba': '🏀',
            'americanfootball_nfl': '🏈',
            'soccer_uefa_champs_league': '⚽',
            'baseball_mlb': '⚾',
            'icehockey_nhl': '🏒',
        };
        return icons[league] || '🏆';
    };

    const getLeagueName = (league: string) => {
        const names: Record<string, string> = {
            'soccer_epl': 'Premier League',
            'basketball_nba': 'NBA',
            'americanfootball_nfl': 'NFL',
            'soccer_uefa_champs_league': 'Champions League',
            'baseball_mlb': 'MLB',
            'icehockey_nhl': 'NHL',
        };
        return names[league] || league;
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: '#ffffff',
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        display: 'inline-block',
                        width: '50px',
                        height: '50px',
                        border: '5px solid #f3f3f3',
                        borderTop: '5px solid #007bff',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }} />
                    <h2 style={{ marginTop: '20px', color: '#333' }}>Loading...</h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                minHeight: '100vh',
                backgroundColor: '#ffffff',
            }}>
                <h2 style={{ color: '#f44336' }}>{error}</h2>
            </div>
        );
    }

    return (
        <main style={{
            width: '100%',
            minHeight: '100vh',
            backgroundColor: '#ffffff',
            overflowX: 'hidden',
        }}>
            <style>{`
        @media (max-width: 768px) {
          .header-title { font-size: 2rem !important; }
          .header-subtitle { font-size: 1rem !important; }
          .section-title { font-size: 1.5rem !important; }
          .featured-grid { grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)) !important; }
          .games-grid { grid-template-columns: 1fr !important; }
          .odds-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .header-title { font-size: 1.75rem !important; }
          .header-subtitle { font-size: 0.875rem !important; }
          .featured-grid { grid-template-columns: 1fr !important; }
          .section-padding { padding: 1rem !important; }
        }
      `}</style>

            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1rem', width: '100%' }}>
                {/* Header Section */}
                {/*<div style={{*/}
                {/*    textAlign: 'center',*/}
                {/*    marginBottom: '3rem',*/}
                {/*    padding: 'clamp(2rem, 5vw, 3.75rem) 1.25rem',*/}
                {/*    background: 'white',*/}
                {/*    borderRadius: '1.25rem',*/}
                {/*    color: 'white',*/}
                {/*    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',*/}
                {/*    width: '100%',*/}
                {/*}}>*/}
                {/*    <h1 className="header-title" style={{*/}
                {/*        fontSize: 'clamp(2rem, 5vw, 3.5rem)',*/}
                {/*        marginBottom: '1rem',*/}
                {/*        fontWeight: 'bold',*/}
                {/*        textShadow: '2px 2px 4px rgba(0,0,0,0.2)',*/}
                {/*    }}>*/}
                {/*        Mjomba Betting Odds*/}
                {/*    </h1>*/}
                {/*    <p className="header-subtitle" style={{*/}
                {/*        fontSize: 'clamp(0.875rem, 3vw, 1.25rem)',*/}
                {/*        opacity: 0.95,*/}
                {/*        maxWidth: '600px',*/}
                {/*        margin: '0 auto',*/}
                {/*    }}>*/}
                {/*        Live odds from top bookmakers across {sports.length} sports worldwide*/}
                {/*    </p>*/}
                {/*</div>*/}

                {/* Today's Games Section */}
                {!gamesLoading && todaysGames.length > 0 && (
                    <section style={{ marginBottom: '3rem', width: '100%' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '1.5rem',
                            flexWrap: 'wrap',
                            gap: '0.625rem',
                        }}>
                            <h2 className="section-title" style={{
                                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                                fontWeight: 'bold',
                                color: '#333',
                                margin: 0,
                            }}>
                                🔴 Live & Upcoming Today
                            </h2>
                            <span style={{
                                padding: '0.375rem 1rem',
                                backgroundColor: '#f44336',
                                borderRadius: '1.25rem',
                                fontSize: '0.875rem',
                                color: 'white',
                                fontWeight: '600',
                            }}>
                {todaysGames.length} Games
              </span>
                        </div>

                        <div className="games-grid" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
                            gap: '1rem',
                            width: '100%',
                        }}>
                            {todaysGames.map((game, idx) => (
                                <Link
                                    key={idx}
                                    to={`/odds/${game.league}`}
                                    style={{ textDecoration: 'none', width: '100%' }}
                                >
                                    <div style={{
                                        backgroundColor: 'white',
                                        borderRadius: '0.75rem',
                                        border: '1px solid #e0e0e0',
                                        padding: '1rem',
                                        transition: 'all 0.2s',
                                        cursor: 'pointer',
                                        width: '100%',
                                    }}
                                         onMouseEnter={(e) => {
                                             e.currentTarget.style.transform = 'translateY(-4px)';
                                             e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                                         }}
                                         onMouseLeave={(e) => {
                                             e.currentTarget.style.transform = 'translateY(0)';
                                             e.currentTarget.style.boxShadow = 'none';
                                         }}
                                    >
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginBottom: '0.75rem',
                                            flexWrap: 'wrap',
                                            gap: '0.5rem',
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span style={{ fontSize: '1.25rem' }}>{getSportIcon(game.league)}</span>
                                                <span style={{ fontSize: '0.75rem', color: '#666', fontWeight: '600' }}>
                          {getLeagueName(game.league)}
                        </span>
                                            </div>
                                            <span style={{
                                                padding: '0.25rem 0.625rem',
                                                backgroundColor: '#fff3cd',
                                                color: '#856404',
                                                borderRadius: '0.75rem',
                                                fontSize: '0.6875rem',
                                                fontWeight: 'bold',
                                            }}>
                        {getTimeUntilMatch(game.commence_time)}
                      </span>
                                        </div>

                                        <div style={{ marginBottom: '0.75rem' }}>
                                            <div style={{
                                                fontSize: '0.9375rem',
                                                fontWeight: 'bold',
                                                color: '#333',
                                                marginBottom: '0.25rem',
                                            }}>
                                                {game.home_team}
                                            </div>
                                            <div style={{ fontSize: '0.9375rem', fontWeight: 'bold', color: '#333' }}>
                                                {game.away_team}
                                            </div>
                                        </div>

                                        {game.bookmakers[0]?.markets[0] && (
                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: game.bookmakers[0].markets[0].outcomes.length === 2 ? '1fr 1fr' : '1fr 1fr 1fr',
                                                gap: '0.5rem',
                                                paddingTop: '0.75rem',
                                                borderTop: '1px solid #f0f0f0',
                                            }}>
                                                {game.bookmakers[0].markets[0].outcomes.map((outcome: any, i: number) => (
                                                    <div key={i} style={{
                                                        textAlign: 'center',
                                                        padding: '0.5rem',
                                                        backgroundColor: '#f8f9fa',
                                                        borderRadius: '0.375rem',
                                                    }}>
                                                        <div style={{ fontSize: '0.6875rem', color: '#666', marginBottom: '0.125rem' }}>
                                                            {outcome.name}
                                                        </div>
                                                        <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#007bff' }}>
                                                            {outcome.price.toFixed(2)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Best Value Odds Section */}
                {!oddsLoading && bestOdds.length > 0 && (
                    <section style={{ marginBottom: '3rem', width: '100%' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '1.5rem',
                            flexWrap: 'wrap',
                            gap: '0.625rem',
                        }}>
                            <h2 className="section-title" style={{
                                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                                fontWeight: 'bold',
                                color: '#333',
                                margin: 0,
                            }}>
                                💎 Best Value Bets Today
                            </h2>
                            <span style={{
                                padding: '0.375rem 1rem',
                                backgroundColor: '#4caf50',
                                borderRadius: '1.25rem',
                                fontSize: '0.875rem',
                                color: 'white',
                                fontWeight: '600',
                            }}>
                Top Picks
              </span>
                        </div>

                        <div className="odds-grid" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
                            gap: '1rem',
                            width: '100%',
                        }}>
                            {bestOdds.map((game: any, idx) => (
                                <Link
                                    key={idx}
                                    to={`/odds/${game.league}`}
                                    style={{ textDecoration: 'none', width: '100%' }}
                                >
                                    <div style={{
                                        backgroundColor: 'white',
                                        borderRadius: '0.75rem',
                                        border: '2px solid #4caf50',
                                        padding: '1rem',
                                        position: 'relative',
                                        transition: 'all 0.2s',
                                        cursor: 'pointer',
                                        width: '100%',
                                    }}
                                         onMouseEnter={(e) => {
                                             e.currentTarget.style.transform = 'translateY(-4px)';
                                             e.currentTarget.style.boxShadow = '0 8px 16px rgba(76, 175, 80, 0.3)';
                                         }}
                                         onMouseLeave={(e) => {
                                             e.currentTarget.style.transform = 'translateY(0)';
                                             e.currentTarget.style.boxShadow = 'none';
                                         }}
                                    >
                                        <div style={{
                                            position: 'absolute',
                                            top: '-10px',
                                            right: '12px',
                                            backgroundColor: '#4caf50',
                                            color: 'white',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '0.75rem',
                                            fontSize: '0.6875rem',
                                            fontWeight: 'bold',
                                        }}>
                                            VALUE BET
                                        </div>

                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            marginBottom: '0.75rem',
                                        }}>
                                            <span style={{ fontSize: '1.25rem' }}>{getSportIcon(game.league)}</span>
                                            <span style={{ fontSize: '0.75rem', color: '#666', fontWeight: '600' }}>
                        {getLeagueName(game.league)}
                      </span>
                                        </div>

                                        <div style={{ marginBottom: '0.75rem' }}>
                                            <div style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#333' }}>
                                                {game.home_team} vs {game.away_team}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.25rem' }}>
                                                {new Date(game.commence_time).toLocaleString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </div>
                                        </div>

                                        <div style={{
                                            padding: '0.75rem',
                                            backgroundColor: '#f0f7ff',
                                            borderRadius: '0.5rem',
                                            border: '1px solid #d0e7ff',
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.25rem' }}>
                                                        Best Pick
                                                    </div>
                                                    <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#333' }}>
                                                        {game.valueOutcome?.name}
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.25rem' }}>
                                                        Odds
                                                    </div>
                                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#007bff' }}>
                                                        {game.valueOutcome?.bestOdds.toFixed(2)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{
                                                marginTop: '0.5rem',
                                                paddingTop: '0.5rem',
                                                borderTop: '1px solid #d0e7ff',
                                                fontSize: '0.6875rem',
                                                color: '#666',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                            }}>
                                                <span>Avg: {game.valueOutcome?.avgOdds.toFixed(2)}</span>
                                                <span style={{ color: '#4caf50', fontWeight: 'bold' }}>
                          +{game.valueOutcome?.valueScore.toFixed(2)} value
                        </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Featured Sports Section */}
                {featuredSports.length > 0 && (
                    <section style={{ marginBottom: '3rem', width: '100%' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '1.5rem',
                            flexWrap: 'wrap',
                            gap: '0.625rem',
                        }}>
                            <h2 className="section-title" style={{
                                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                                fontWeight: 'bold',
                                color: '#333',
                                margin: 0,
                            }}>
                                ⭐ Featured Sports
                            </h2>
                            <span style={{
                                padding: '0.375rem 1rem',
                                backgroundColor: '#f0f0f0',
                                borderRadius: '1.25rem',
                                fontSize: '0.875rem',
                                color: '#666',
                                fontWeight: '600',
                            }}>
                Most Popular
              </span>
                        </div>

                        <div className="featured-grid" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
                            gap: '1.25rem',
                            width: '100%',
                        }}>
                            {featuredSports.map((sport) => (
                                <SportsCard key={sport.key} sport={sport} size="medium" featured={true} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Divider */}
                <div style={{
                    height: '1px',
                    backgroundColor: '#e0e0e0',
                    marginBottom: '2.5rem',
                    marginTop: '2.5rem',
                    width: '100%',
                }} />

                {/* Other Sports Section */}
                <section style={{ width: '100%' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h2 className="section-title" style={{
                            fontSize: 'clamp(1.5rem, 4vw, 1.75rem)',
                            fontWeight: 'bold',
                            color: '#333',
                            marginBottom: '1.25rem',
                        }}>
                            All Sports
                        </h2>

                        <div style={{
                            display: 'flex',
                            gap: '0.625rem',
                            flexWrap: 'wrap',
                            width: '100%',
                        }}>
                            <button
                                onClick={() => setFilter('all')}
                                style={{
                                    padding: '0.625rem 1.25rem',
                                    backgroundColor: filter === 'all' ? '#007bff' : 'white',
                                    color: filter === 'all' ? 'white' : '#333',
                                    border: `2px solid ${filter === 'all' ? '#007bff' : '#ddd'}`,
                                    borderRadius: '1.25rem',
                                    cursor: 'pointer',
                                    fontWeight: filter === 'all' ? 'bold' : 'normal',
                                    transition: 'all 0.3s',
                                    fontSize: '0.875rem',
                                }}
                            >
                                All ({otherSports.length})
                            </button>
                            {groups.map(group => {
                                const count = sports.filter(s => s.group === group && !featuredSportKeys.includes(s.key)).length;
                                if (count === 0) return null;

                                return (
                                    <button
                                        key={group}
                                        onClick={() => setFilter(group)}
                                        style={{
                                            padding: '0.625rem 1.25rem',
                                            backgroundColor: filter === group ? '#007bff' : 'white',
                                            color: filter === group ? 'white' : '#333',
                                            border: `2px solid ${filter === group ? '#007bff' : '#ddd'}`,
                                            borderRadius: '1.25rem',
                                            cursor: 'pointer',
                                            fontWeight: filter === group ? 'bold' : 'normal',
                                            transition: 'all 0.3s',
                                            fontSize: '0.875rem',
                                            textTransform: 'capitalize',
                                        }}
                                    >
                                        {group} ({count})
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))',
                        gap: '1.25rem',
                        width: '100%',
                    }}>
                        {otherSports.map((sport) => (
                            <SportsCard key={sport.key} sport={sport} size="small" featured={false} />
                        ))}
                    </div>

                    {otherSports.length === 0 && (
                        <div style={{
                            textAlign: 'center',
                            padding: '3.75rem 1.25rem',
                            backgroundColor: 'white',
                            borderRadius: '0.75rem',
                            border: '1px solid #e0e0e0',
                        }}>
                            <p style={{ fontSize: '1.125rem', color: '#666' }}>
                                No sports found in this category
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}