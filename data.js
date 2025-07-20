// FIFA World Cup 2026 Data
const CONFEDERATIONS = {
    AFC: { name: 'AFC', fullName: 'Asian Football Confederation', color: '#FF6B35', maxPerGroup: 1, logo: '🌏' },
    CAF: { name: 'CAF', fullName: 'Confederation of African Football', color: '#F4D03F', maxPerGroup: 1, logo: '🌍' },
    CONCACAF: { name: 'CONCACAF', fullName: 'North American Football Confederation', color: '#85C1E9', maxPerGroup: 1, logo: '🌎' },
    CONMEBOL: { name: 'CONMEBOL', fullName: 'South American Football Confederation', color: '#82E0AA', maxPerGroup: 1, logo: '🌎' },
    OFC: { name: 'OFC', fullName: 'Oceania Football Confederation', color: '#D7BDE2', maxPerGroup: 1, logo: '🌊' },
    UEFA: { name: 'UEFA', fullName: 'Union of European Football Associations', color: '#F8C471', maxPerGroup: 2, logo: '🇪🇺' }
};

// Direct Qualified Teams (42 total based on realistic scenario)
const QUALIFIED_TEAMS = [
    // CONCACAF Hosts + Direct Qualifiers (6 total)
    { name: 'Canada', confederation: 'CONCACAF', points: 1548.94, qualified: true, host: true, flag: '🇨🇦' },
    { name: 'Mexico', confederation: 'CONCACAF', points: 1689.73, qualified: true, host: true, flag: '🇲🇽' },
    { name: 'United States', confederation: 'CONCACAF', points: 1671.04, qualified: true, host: true, flag: '🇺🇸' },
    { name: 'Costa Rica', confederation: 'CONCACAF', points: 1493.85, qualified: true, flag: '🇨🇷' },
    { name: 'Jamaica', confederation: 'CONCACAF', points: 1362.97, qualified: true, flag: '🇯🇲' },
    { name: 'Panama', confederation: 'CONCACAF', points: 1545.08, qualified: true, flag: '🇵🇦' },
    
    // AFC Direct Qualifiers (8 total)
    { name: 'Iran', confederation: 'AFC', points: 1624.30, qualified: true, flag: '🇮🇷' },
    { name: 'Japan', confederation: 'AFC', points: 1641.23, qualified: true, flag: '🇯🇵' },
    { name: 'South Korea', confederation: 'AFC', points: 1587.08, qualified: true, flag: '🇰🇷' },
    { name: 'Australia', confederation: 'AFC', points: 1578.57, qualified: true, flag: '🇦🇺' },
    { name: 'Jordan', confederation: 'AFC', points: 1387.79, qualified: true, flag: '🇯🇴' },
    { name: 'Uzbekistan', confederation: 'AFC', points: 1449.12, qualified: true, flag: '🇺🇿' },
    { name: 'Qatar', confederation: 'AFC', points: 1459.85, qualified: true, flag: '🇶🇦' },
    { name: 'Saudi Arabia', confederation: 'AFC', points: 1415.11, qualified: true, flag: '🇸🇦' },
    
    // CAF Direct Qualifiers (9 total)
    { name: 'Egypt', confederation: 'CAF', points: 1518.79, qualified: true, flag: '🇪🇬' },
    { name: 'DR Congo', confederation: 'CAF', points: 1412.10, qualified: true, flag: '🇨🇩' },
    { name: 'South Africa', confederation: 'CAF', points: 1443.31, qualified: true, flag: '🇿🇦' },
    { name: 'Cape Verde', confederation: 'CAF', points: 1343.68, qualified: true, flag: '🇨🇻' },
    { name: 'Morocco', confederation: 'CAF', points: 1698.72, qualified: true, flag: '🇲🇦' },
    { name: 'Ivory Coast', confederation: 'CAF', points: 1483.45, qualified: true, flag: '🇨🇮' },
    { name: 'Algeria', confederation: 'CAF', points: 1503.80, qualified: true, flag: '🇩🇿' },
    { name: 'Tunisia', confederation: 'CAF', points: 1471.10, qualified: true, flag: '🇹🇳' },
    { name: 'Ghana', confederation: 'CAF', points: 1333.37, qualified: true, flag: '🇬🇭' },
    
    // CONMEBOL Direct Qualifiers (6 total)
    { name: 'Argentina', confederation: 'CONMEBOL', points: 1885.36, qualified: true, flag: '🇦🇷' },
    { name: 'Ecuador', confederation: 'CONMEBOL', points: 1570.68, qualified: true, flag: '🇪🇨' },
    { name: 'Brazil', confederation: 'CONMEBOL', points: 1777.69, qualified: true, flag: '🇧🇷' },
    { name: 'Uruguay', confederation: 'CONMEBOL', points: 1670.76, qualified: true, flag: '🇺🇾' },
    { name: 'Paraguay', confederation: 'CONMEBOL', points: 1486.69, qualified: true, flag: '🇵🇾' },
    { name: 'Colombia', confederation: 'CONMEBOL', points: 1679.46, qualified: true, flag: '🇨🇴' },
    
    // OFC Direct Qualifiers (1 total)
    { name: 'New Zealand', confederation: 'OFC', points: 1288.86, qualified: true, flag: '🇳🇿' },
    
    // UEFA Direct Qualifiers (12 total) - Final realistic scenario
    { name: 'Spain', confederation: 'UEFA', points: 1867.09, qualified: true, flag: '🇪🇸' },
    { name: 'France', confederation: 'UEFA', points: 1862.03, qualified: true, flag: '🇫🇷' },
    { name: 'England', confederation: 'UEFA', points: 1813.32, qualified: true, flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    { name: 'Portugal', confederation: 'UEFA', points: 1770.53, qualified: true, flag: '🇵🇹' },
    { name: 'Netherlands', confederation: 'UEFA', points: 1758.18, qualified: true, flag: '🇳🇱' },
    { name: 'Belgium', confederation: 'UEFA', points: 1736.38, qualified: true, flag: '🇧🇪' },
    { name: 'Germany', confederation: 'UEFA', points: 1716.98, qualified: true, flag: '🇩🇪' },
    { name: 'Croatia', confederation: 'UEFA', points: 1707.51, qualified: true, flag: '🇭🇷' },
    { name: 'Switzerland', confederation: 'UEFA', points: 1635.08, qualified: true, flag: '🇨🇭' },
    { name: 'Denmark', confederation: 'UEFA', points: 1621.24, qualified: true, flag: '🇩🇰' },
    { name: 'Norway', confederation: 'UEFA', points: 1519.42, qualified: true, flag: '🇳🇴' },
    { name: 'Czechia', confederation: 'UEFA', points: 1492.40, qualified: true, flag: '🇨🇿' }
];

// Additional qualifiers that complete the 42-team base (42 + 6 playoff winners = 48 total)
const PROJECTED_QUALIFIERS = [];

// All team data for reference
const ALL_TEAMS_DATA = [
    { name: 'Argentina', confederation: 'CONMEBOL', points: 1885.36, flag: '🇦🇷' },
    { name: 'Spain', confederation: 'UEFA', points: 1867.09, flag: '🇪🇸' },
    { name: 'France', confederation: 'UEFA', points: 1862.03, flag: '🇫🇷' },
    { name: 'England', confederation: 'UEFA', points: 1813.32, flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    { name: 'Brazil', confederation: 'CONMEBOL', points: 1777.69, flag: '🇧🇷' },
    { name: 'Portugal', confederation: 'UEFA', points: 1770.53, flag: '🇵🇹' },
    { name: 'Netherlands', confederation: 'UEFA', points: 1758.18, flag: '🇳🇱' },
    { name: 'Belgium', confederation: 'UEFA', points: 1736.38, flag: '🇧🇪' },
    { name: 'Germany', confederation: 'UEFA', points: 1716.98, flag: '🇩🇪' },
    { name: 'Croatia', confederation: 'UEFA', points: 1707.51, flag: '🇭🇷' },
    { name: 'Italy', confederation: 'UEFA', points: 1702.58, flag: '🇮🇹' },
    { name: 'Morocco', confederation: 'CAF', points: 1698.72, flag: '🇲🇦' },
    { name: 'Mexico', confederation: 'CONCACAF', points: 1689.73, flag: '🇲🇽' },
    { name: 'Colombia', confederation: 'CONMEBOL', points: 1679.46, flag: '🇨🇴' },
    { name: 'United States', confederation: 'CONCACAF', points: 1671.04, flag: '🇺🇸' },
    { name: 'Uruguay', confederation: 'CONMEBOL', points: 1670.76, flag: '🇺🇾' },
    { name: 'Japan', confederation: 'AFC', points: 1641.23, flag: '🇯🇵' },
    { name: 'Senegal', confederation: 'CAF', points: 1635.10, flag: '🇸🇳' },
    { name: 'Switzerland', confederation: 'UEFA', points: 1635.08, flag: '🇨🇭' },
    { name: 'Iran', confederation: 'AFC', points: 1624.30, flag: '🇮🇷' },
    { name: 'Denmark', confederation: 'UEFA', points: 1621.24, flag: '🇩🇰' },
    { name: 'Austria', confederation: 'UEFA', points: 1591.24, flag: '🇦🇹' },
    { name: 'South Korea', confederation: 'AFC', points: 1587.08, flag: '🇰🇷' },
    { name: 'Australia', confederation: 'AFC', points: 1578.57, flag: '🇦🇺' },
    { name: 'Ecuador', confederation: 'CONMEBOL', points: 1570.68, flag: '🇪🇨' },
    { name: 'Ukraine', confederation: 'UEFA', points: 1557.21, flag: '🇺🇦' },
    { name: 'Turkey', confederation: 'UEFA', points: 1553.19, flag: '🇹🇷' },
    { name: 'Canada', confederation: 'CONCACAF', points: 1548.94, flag: '🇨🇦' },
    { name: 'Sweden', confederation: 'UEFA', points: 1545.43, flag: '🇸🇪' },
    { name: 'Panama', confederation: 'CONCACAF', points: 1545.08, flag: '🇵🇦' },
    { name: 'Wales', confederation: 'UEFA', points: 1528.93, flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
    { name: 'Serbia', confederation: 'UEFA', points: 1523.03, flag: '🇷🇸' },
    { name: 'Norway', confederation: 'UEFA', points: 1519.42, flag: '🇳🇴' },
    { name: 'Egypt', confederation: 'CAF', points: 1518.79, flag: '🇪🇬' },
    { name: 'Algeria', confederation: 'CAF', points: 1503.80, flag: '🇩🇿' },
    { name: 'Poland', confederation: 'UEFA', points: 1502.40, flag: '🇵🇱' },
    { name: 'Hungary', confederation: 'UEFA', points: 1500.74, flag: '🇭🇺' },
    { name: 'Greece', confederation: 'UEFA', points: 1497.82, flag: '🇬🇷' },
    { name: 'Costa Rica', confederation: 'CONCACAF', points: 1493.85, flag: '🇨🇷' },
    { name: 'Czechia', confederation: 'UEFA', points: 1492.40, flag: '🇨🇿' },
    { name: 'Peru', confederation: 'CONMEBOL', points: 1489.97, flag: '🇵🇪' },
    { name: 'Paraguay', confederation: 'CONMEBOL', points: 1486.69, flag: '🇵🇾' },
    { name: 'Nigeria', confederation: 'CAF', points: 1484.26, flag: '🇳🇬' },
    { name: 'Ivory Coast', confederation: 'CAF', points: 1483.45, flag: '🇨🇮' },
    { name: 'Venezuela', confederation: 'CONMEBOL', points: 1477.02, flag: '🇻🇪' },
    { name: 'Scotland', confederation: 'UEFA', points: 1474.68, flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
    { name: 'Romania', confederation: 'UEFA', points: 1474.46, flag: '🇷🇴' },
    { name: 'Tunisia', confederation: 'CAF', points: 1471.10, flag: '🇹🇳' },
    { name: 'Slovenia', confederation: 'UEFA', points: 1469.76, flag: '🇸🇮' },
    { name: 'Cameroon', confederation: 'CAF', points: 1466.97, flag: '🇨🇲' },
    { name: 'Slovakia', confederation: 'UEFA', points: 1466.56, flag: '🇸🇰' },
    { name: 'Qatar', confederation: 'AFC', points: 1459.85, flag: '🇶🇦' },
    { name: 'Mali', confederation: 'CAF', points: 1454.72, flag: '🇲🇱' },
    { name: 'Uzbekistan', confederation: 'AFC', points: 1449.12, flag: '🇺🇿' },
    { name: 'South Africa', confederation: 'CAF', points: 1443.31, flag: '🇿🇦' },
    { name: 'Chile', confederation: 'CONMEBOL', points: 1441.62, flag: '🇨🇱' },
    { name: 'Iraq', confederation: 'AFC', points: 1417.04, flag: '🇮🇶' },
    { name: 'Saudi Arabia', confederation: 'AFC', points: 1415.11, flag: '🇸🇦' },
    { name: 'Republic of Ireland', confederation: 'UEFA', points: 1412.76, flag: '🇮🇪' },
    { name: 'DR Congo', confederation: 'CAF', points: 1412.10, flag: '🇨🇩' },
    { name: 'North Macedonia', confederation: 'UEFA', points: 1390.79, flag: '🇲🇰' },
    { name: 'Burkina Faso', confederation: 'CAF', points: 1388.03, flag: '🇧🇫' },
    { name: 'Jordan', confederation: 'AFC', points: 1387.79, flag: '🇯🇴' },
    { name: 'UAE', confederation: 'AFC', points: 1379.86, flag: '🇦🇪' },
    { name: 'Honduras', confederation: 'CONCACAF', points: 1379.84, flag: '🇭🇳' },
    { name: 'Georgia', confederation: 'UEFA', points: 1375.23, flag: '🇬🇪' },
    { name: 'Albania', confederation: 'UEFA', points: 1373.15, flag: '🇦🇱' },
    { name: 'Finland', confederation: 'UEFA', points: 1371.55, flag: '🇫🇮' },
    { name: 'Jamaica', confederation: 'CONCACAF', points: 1362.97, flag: '🇯🇲' },
    { name: 'Northern Ireland', confederation: 'UEFA', points: 1351.01, flag: '🇬🇧' },
    { name: 'Bosnia and Herzegovina', confederation: 'UEFA', points: 1349.11, flag: '🇧🇦' },
    { name: 'Cape Verde', confederation: 'CAF', points: 1343.68, flag: '🇨🇻' },
    { name: 'Iceland', confederation: 'UEFA', points: 1337.92, flag: '🇮🇸' },
    { name: 'Israel', confederation: 'UEFA', points: 1336.52, flag: '🇮🇱' },
    { name: 'Ghana', confederation: 'CAF', points: 1333.37, flag: '🇬🇭' },
    { name: 'Montenegro', confederation: 'UEFA', points: 1327.28, flag: '🇲🇪' },
    { name: 'Bolivia', confederation: 'CONMEBOL', points: 1315.71, flag: '🇧🇴' },
    { name: 'Oman', confederation: 'AFC', points: 1314.41, flag: '🇴🇲' },
    { name: 'Gabon', confederation: 'CAF', points: 1306.60, flag: '🇬🇦' },
    { name: 'Guinea', confederation: 'CAF', points: 1292.63, flag: '🇬🇳' },
    { name: 'New Zealand', confederation: 'OFC', points: 1288.86, flag: '🇳🇿' }
];

// UEFA Playoff Teams (16 teams: 12 group runners-up + 4 Nations League teams)
// Based on actual current UEFA qualification standings with major surprises!
const UEFA_PLAYOFF_TEAMS = [
    // Exact 16 teams from final realistic qualification scenario
    { name: 'Italy', confederation: 'UEFA', points: 1702.58, flag: '🇮🇹', playoffStatus: 'Nations League backup' },
    { name: 'Austria', confederation: 'UEFA', points: 1591.24, flag: '🇦🇹', playoffStatus: 'Group runner-up' },
    { name: 'Ukraine', confederation: 'UEFA', points: 1557.21, flag: '🇺🇦', playoffStatus: 'Group runner-up' },
    { name: 'Turkey', confederation: 'UEFA', points: 1553.19, flag: '🇹🇷', playoffStatus: 'Group runner-up' },
    { name: 'Sweden', confederation: 'UEFA', points: 1545.43, flag: '🇸🇪', playoffStatus: 'Group runner-up' },
    { name: 'Wales', confederation: 'UEFA', points: 1528.93, flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', playoffStatus: 'Group runner-up' },
    { name: 'Serbia', confederation: 'UEFA', points: 1523.03, flag: '🇷🇸', playoffStatus: 'Group runner-up' },
    { name: 'Poland', confederation: 'UEFA', points: 1502.40, flag: '🇵🇱', playoffStatus: 'Nations League backup' },
    { name: 'Hungary', confederation: 'UEFA', points: 1500.74, flag: '🇭🇺', playoffStatus: 'Group runner-up' },
    { name: 'Greece', confederation: 'UEFA', points: 1497.82, flag: '🇬🇷', playoffStatus: 'Group runner-up' },
    { name: 'Scotland', confederation: 'UEFA', points: 1474.68, flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', playoffStatus: 'Nations League backup' },
    { name: 'Romania', confederation: 'UEFA', points: 1474.46, flag: '🇷🇴', playoffStatus: 'Nations League backup' },
    { name: 'Slovenia', confederation: 'UEFA', points: 1469.76, flag: '🇸🇮', playoffStatus: 'Nations League backup' },
    { name: 'Slovakia', confederation: 'UEFA', points: 1466.56, flag: '🇸🇰', playoffStatus: 'Group runner-up' },
    { name: 'Albania', confederation: 'UEFA', points: 1373.15, flag: '🇦🇱', playoffStatus: 'Group runner-up' },
    { name: 'Israel', confederation: 'UEFA', points: 1336.52, flag: '🇮🇱', playoffStatus: 'Group runner-up' }
];

// Inter-confederation Playoff Teams (exact 6 teams from corrected realistic scenario)
const INTERCONTINENTAL_PLAYOFF_TEAMS = [
    { name: 'Senegal', confederation: 'CAF', points: 1635.10, flag: '🇸🇳', playoffSlot: 'CAF playoff winner' },
    { name: 'Venezuela', confederation: 'CONMEBOL', points: 1477.02, flag: '🇻🇪', playoffSlot: 'CONMEBOL 7th place' },
    { name: 'UAE', confederation: 'AFC', points: 1379.86, flag: '🇦🇪', playoffSlot: 'AFC playoff winner' },
    { name: 'Honduras', confederation: 'CONCACAF', points: 1379.84, flag: '🇭🇳', playoffSlot: 'CONCACAF playoff' },
    { name: 'Curaçao', confederation: 'CONCACAF', points: 1277.26, flag: '🇨🇼', playoffSlot: 'CONCACAF playoff' },
    { name: 'New Caledonia', confederation: 'OFC', points: 1100.00, flag: '🇳🇨', playoffSlot: 'OFC runner-up' }
];

// Placeholder for playoff winners (will be replaced by simulation results)
const PLAYOFF_TEAMS = [
    { name: 'UEFA Playoff Winner 1', confederation: 'UEFA', points: 'TBD', qualified: false, placeholder: true, flag: '🇪🇺', description: 'From Path A/B/C/D' },
    { name: 'UEFA Playoff Winner 2', confederation: 'UEFA', points: 'TBD', qualified: false, placeholder: true, flag: '🇪🇺', description: 'From Path A/B/C/D' },
    { name: 'UEFA Playoff Winner 3', confederation: 'UEFA', points: 'TBD', qualified: false, placeholder: true, flag: '🇪🇺', description: 'From Path A/B/C/D' },
    { name: 'UEFA Playoff Winner 4', confederation: 'UEFA', points: 'TBD', qualified: false, placeholder: true, flag: '🇪🇺', description: 'From Path A/B/C/D' },
    { name: 'Inter-confederation Winner 1', confederation: 'PLAYOFF', points: 'TBD', qualified: false, placeholder: true, flag: '🌍', description: 'From 6-team playoff' },
    { name: 'Inter-confederation Winner 2', confederation: 'PLAYOFF', points: 'TBD', qualified: false, placeholder: true, flag: '🌍', description: 'From 6-team playoff' }
];

// Match venues and schedule data
const VENUES = {
    'Estadio Azteca': { city: 'Mexico City', country: 'Mexico' },
    'Estadio Akron': { city: 'Zapopan', country: 'Mexico' },
    'Estadio BBVA': { city: 'Guadalupe', country: 'Mexico' },
    'BMO Field': { city: 'Toronto', country: 'Canada' },
    'BC Place': { city: 'Vancouver', country: 'Canada' },
    'SoFi Stadium': { city: 'Inglewood', country: 'USA' },
    'Levi\'s Stadium': { city: 'Santa Clara', country: 'USA' },
    'Lumen Field': { city: 'Seattle', country: 'USA' },
    'MetLife Stadium': { city: 'East Rutherford', country: 'USA' },
    'Gillette Stadium': { city: 'Foxborough', country: 'USA' },
    'Lincoln Financial Field': { city: 'Philadelphia', country: 'USA' },
    'Hard Rock Stadium': { city: 'Miami Gardens', country: 'USA' },
    'Mercedes-Benz Stadium': { city: 'Atlanta', country: 'USA' },
    'NRG Stadium': { city: 'Houston', country: 'USA' },
    'Arrowhead Stadium': { city: 'Kansas City', country: 'USA' },
    'AT&T Stadium': { city: 'Arlington', country: 'USA' }
};

const GROUP_MATCHES = {
    'A': [
        { date: 'June 11, 2026', match: 1, team1: 'Mexico', team2: 'A2', venue: 'Estadio Azteca' },
        { date: 'June 11, 2026', match: 2, team1: 'A3', team2: 'A4', venue: 'Estadio Akron' },
        { date: 'June 18, 2026', match: 25, team1: 'A4', team2: 'A2', venue: 'Mercedes-Benz Stadium' },
        { date: 'June 18, 2026', match: 28, team1: 'Mexico', team2: 'A3', venue: 'Estadio Akron' },
        { date: 'June 24, 2026', match: 53, team1: 'A4', team2: 'Mexico', venue: 'Estadio Azteca' },
        { date: 'June 24, 2026', match: 54, team1: 'A2', team2: 'A3', venue: 'Estadio BBVA' }
    ],
    'B': [
        { date: 'June 12, 2026', match: 3, team1: 'Canada', team2: 'B2', venue: 'BMO Field' },
        { date: 'June 13, 2026', match: 8, team1: 'B3', team2: 'B4', venue: 'Levi\'s Stadium' },
        { date: 'June 18, 2026', match: 26, team1: 'B4', team2: 'B2', venue: 'SoFi Stadium' },
        { date: 'June 18, 2026', match: 27, team1: 'Canada', team2: 'B3', venue: 'BC Place' },
        { date: 'June 24, 2026', match: 51, team1: 'B4', team2: 'Canada', venue: 'BC Place' },
        { date: 'June 24, 2026', match: 52, team1: 'B2', team2: 'B3', venue: 'Lumen Field' }
    ],
    'C': [
        { date: 'June 13, 2026', match: 5, team1: 'C1', team2: 'C2', venue: 'Gillette Stadium' },
        { date: 'June 13, 2026', match: 7, team1: 'C3', team2: 'C4', venue: 'MetLife Stadium' },
        { date: 'June 19, 2026', match: 29, team1: 'C4', team2: 'C2', venue: 'Lincoln Financial Field' },
        { date: 'June 19, 2026', match: 30, team1: 'C1', team2: 'C3', venue: 'Gillette Stadium' },
        { date: 'June 24, 2026', match: 49, team1: 'C4', team2: 'C1', venue: 'Hard Rock Stadium' },
        { date: 'June 24, 2026', match: 50, team1: 'C2', team2: 'C3', venue: 'Mercedes-Benz Stadium' }
    ],
    'D': [
        { date: 'June 12, 2026', match: 4, team1: 'United States', team2: 'D2', venue: 'SoFi Stadium' },
        { date: 'June 13, 2026', match: 6, team1: 'D3', team2: 'D4', venue: 'BC Place' },
        { date: 'June 19, 2026', match: 31, team1: 'D4', team2: 'D2', venue: 'Levi\'s Stadium' },
        { date: 'June 19, 2026', match: 32, team1: 'United States', team2: 'D3', venue: 'Lumen Field' },
        { date: 'June 25, 2026', match: 59, team1: 'D4', team2: 'United States', venue: 'SoFi Stadium' },
        { date: 'June 25, 2026', match: 60, team1: 'D2', team2: 'D3', venue: 'Levi\'s Stadium' }
    ],
    'E': [
        { date: 'June 14, 2026', match: 9, team1: 'E1', team2: 'E2', venue: 'Lincoln Financial Field' },
        { date: 'June 14, 2026', match: 10, team1: 'E3', team2: 'E4', venue: 'NRG Stadium' },
        { date: 'June 20, 2026', match: 33, team1: 'E4', team2: 'E2', venue: 'BMO Field' },
        { date: 'June 20, 2026', match: 34, team1: 'E1', team2: 'E3', venue: 'Arrowhead Stadium' },
        { date: 'June 25, 2026', match: 55, team1: 'E4', team2: 'E1', venue: 'Lincoln Financial Field' },
        { date: 'June 25, 2026', match: 56, team1: 'E2', team2: 'E3', venue: 'MetLife Stadium' }
    ],
    'F': [
        { date: 'June 14, 2026', match: 11, team1: 'F1', team2: 'F2', venue: 'AT&T Stadium' },
        { date: 'June 14, 2026', match: 12, team1: 'F3', team2: 'F4', venue: 'Estadio BBVA' },
        { date: 'June 20, 2026', match: 35, team1: 'F4', team2: 'F2', venue: 'NRG Stadium' },
        { date: 'June 20, 2026', match: 36, team1: 'F1', team2: 'F3', venue: 'Estadio BBVA' },
        { date: 'June 25, 2026', match: 57, team1: 'F4', team2: 'F1', venue: 'AT&T Stadium' },
        { date: 'June 25, 2026', match: 58, team1: 'F2', team2: 'F3', venue: 'Arrowhead Stadium' }
    ],
    'G': [
        { date: 'June 15, 2026', match: 15, team1: 'G1', team2: 'G2', venue: 'SoFi Stadium' },
        { date: 'June 15, 2026', match: 16, team1: 'G3', team2: 'G4', venue: 'Lumen Field' },
        { date: 'June 21, 2026', match: 39, team1: 'G4', team2: 'G2', venue: 'SoFi Stadium' },
        { date: 'June 21, 2026', match: 40, team1: 'G1', team2: 'G3', venue: 'BC Place' },
        { date: 'June 26, 2026', match: 63, team1: 'G4', team2: 'G1', venue: 'Lumen Field' },
        { date: 'June 26, 2026', match: 64, team1: 'G2', team2: 'G3', venue: 'BC Place' }
    ],
    'H': [
        { date: 'June 15, 2026', match: 13, team1: 'H1', team2: 'H2', venue: 'Hard Rock Stadium' },
        { date: 'June 15, 2026', match: 14, team1: 'H3', team2: 'H4', venue: 'Mercedes-Benz Stadium' },
        { date: 'June 21, 2026', match: 37, team1: 'H4', team2: 'H2', venue: 'Hard Rock Stadium' },
        { date: 'June 21, 2026', match: 38, team1: 'H1', team2: 'H3', venue: 'Mercedes-Benz Stadium' },
        { date: 'June 26, 2026', match: 65, team1: 'H4', team2: 'H1', venue: 'NRG Stadium' },
        { date: 'June 26, 2026', match: 66, team1: 'H2', team2: 'H3', venue: 'Estadio Akron' }
    ],
    'I': [
        { date: 'June 16, 2026', match: 17, team1: 'I1', team2: 'I2', venue: 'MetLife Stadium' },
        { date: 'June 16, 2026', match: 18, team1: 'I3', team2: 'I4', venue: 'Gillette Stadium' },
        { date: 'June 22, 2026', match: 41, team1: 'I4', team2: 'I2', venue: 'MetLife Stadium' },
        { date: 'June 22, 2026', match: 42, team1: 'I1', team2: 'I3', venue: 'Lincoln Financial Field' },
        { date: 'June 26, 2026', match: 61, team1: 'I4', team2: 'I1', venue: 'Gillette Stadium' },
        { date: 'June 26, 2026', match: 62, team1: 'I2', team2: 'I3', venue: 'BMO Field' }
    ],
    'J': [
        { date: 'June 16, 2026', match: 19, team1: 'J1', team2: 'J2', venue: 'Arrowhead Stadium' },
        { date: 'June 16, 2026', match: 20, team1: 'J3', team2: 'J4', venue: 'Levi\'s Stadium' },
        { date: 'June 22, 2026', match: 43, team1: 'J4', team2: 'J2', venue: 'AT&T Stadium' },
        { date: 'June 22, 2026', match: 44, team1: 'J1', team2: 'J3', venue: 'Levi\'s Stadium' },
        { date: 'June 27, 2026', match: 69, team1: 'J4', team2: 'J1', venue: 'Arrowhead Stadium' },
        { date: 'June 27, 2026', match: 70, team1: 'J2', team2: 'J3', venue: 'AT&T Stadium' }
    ],
    'K': [
        { date: 'June 17, 2026', match: 23, team1: 'K1', team2: 'K2', venue: 'NRG Stadium' },
        { date: 'June 17, 2026', match: 24, team1: 'K3', team2: 'K4', venue: 'Estadio Azteca' },
        { date: 'June 23, 2026', match: 47, team1: 'K4', team2: 'K2', venue: 'NRG Stadium' },
        { date: 'June 23, 2026', match: 48, team1: 'K1', team2: 'K3', venue: 'Estadio Akron' },
        { date: 'June 27, 2026', match: 71, team1: 'K4', team2: 'K1', venue: 'Hard Rock Stadium' },
        { date: 'June 27, 2026', match: 72, team1: 'K2', team2: 'K3', venue: 'Mercedes-Benz Stadium' }
    ],
    'L': [
        { date: 'June 17, 2026', match: 21, team1: 'L1', team2: 'L2', venue: 'BMO Field' },
        { date: 'June 17, 2026', match: 22, team1: 'L3', team2: 'L4', venue: 'AT&T Stadium' },
        { date: 'June 23, 2026', match: 45, team1: 'L4', team2: 'L2', venue: 'Gillette Stadium' },
        { date: 'June 23, 2026', match: 46, team1: 'L1', team2: 'L3', venue: 'BMO Field' },
        { date: 'June 27, 2026', match: 67, team1: 'L4', team2: 'L1', venue: 'MetLife Stadium' },
        { date: 'June 27, 2026', match: 68, team1: 'L2', team2: 'L3', venue: 'Lincoln Financial Field' }
    ]
};