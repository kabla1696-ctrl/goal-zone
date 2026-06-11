// GOAL ZONE — Live Football Scores App
// Data Source: Free World Cup 2026 API (worldcup26.ir)

const API_BASE = 'https://worldcup26.ir';

// State
let allMatches = [];
let allTeams = [];
let allGroups = {};
let allStadiums = {};
let refreshInterval = null;
let refreshCountdown = 30;
let currentFilter = 'all';

// Country flag emojis (fallback)
const FLAG_EMOJI = {
    'MEX': '🇲🇽', 'BRA': '🇧🇷', 'ARG': '🇦🇷', 'FRA': '🇫🇷', 'GER': '🇩🇪',
    'ESP': '🇪🇸', 'ITA': '🇮🇹', 'POR': '🇵🇹', 'NED': '🇳🇱',
    'BEL': '🇧🇪', 'CRO': '🇭🇷', 'JPN': '🇯🇵', 'KOR': '🇰🇷', 'AUS': '🇦🇺',
    'USA': '🇺🇸', 'CAN': '🇨🇦', 'MAR': '🇲🇦', 'SEN': '🇸🇳', 'GHA': '🇬🇭',
    'CMR': '🇨🇲', 'SRB': '🇷🇸', 'SUI': '🇨🇭', 'POL': '🇵🇱', 'DEN': '🇩🇰',
    'TUN': '🇹🇳', 'KSA': '🇸🇦', 'IRN': '🇮🇷', 'URU': '🇺🇾', 'ECU': '🇪🇨',
    'COL': '🇨🇴', 'PER': '🇵🇪', 'CHI': '🇨🇱', 'PAR': '🇵🇾', 'CRC': '🇨🇷',
    'PAN': '🇵🇦', 'HON': '🇭🇳', 'JAM': '🇯🇲', 'HAI': '🇭🇹', 'QAT': '🇶🇦',
    'IRQ': '🇮🇶', 'RSA': '🇿🇦', 'NGA': '🇳🇬', 'CIV': '🇨🇮', 'MLI': '🇲🇱',
    'BFA': '🇧🇫', 'NZL': '🇳🇿', 'UKR': '🇺🇦', 'SWE': '🇸🇪', 'NOR': '🇳🇴',
    'CZE': '🇨🇿', 'TUR': '🇹🇷', 'RUS': '🇷🇺', 'ROU': '🇷🇴', 'BUL': '🇧🇬',
    'ALB': '🇦🇱', 'ISL': '🇮🇸', 'FIN': '🇫🇮', 'SVK': '🇸🇰', 'SVN': '🇸🇮',
    'BIH': '🇧🇦', 'GEO': '🇬🇪', 'ARM': '🇦🇲', 'AZE': '🇦🇿', 'KAZ': '🇰🇿', 'UZB': '🇺🇿',
    // Full names
    'Mexico': '🇲🇽', 'Brazil': '🇧🇷', 'Argentina': '🇦🇷', 'France': '🇫🇷',
    'Germany': '🇩🇪', 'Spain': '🇪🇸', 'Italy': '🇮🇹', 'Portugal': '🇵🇹',
    'Netherlands': '🇳🇱', 'Belgium': '🇧🇪', 'Croatia': '🇭🇷', 'Japan': '🇯🇵',
    'South Korea': '🇰🇷', 'Australia': '🇦🇺', 'USA': '🇺🇸', 'Canada': '🇨🇦',
    'Morocco': '🇲🇦', 'Senegal': '🇸🇳', 'Ghana': '🇬🇭', 'Cameroon': '🇨🇲',
    'Serbia': '🇷🇸', 'Switzerland': '🇨🇭', 'Poland': '🇵🇱', 'Denmark': '🇩🇰',
    'Tunisia': '🇹🇳', 'Saudi Arabia': '🇸🇦', 'Iran': '🇮🇷', 'Uruguay': '🇺🇾',
    'Ecuador': '🇪🇨', 'Colombia': '🇨🇴', 'Peru': '🇵🇪', 'Chile': '🇨🇱',
    'Paraguay': '🇵🇾', 'Costa Rica': '🇨🇷', 'Panama': '🇵🇦', 'Honduras': '🇭🇳',
    'Jamaica': '🇯🇲', 'Haiti': '🇭🇹', 'Qatar': '🇶🇦', 'Iraq': '🇮🇶',
    'South Africa': '🇿🇦', 'Nigeria': '🇳🇬', 'Ivory Coast': '🇨🇮', 'Mali': '🇲🇱',
    'Burkina Faso': '🇧🇫', 'New Zealand': '🇳🇿', 'Ukraine': '🇺🇦', 'Sweden': '🇸🇪',
    'Norway': '🇳🇴', 'Czech Republic': '🇨🇿', 'Czechia': '🇨🇿', 'Turkey': '🇹🇷',
    'Romania': '🇷🇴', 'Bulgaria': '🇧🇬', 'Albania': '🇦🇱', 'Iceland': '🇮🇸',
    'Finland': '🇫🇮', 'Slovakia': '🇸🇰', 'Slovenia': '🇸🇮', 'Bosnia': '🇧🇦',
    'Georgia': '🇬🇪', 'Armenia': '🇦🇲', 'Azerbaijan': '🇦🇿', 'Kazakhstan': '🇰🇿',
    'Uzbekistan': '🇺🇿', 'United States': '🇺🇸', 'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'Wales': '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
};

