// GOAL ZONE — Live Football Scores App
// Data Source: Free World Cup 2026 API (worldcup26.ir)

const API_BASE = 'https://worldcup26.ir';

// State
let allMatches = [];
let allTeams = [];
let allGroups = {};
let refreshInterval = null;
let refreshCountdown = 30;
let currentFilter = 'all';

// Country flag emojis
const FLAG_MAP = {
    'ARG': '🇦🇷', 'AUS': '🇦🇺', 'BEL': '🇧🇪', 'BRA': '🇧🇷', 'CAN': '🇨🇦',
    'CMR': '🇨🇲', 'CHI': '🇨🇱', 'COL': '🇨🇴', 'CRI': '🇨🇷', 'CRO': '🇭🇷',
    'DEN': '🇩🇰', 'ECU': '🇪🇨', 'ENG': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'FRA': '🇫🇷', 'GER': '🇩🇪',
    'GHA': '🇬🇭', 'GRE': '🇬🇷', 'HAI': '🇭🇹', 'HON': '🇭🇳', 'HUN': '🇭🇺',
    'IRN': '🇮🇷', 'IRQ': '🇮🇶', 'ITA': '🇮🇹', 'JAM': '🇯🇲', 'JPN': '🇯🇵',
    'KOR': '🇰🇷', 'KSA': '🇸🇦', 'MAR': '🇲🇦', 'MEX': '🇲🇽', 'NED': '🇳🇱',
    'NGA': '🇳🇬', 'NIR': '🇬🇧', 'NOR': '🇳🇴', 'NZL': '🇳🇿', 'PAN': '🇵🇦',
    'PAR': '🇵🇾', 'PER': '🇵🇪', 'POL': '🇵🇱', 'POR': '🇵🇹', 'QAT': '🇶🇦',
    'ROI': '🇮🇪', 'RUS': '🇷🇺', 'SCO': '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'SEN': '🇸🇳', 'SRB': '🇷🇸',
    'SUI': '🇨🇭', 'ESP': '🇪🇸', 'SWE': '🇸🇪', 'TUN': '🇹🇳', 'TUR': '🇹🇷',
    'UKR': '🇺🇦', 'URU': '🇺🇾', 'USA': '🇺🇸', 'UZB': '🇺🇿', 'WAL': '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
    'ZAI': '🇨🇩',
    // Common full names
    'Mexico': '🇲🇽', 'Brazil': '🇧🇷', 'Argentina': '🇦🇷', 'France': '🇫🇷',
    'Germany': '🇩🇪', 'Spain': '🇪🇸', 'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Italy': '🇮🇹',
    'Portugal': '🇵🇹', 'Netherlands': '🇳🇱', 'Belgium': '🇧🇪', 'Croatia': '🇭🇷',
    'Japan': '🇯🇵', 'South Korea': '🇰🇷', 'Australia': '🇦🇺', 'USA': '🇺🇸',
    'Canada': '🇨🇦', 'Morocco': '🇲🇦', 'Senegal': '🇸🇳', 'Ghana': '🇬🇭',
    'Cameroon': '🇨🇲', 'Serbia': '🇷🇸', 'Switzerland': '🇨🇭', 'Poland': '🇵🇱',
    'Denmark': '🇩🇰', 'Tunisia': '🇹🇳', 'Saudi Arabia': '🇸🇦', 'Iran': '🇮🇷',
    'Uruguay': '🇺🇾', 'Ecuador': '🇪🇨', 'Colombia': '🇨🇴', 'Peru': '🇵🇪',
    'Chile': '🇨🇱', 'Paraguay': '🇵🇾', 'Costa Rica': '🇨🇷', 'Panama': '🇵🇦',
    'Honduras': '🇭🇳', 'Jamaica': '🇯🇲', 'Haiti': '🇭🇹', 'Qatar': '🇶🇦',
    'Iraq': '🇮🇶', 'Algeria': '🇩🇿', 'Egypt': '🇪🇬', 'Nigeria': '🇳🇬',
    'Ivory Coast': '🇨🇮', 'Mali': '🇲🇱', 'Burkina Faso': '🇧🇫', 'South Africa': '🇿🇦',
    'Ireland': '🇮🇪', 'Northern Ireland': '🇬🇧', 'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'Wales': '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
    'Norway': '🇳🇴', 'Sweden': '🇸🇪', 'Greece': '🇬🇷', 'Hungary': '🇭🇺',
    'Czech Republic': '🇨🇿', 'Ukraine': '🇺🇦', 'Turkey': '🇹🇷', 'Russia': '🇷🇺',
    'China': '🇨🇳', 'India': '🇮🇳', 'Indonesia': '🇮🇩', 'Thailand': '🇹🇭',
    'Vietnam': '🇻🇳', 'Philippines': '🇵🇭', 'Malaysia': '🇲🇾', 'Pakistan': '🇵🇰',
    'Bangladesh': '🇧🇩', 'Nepal': '🇳🇵', 'Sri Lanka': '🇱🇰', 'Uzbekistan': '🇺🇿',
    'Albania': '🇦🇱', 'Armenia': '🇦🇲', 'Azerbaijan': '🇦🇿', 'Belarus': '🇧🇾',
    'Bosnia': '🇧🇦', 'Bulgaria': '🇧🇬', 'Cyprus': '🇨🇾', 'Estonia': '🇪🇪',
    'Finland': '🇫🇮', 'Georgia': '🇬🇪', 'Iceland': '🇮🇸', 'Kazakhstan': '🇰🇿',
    'Latvia': '🇱🇻', 'Lithuania': '🇱🇹', 'Moldova': '🇲🇩', 'Montenegro': '🇲🇪',
    'North Macedonia': '🇲🇰', 'Romania': '🇷🇴', 'Slovakia': '🇸🇰', 'Slovenia': '🇸🇮',
};

