import { Link } from 'react-router-dom';
import type { Sport } from '../types';

interface SportsCardProps {
    sport: Sport;
    size?: 'small' | 'medium' | 'large';
    featured?: boolean;
}

// Sport icon/emoji mapping
const getSportIcon = (sportKey: string): string => {
    const icons: Record<string, string> = {
        'americanfootball_nfl': '🏈', 'americanfootball_ncaaf': '🏈',
        'soccer_epl': '⚽', 'soccer_spain_la_liga': '⚽', 'soccer_germany_bundesliga': '⚽',
        'soccer_italy_serie_a': '⚽', 'soccer_france_ligue_one': '⚽', 'soccer_uefa_champs_league': '⚽',
        'soccer_uefa_europa_league': '⚽', 'soccer_usa_mls': '⚽', 'soccer_brazil_campeonato': '⚽',
        'soccer_mexico_ligamx': '⚽',
        'basketball_nba': '🏀', 'basketball_ncaab': '🏀', 'basketball_euroleague': '🏀', 'basketball_wnba': '🏀',
        'baseball_mlb': '⚾',
        'icehockey_nhl': '🏒',
        'tennis_atp_french_open': '🎾', 'tennis_atp_us_open': '🎾', 'tennis_atp_wimbledon': '🎾',
        'tennis_atp_australian_open': '🎾', 'tennis_wta_french_open': '🎾', 'tennis_wta_us_open': '🎾',
        'tennis_wta_wimbledon': '🎾', 'tennis_wta_australian_open': '🎾',
        'golf_pga_championship': '⛳', 'golf_masters_tournament': '⛳', 'golf_us_open': '⛳',
        'golf_the_open_championship': '⛳',
        'mma_mixed_martial_arts': '🥊', 'boxing_heavyweight': '🥊',
        'cricket_test_match': '🏏', 'cricket_odi': '🏏', 'cricket_t20': '🏏', 'cricket_ipl': '🏏',
        'rugbyleague_nrl': '🏉', 'rugbyunion_super_rugby': '🏉', 'rugbyunion_six_nations': '🏉',
        'aussierules_afl': '🏈',
        'motorsport_f1': '🏎️',
    };
    return icons[sportKey] || '🏆';
};

// Background gradient based on sport group
const getBackgroundGradient = (group: string): string => {
    const gradients: Record<string, string> = {
        'American Football': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'Soccer': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'Basketball': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'Baseball': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'Ice Hockey': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'Tennis': 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
        'Golf': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'MMA': 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)',
        'Cricket': 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        'Rugby': 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
        'Aussie Rules': 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
        'default': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    };
    return gradients[group] || gradients['default'];
};

export default function SportsCard({ sport, size = 'small', featured = false }: SportsCardProps) {
    const icon = getSportIcon(sport.key);
    const gradient = getBackgroundGradient(sport.group);

    // Size configurations
    const sizeConfig = {
        small: {
            iconSize: '48px',
            headerPadding: '24px 16px',
            headerHeight: '120px',
            titleSize: '16px',
            contentPadding: '16px',
            descMinHeight: '36px',
            descFontSize: '12px',
            statusPadding: '6px 10px',
            statusFontSize: '11px',
            groupFontSize: '11px',
        },
        medium: {
            iconSize: '64px',
            headerPadding: '32px 20px',
            headerHeight: '150px',
            titleSize: '19px',
            contentPadding: '20px',
            descMinHeight: '42px',
            descFontSize: '13px',
            statusPadding: '7px 12px',
            statusFontSize: '12px',
            groupFontSize: '12px',
        },
        large: {
            iconSize: '80px',
            headerPadding: '40px 24px',
            headerHeight: '180px',
            titleSize: '22px',
            contentPadding: '24px',
            descMinHeight: '48px',
            descFontSize: '14px',
            statusPadding: '8px 14px',
            statusFontSize: '13px',
            groupFontSize: '13px',
        },
    };

    const config = sizeConfig[size];

    return (
        <Link to={`/odds/${sport.key}`} style={{ textDecoration: 'none' }}>
            <div
                style={{
                    width: '100%',
                    borderRadius: size === 'large' ? '20px' : size === 'medium' ? '16px' : '12px',
                    overflow: 'hidden',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    boxShadow: featured
                        ? '0 8px 16px rgba(0,0,0,0.15)'
                        : '0 4px 6px rgba(0,0,0,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    border: featured ? '2px solid #ffd700' : 'none',
                    position: 'relative',
                }}
                onMouseEnter={(e) => {
                    const lift = size === 'large' ? '-10px' : size === 'medium' ? '-8px' : '-6px';
                    e.currentTarget.style.transform = `translateY(${lift})`;
                    e.currentTarget.style.boxShadow = size === 'large'
                        ? '0 16px 32px rgba(0,0,0,0.2)'
                        : size === 'medium'
                            ? '0 12px 24px rgba(0,0,0,0.18)'
                            : '0 10px 20px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = featured
                        ? '0 8px 16px rgba(0,0,0,0.15)'
                        : '0 4px 6px rgba(0,0,0,0.1)';
                }}
            >
                {/* Featured Badge */}
                {featured && (
                    <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        backgroundColor: '#ffd700',
                        color: '#333',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        zIndex: 10,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}>
                        ⭐ FEATURED
                    </div>
                )}

                {/* Header with gradient background and icon */}
                <div
                    style={{
                        background: gradient,
                        padding: config.headerPadding,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        minHeight: config.headerHeight,
                    }}
                >
                    <div style={{
                        fontSize: config.iconSize,
                        marginBottom: size === 'large' ? '12px' : size === 'medium' ? '10px' : '6px',
                        filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))',
                    }}>
                        {icon}
                    </div>
                    <h3 style={{
                        color: 'white',
                        fontSize: config.titleSize,
                        textAlign: 'center',
                        fontWeight: 'bold',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                        margin: 0,
                        lineHeight: 1.3,
                    }}>
                        {sport.title}
                    </h3>
                </div>

                {/* Content */}
                <div style={{ padding: config.contentPadding }}>
                    <p style={{
                        fontSize: config.descFontSize,
                        color: '#666',
                        marginBottom: size === 'large' ? '16px' : size === 'medium' ? '14px' : '12px',
                        minHeight: config.descMinHeight,
                        lineHeight: '1.4',
                    }}>
                        {sport.description}
                    </p>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: size === 'large' ? '16px' : size === 'medium' ? '14px' : '12px',
                        borderTop: '1px solid #f0f0f0',
                    }}>
            <span
                style={{
                    display: 'inline-block',
                    padding: config.statusPadding,
                    backgroundColor: sport.active ? '#4caf50' : '#f44336',
                    color: 'white',
                    borderRadius: '20px',
                    fontSize: config.statusFontSize,
                    fontWeight: 'bold',
                }}
            >
              {sport.active ? '● Active' : '● Inactive'}
            </span>

                        <span style={{
                            fontSize: config.groupFontSize,
                            color: '#999',
                            textTransform: 'uppercase',
                            fontWeight: '600',
                        }}>
              {sport.group}
            </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}