// TV Channels for World Cup 2026
const TV_CHANNELS = {
    bangladesh: [
        { name: 'Nagorik TV', type: 'TV', lang: 'Bengali', free: true },
        { name: 'T Sports', type: 'TV', lang: 'Bengali', free: true },
        { name: 'Bangladesh Television (BTV)', type: 'TV', lang: 'Bengali', free: true },
        { name: 'Somoy TV', type: 'TV', lang: 'Bengali', free: true },
    ],
    global: [
        { name: 'FIFA+', type: 'Streaming', lang: 'Multiple', free: true, url: 'https://www.fifaplus.com' },
        { name: 'Fox Sports (USA)', type: 'TV', lang: 'English', free: false },
        { name: 'Telemundo (USA)', type: 'TV', lang: 'Spanish', free: false },
        { name: 'BBC (UK)', type: 'TV', lang: 'English', free: true },
        { name: 'ITV (UK)', type: 'TV', lang: 'English', free: true },
        { name: 'ARD/ZDF (Germany)', type: 'TV', lang: 'German', free: true },
        { name: 'TF1 (France)', type: 'TV', lang: 'French', free: true },
        { name: 'RAI (Italy)', type: 'TV', lang: 'Italian', free: true },
        { name: 'NHK (Japan)', type: 'TV', lang: 'Japanese', free: true },
        { name: 'SBS (Australia)', type: 'TV', lang: 'English', free: true },
    ]
};

// Build team lookup
let teamLookup = {};

function getFlag(code, name) {
    if (code && FLAG_EMOJI[code]) return FLAG_EMOJI[code];
    if (name && FLAG_EMOJI[name]) return FLAG_EMOJI[name];
    if (code && teamLookup[code]) return '⚽';
    return '⚽';
}

function getStadium(id) {
    return allStadiums[id] || '';
}