// Get flag emoji from team code or name
function getFlag(code, name) {
    if (FLAG_MAP[code]) return FLAG_MAP[code];
    if (FLAG_MAP[name]) return FLAG_MAP[name];
    // Try partial match
    for (const [key, flag] of Object.entries(FLAG_MAP)) {
        if (name && name.includes(key)) return flag;
        if (code && code.includes(key)) return flag;
    }
    return '⚽';
}

// Format match time
function formatTime(dateStr) {
    if (!dateStr) return '';
    try {
        const d = new Date(dateStr);
        return d.toLocaleString('en-US', {
            month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    } catch { return dateStr; }
}

// Format group name
function formatGroup(group) {
    if (!group) return '';
    return `Group ${group}`;
}

// Create match card HTML
function createMatchCard(match) {
    const homeTeam = match.home_team || match.homeTeam || {};
    const awayTeam = match.away_team || match.awayTeam || {};
    const homeName = homeTeam.name || homeTeam.country || match.home || 'TBD';
    const awayName = awayTeam.name || awayTeam.country || match.away || 'TBD';
    const homeCode = homeTeam.code || homeTeam.team_code || '';
    const awayCode = awayTeam.code || awayTeam.team_code || '';
    const homeScore = match.home_score ?? match.homeScore ?? match.score?.home ?? '-';
    const awayScore = match.away_score ?? match.awayScore ?? match.score?.away ?? '-';
    const status = (match.status || '').toLowerCase();
    const group = match.group || match.group_name || '';
    const venue = match.venue || match.stadium || '';
    const time = match.date || match.datetime || match.kickoff || '';
    const matchTime = match.time || match.minute || '';

    const isLive = status === 'live' || status === 'in progress' || status === 'playing';
    const isFinished = status === 'finished' || status === 'ft' || status === 'completed';
    const isUpcoming = !isLive && !isFinished;

    let statusClass = 'status-upcoming';
    let statusText = formatTime(time);
    if (isLive) { statusClass = 'status-live'; statusText = `🔴 LIVE ${matchTime ? matchTime + "'" : ''}`; }
    if (isFinished) { statusClass = 'status-finished'; statusText = 'FT'; }

    const scoreClass = isLive ? 'live-score' : '';

    return `
        <div class="match-card ${isLive ? 'live' : ''}">
            <div class="match-meta">
                <span class="match-group">${formatGroup(group)}</span>
                <span class="match-status ${statusClass}">${statusText}</span>
            </div>
            <div class="match-teams">
                <div class="team">
                    <div class="team-flag">${getFlag(homeCode, homeName)}</div>
                    <div class="team-name">${homeName}</div>
                    ${homeCode ? `<div class="team-code">${homeCode}</div>` : ''}
                </div>
                <div class="match-score">
                    <div class="score-display ${scoreClass}">${homeScore} - ${awayScore}</div>
                </div>
                <div class="team">
                    <div class="team-flag">${getFlag(awayCode, awayName)}</div>
                    <div class="team-name">${awayName}</div>
                    ${awayCode ? `<div class="team-code">${awayCode}</div>` : ''}
                </div>
            </div>
            ${venue ? `<div class="match-venue">📍 ${venue}</div>` : ''}
        </div>
    `;
}

// Render live matches
function renderLiveMatches(matches) {
    const container = document.getElementById('liveMatches');
    const liveBadge = document.getElementById('liveBadge');
    const liveCount = document.getElementById('liveCount');

    const liveMatches = matches.filter(m => {
        const s = (m.status || '').toLowerCase();
        return s === 'live' || s === 'in progress' || s === 'playing';
    });

    if (liveMatches.length > 0) {
        liveBadge.classList.remove('hidden');
        liveCount.textContent = `${liveMatches.length} match${liveMatches.length > 1 ? 'es' : ''}`;
        container.innerHTML = liveMatches.map(createMatchCard).join('');
    } else {
        liveBadge.classList.add('hidden');
        liveCount.textContent = '0 matches';
        // Show upcoming matches as fallback
        const upcoming = matches.filter(m => {
            const s = (m.status || '').toLowerCase();
            return !s || s === 'upcoming' || s === 'scheduled' || s === 'not started';
        }).slice(0, 6);

        if (upcoming.length > 0) {
            container.innerHTML = `
                <div class="no-matches">
                    <div class="icon">⚽</div>
                    <h3>No live matches right now</h3>
                    <p style="margin-top:8px;color:rgba(255,255,255,0.4)">Next matches:</p>
                </div>
                ${upcoming.map(createMatchCard).join('')}
            `;
        } else {
            container.innerHTML = `
                <div class="no-matches">
                    <div class="icon">⚽</div>
                    <h3>No live matches right now</h3>
                    <p>Check back during match time!</p>
                </div>
            `;
        }
    }
}

// Render schedule
function renderSchedule(matches) {
    const container = document.getElementById('scheduleMatches');
    let filtered = matches;

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const tomorrow = new Date(now.getTime() + 86400000).toISOString().split('T')[0];

    if (currentFilter === 'today') {
        filtered = matches.filter(m => (m.date || '').startsWith(today));
    } else if (currentFilter === 'tomorrow') {
        filtered = matches.filter(m => (m.date || '').startsWith(tomorrow));
    }

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="no-matches">
                <div class="icon">📅</div>
                <h3>No matches found</h3>
                <p>Try a different filter</p>
            </div>
        `;
    } else {
        container.innerHTML = filtered.map(createMatchCard).join('');
    }
}

// Filter schedule
function filterSchedule(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    renderSchedule(allMatches);
}

// Render standings
function renderStandings(groups) {
    const container = document.getElementById('standingsContent');
    if (!groups || Object.keys(groups).length === 0) {
        container.innerHTML = `
            <div class="no-matches" style="grid-column:1/-1">
                <div class="icon">🏆</div>
                <h3>Standings not available yet</h3>
            </div>
        `;
        return;
    }

    let html = '';
    for (const [groupName, teams] of Object.entries(groups)) {
        const sorted = Array.isArray(teams) ? teams.sort((a, b) => (b.points || 0) - (a.points || 0)) : [];
        html += `
            <div class="group-card">
                <div class="group-header">🏆 ${formatGroup(groupName)}</div>
                <table class="group-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Team</th>
                            <th>P</th>
                            <th>W</th>
                            <th>D</th>
                            <th>L</th>
                            <th>GD</th>
                            <th>Pts</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sorted.map((t, i) => `
                            <tr class="${i < 2 ? 'qualified' : ''}">
                                <td>${i + 1}</td>
                                <td>${getFlag(t.code || '', t.name || t.team || '')} ${t.name || t.team || 'Unknown'}</td>
                                <td>${t.played || t.p || 0}</td>
                                <td>${t.won || t.w || 0}</td>
                                <td>${t.drawn || t.d || 0}</td>
                                <td>${t.lost || t.l || 0}</td>
                                <td>${t.goal_difference || t.gd || t.diff || 0}</td>
                                <td><strong>${t.points || t.pts || 0}</strong></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
    container.innerHTML = html;
}

// Render teams
function renderTeams(teams) {
    const container = document.getElementById('teamsContent');
    if (!teams || teams.length === 0) {
        container.innerHTML = `
            <div class="no-matches" style="grid-column:1/-1">
                <div class="icon">👥</div>
                <h3>Teams data loading...</h3>
            </div>
        `;
        return;
    }

    container.innerHTML = teams.map(t => {
        const name = t.name || t.team || 'Unknown';
        const code = t.code || t.team_code || '';
        return `
            <div class="team-card">
                <div class="team-card-flag">${getFlag(code, name)}</div>
                <div class="team-card-name">${name}</div>
                ${code ? `<div class="team-card-code">${code}</div>` : ''}
            </div>
        `;
    }).join('');
}

// Search teams
function searchTeams(query) {
    const filtered = allTeams.filter(t => {
        const name = (t.name || t.team || '').toLowerCase();
        const code = (t.code || t.team_code || '').toLowerCase();
        return name.includes(query.toLowerCase()) || code.includes(query.toLowerCase());
    });
    renderTeams(filtered);
}

// Tab switching
function switchTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(`tab-${tab}`).classList.add('active');
}

// Fetch data from API
async function fetchData() {
    try {
        // Fetch all data in parallel
        const [gamesRes, groupsRes, teamsRes] = await Promise.allSettled([
            fetch(`${API_BASE}/get/games`),
            fetch(`${API_BASE}/get/groups`),
            fetch(`${API_BASE}/get/teams`)
        ]);

        // Process matches
        if (gamesRes.status === 'fulfilled') {
            const gamesData = await gamesRes.value.json();
            allMatches = Array.isArray(gamesData) ? gamesData :
                         (gamesData.data || gamesData.matches || gamesData.games || []);
            renderLiveMatches(allMatches);
            renderSchedule(allMatches);
        }

        // Process groups/standings
        if (groupsRes.status === 'fulfilled') {
            const groupsData = await groupsRes.value.json();
            allGroups = groupsData.data || groupsData.groups || groupsData;
            renderStandings(allGroups);
        }

        // Process teams
        if (teamsRes.status === 'fulfilled') {
            const teamsData = await teamsRes.value.json();
            allTeams = Array.isArray(teamsData) ? teamsData :
                       (teamsData.data || teamsData.teams || []);
            renderTeams(allTeams);
        }

        console.log(`✅ Data loaded: ${allMatches.length} matches, ${allTeams.length} teams`);

    } catch (error) {
        console.error('❌ Error fetching data:', error);
        document.getElementById('liveMatches').innerHTML = `
            <div class="no-matches">
                <div class="icon">⚠️</div>
                <h3>Connection Error</h3>
                <p>Could not load match data. Retrying...</p>
            </div>
        `;
    }
}

// Auto-refresh countdown
function startRefreshTimer() {
    refreshCountdown = 30;
    if (refreshInterval) clearInterval(refreshInterval);
    refreshInterval = setInterval(() => {
        refreshCountdown--;
        document.getElementById('refreshTimer').textContent = refreshCountdown;
        if (refreshCountdown <= 0) {
            fetchData();
            refreshCountdown = 30;
        }
    }, 1000);
}

// Particle background
function initParticles() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 40;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: (Math.random() - 0.5) * 0.3,
            opacity: Math.random() * 0.3 + 0.1
        };
    }

    function init() {
        resize();
        particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(76, 175, 80, ${p.opacity})`;
            ctx.fill();
            p.x += p.speedX;
            p.y += p.speedY;
            if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
        });
        requestAnimationFrame(animate);
    }

    init();
    animate();
    window.addEventListener('resize', resize);
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    fetchData();
    startRefreshTimer();
});