function formatTime(dateStr) {
    if (!dateStr) return '';
    try {
        const [datePart, timePart] = dateStr.split(' ');
        const [month, day, year] = datePart.split('/');
        const d = new Date(`${year}-${month}-${day}T${timePart}:00`);
        return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch { return dateStr; }
}

// Get match status — with TIME-BASED live detection
function getStatusInfo(match) {
    const finished = (match.finished || '').toUpperCase() === 'TRUE';
    const timeElapsed = (match.time_elapsed || '').toLowerCase();

    if (finished || timeElapsed === 'finished') {
        return { isLive: false, isFinished: true, isUpcoming: false, text: 'FT', class: 'status-finished', minute: '' };
    }

    // API says live
    if (timeElapsed && timeElapsed !== 'notstarted' && timeElapsed !== 'halftime' && timeElapsed !== 'finished') {
        const minute = timeElapsed === 'halftime' ? 'HT' : timeElapsed + "'";
        return { isLive: true, isFinished: false, isUpcoming: false, text: `🔴 ${minute}`, class: 'status-live', minute };
    }
    if (timeElapsed === 'halftime') {
        return { isLive: true, isFinished: false, isUpcoming: false, text: '🔴 HT', class: 'status-live', minute: 'HT' };
    }

    // TIME-BASED detection: if match time passed, override API status
    if (match.local_date && (timeElapsed === 'notstarted' || !timeElapsed)) {
        try {
            const [datePart, timePart] = match.local_date.split(' ');
            const [month, day, year] = datePart.split('/');
            const matchTime = new Date(`${year}-${month}-${day}T${timePart}:00`);
            const now = new Date();
            const diffMin = (now - matchTime) / 60000;

            if (diffMin >= 0 && diffMin < 130) {
                // Match should be live (within 2h 10min of kickoff)
                const approxMin = Math.min(Math.round(diffMin), 90);
                const suffix = approxMin > 45 && approxMin <= 60 ? ' (2nd half)' : '';
                return { isLive: true, isFinished: false, isUpcoming: false, text: `🔴 ~${approxMin}'${suffix}`, class: 'status-live', minute: `${approxMin}` };
            }
            if (diffMin >= 130) {
                return { isLive: false, isFinished: true, isUpcoming: false, text: 'FT', class: 'status-finished', minute: '' };
            }
        } catch(e) {}
    }

    return {
        isLive: false, isFinished: false, isUpcoming: true,
        text: formatTime(match.local_date),
        class: 'status-upcoming', minute: ''
    };
}

// Get watch info for live matches
function getWatchInfo() {
    const bd = TV_CHANNELS.bangladesh.slice(0, 2).map(c => c.name).join(', ');
    return `📺 ${bd} | FIFA+ (Free)`;
}

// Create match card HTML
function createMatchCard(match) {
    const homeName = match.home_team_name_en || 'TBD';
    const awayName = match.away_team_name_en || 'TBD';
    const homeCode = match.home_team_fifa_code || match.home_team_code || '';
    const awayCode = match.away_team_fifa_code || match.away_team_code || '';
    const homeScore = match.home_score || '0';
    const awayScore = match.away_score || '0';
    const group = match.group || '';
    const stadium = getStadium(match.stadium_id);
    const status = getStatusInfo(match);
    const isLive = status.isLive;
    const scoreClass = isLive ? 'live-score' : '';

    return `
        <div class="match-card ${isLive ? 'live' : ''}">
            <div class="match-meta">
                <span class="match-group">Group ${group}</span>
                <span class="match-status ${status.class}">${status.text}</span>
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
            ${stadium ? `<div class="match-venue">📍 ${stadium}</div>` : ''}
            ${isLive ? `<div class="match-tv">${getWatchInfo()}</div>` : ''}
        </div>
    `;
}

// Render live matches
function renderLiveMatches(matches) {
    const container = document.getElementById('liveMatches');
    const liveBadge = document.getElementById('liveBadge');
    const liveCount = document.getElementById('liveCount');

    const liveMatches = matches.filter(m => getStatusInfo(m).isLive);
    const finishedMatches = matches.filter(m => getStatusInfo(m).isFinished);
    const upcomingMatches = matches.filter(m => getStatusInfo(m).isUpcoming);

    if (liveMatches.length > 0) {
        liveBadge.classList.remove('hidden');
        liveCount.textContent = `${liveMatches.length} LIVE`;
        container.innerHTML = liveMatches.map(createMatchCard).join('');
    } else {
        liveBadge.classList.add('hidden');
        liveCount.textContent = '0 live';

        let html = `
            <div class="no-matches">
                <div class="icon">⚽</div>
                <h3>No live matches right now</h3>
            </div>
        `;

        if (finishedMatches.length > 0) {
            html += `<p style="color:rgba(255,255,255,0.4);text-align:center;margin:12px 0;font-size:13px">📋 Recent Results</p>`;
            html += finishedMatches.slice(-3).map(createMatchCard).join('');
        }

        if (upcomingMatches.length > 0) {
            html += `<p style="color:rgba(255,255,255,0.4);text-align:center;margin:16px 0 12px;font-size:13px">⏰ Coming Up</p>`;
            html += upcomingMatches.slice(0, 4).map(createMatchCard).join('');
        }

        container.innerHTML = html;
    }
}

// Render schedule
function renderSchedule(matches) {
    const container = document.getElementById('scheduleMatches');
    let filtered = matches;

    if (currentFilter === 'today') {
        const now = new Date();
        const todayMMDD = `${String(now.getMonth()+1).padStart(2,'0')}/${String(now.getDate()).padStart(2,'0')}`;
        filtered = matches.filter(m => (m.local_date || '').includes(todayMMDD));
    } else if (currentFilter === 'tomorrow') {
        const tomorrow = new Date(Date.now() + 86400000);
        const tmrwMMDD = `${String(tomorrow.getMonth()+1).padStart(2,'0')}/${String(tomorrow.getDate()).padStart(2,'0')}`;
        filtered = matches.filter(m => (m.local_date || '').includes(tmrwMMDD));
    }

    if (filtered.length === 0) {
        container.innerHTML = `<div class="no-matches"><div class="icon">📅</div><h3>No matches found</h3><p>Try a different filter</p></div>`;
    } else {
        container.innerHTML = filtered.map(createMatchCard).join('');
    }
}

function filterSchedule(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    renderSchedule(allMatches);
}

// Render standings
function renderStandings(groups) {
    const container = document.getElementById('standingsContent');
    const groupList = Array.isArray(groups) ? groups : (groups ? Object.values(groups) : []);

    if (groupList.length === 0) {
        container.innerHTML = `<div class="no-matches" style="grid-column:1/-1"><div class="icon">🏆</div><h3>Standings not available yet</h3></div>`;
        return;
    }

    let html = '';
    for (const group of groupList) {
        const groupName = group.name || group.group || '?';
        const teams = group.teams || [];
        const sorted = [...teams].sort((a, b) => (parseInt(b.pts) || 0) - (parseInt(a.pts) || 0) || (parseInt(b.gd) || 0) - (parseInt(a.gd) || 0));

        html += `
            <div class="group-card">
                <div class="group-header">🏆 Group ${groupName}</div>
                <table class="group-table">
                    <thead><tr><th>#</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th></tr></thead>
                    <tbody>
                        ${sorted.map((t, i) => {
                            const teamInfo = teamLookup[t.team_id] || {};
                            const teamName = teamInfo.name || `Team ${t.team_id}`;
                            const teamCode = teamInfo.code || '';
                            return `<tr class="${i < 2 ? 'qualified' : ''}"><td>${i+1}</td><td>${getFlag(teamCode, teamName)} ${teamName}</td><td>${t.mp||0}</td><td>${t.w||0}</td><td>${t.d||0}</td><td>${t.l||0}</td><td>${t.gd||0}</td><td><strong>${t.pts||0}</strong></td></tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>`;
    }
    container.innerHTML = html;
}

// Render teams
function renderTeams(teams) {
    const container = document.getElementById('teamsContent');
    if (!teams || teams.length === 0) {
        container.innerHTML = `<div class="no-matches" style="grid-column:1/-1"><div class="icon">👥</div><h3>Teams data loading...</h3></div>`;
        return;
    }
    container.innerHTML = teams.map(t => {
        const name = t.name_en || t.name || 'Unknown';
        const code = t.fifa_code || '';
        return `<div class="team-card"><div class="team-card-flag">${getFlag(code, name)}</div><div class="team-card-name">${name}</div>${code ? `<div class="team-card-code">${code}</div>` : ''}</div>`;
    }).join('');
}

function searchTeams(query) {
    const filtered = allTeams.filter(t => {
        const name = (t.name_en || t.name || '').toLowerCase();
        const code = (t.fifa_code || '').toLowerCase();
        return name.includes(query.toLowerCase()) || code.includes(query.toLowerCase());
    });
    renderTeams(filtered);
}

// Render TV channels
function renderTVChannels() {
    const container = document.getElementById('tvChannels');
    if (!container) return;

    let html = '<h3 style="color:#fff;margin-bottom:16px">📺 Where to Watch</h3>';
    html += '<h4 style="color:#4CAF50;margin-bottom:8px">🇧🇩 Bangladesh</h4><div class="tv-list">';
    TV_CHANNELS.bangladesh.forEach(ch => {
        html += `<div class="tv-card"><div class="tv-name">${ch.name}</div><div class="tv-info">${ch.type} • ${ch.lang} • ${ch.free ? '✅ Free' : '💰 Paid'}</div></div>`;
    });
    html += '</div>';

    html += '<h4 style="color:#FF9800;margin:16px 0 8px">🌍 Global Broadcasters</h4><div class="tv-list">';
    TV_CHANNELS.global.forEach(ch => {
        html += `<div class="tv-card"><div class="tv-name">${ch.name}</div><div class="tv-info">${ch.type} • ${ch.lang} • ${ch.free ? '✅ Free' : '💰 Paid'}</div></div>`;
    });
    html += '</div>';
    container.innerHTML = html;
}

function switchTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(`tab-${tab}`).classList.add('active');
}

// Fetch data
async function fetchData() {
    try {
        const [gamesRes, groupsRes, teamsRes, stadiumsRes] = await Promise.allSettled([
            fetch(`${API_BASE}/get/games`),
            fetch(`${API_BASE}/get/groups`),
            fetch(`${API_BASE}/get/teams`),
            fetch(`${API_BASE}/get/stadiums`)
        ]);

        if (teamsRes.status === 'fulfilled') {
            const teamsData = await teamsRes.value.json();
            allTeams = teamsData.teams || teamsData.data || (Array.isArray(teamsData) ? teamsData : []);
            allTeams.forEach(t => {
                const name = t.name_en || t.name || '';
                const code = t.fifa_code || '';
                if (t.id) teamLookup[t.id] = { name, code };
                if (code) teamLookup[code] = { name, code };
            });
            renderTeams(allTeams);
        }

        if (stadiumsRes.status === 'fulfilled') {
            const stadiumsData = await stadiumsRes.value.json();
            const stadiums = stadiumsData.stadiums || stadiumsData.data || (Array.isArray(stadiumsData) ? stadiumsData : []);
            stadiums.forEach(s => {
                if (s.id) allStadiums[s.id] = s.name_en || s.fifa_name || '';
            });
        }

        if (gamesRes.status === 'fulfilled') {
            const gamesData = await gamesRes.value.json();
            allMatches = gamesData.games || gamesData.data || (Array.isArray(gamesData) ? gamesData : []);
            renderLiveMatches(allMatches);
            renderSchedule(allMatches);
        }

        if (groupsRes.status === 'fulfilled') {
            const groupsData = await groupsRes.value.json();
            allGroups = groupsData.groups || groupsData.data || groupsData;
            renderStandings(allGroups);
        }

        renderTVChannels();
        console.log(`✅ Data loaded: ${allMatches.length} matches, ${allTeams.length} teams`);

    } catch (error) {
        console.error('❌ Error fetching data:', error);
        document.getElementById('liveMatches').innerHTML = `
            <div class="no-matches"><div class="icon">⚠️</div><h3>Connection Error</h3><p>Could not load match data. Retrying...</p></div>`;
    }
}

function startRefreshTimer() {
    refreshCountdown = 30;
    if (refreshInterval) clearInterval(refreshInterval);
    refreshInterval = setInterval(() => {
        refreshCountdown--;
        document.getElementById('refreshTimer').textContent = refreshCountdown;
        if (refreshCountdown <= 0) { fetchData(); refreshCountdown = 30; }
    }, 1000);
}

// Particles
function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    function createParticle() {
        return { x: Math.random() * canvas.width, y: Math.random() * canvas.height, size: Math.random() * 2 + 0.5, speedX: (Math.random()-0.5)*0.3, speedY: (Math.random()-0.5)*0.3, opacity: Math.random()*0.3+0.1 };
    }
    function init() { resize(); particles = Array.from({length:40}, createParticle); }
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
            ctx.fillStyle = `rgba(76, 175, 80, ${p.opacity})`; ctx.fill();
            p.x += p.speedX; p.y += p.speedY;
            if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
        });
        requestAnimationFrame(animate);
    }
    init(); animate();
    window.addEventListener('resize', resize);
}

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    fetchData();
    startRefreshTimer();
});
