class WorldCupApp {
    constructor() {
        this.simulator = new WorldCupDrawSimulator();
        this.currentDraw = null;
        this.currentMatches = null;
        this.initializeApp();
    }

    initializeApp() {
        this.displayPots();
        this.bindEvents();
        this.displayWelcomeMessage();
    }

    bindEvents() {
        const drawButton = document.getElementById('drawButton');
        drawButton.addEventListener('click', () => this.performCompleteDraw());
    }

    displayWelcomeMessage() {
        const groupsContainer = document.getElementById('groupsContainer');
        const matchesContainer = document.getElementById('matchesContainer');
        
        groupsContainer.innerHTML = `
            <div class="welcome-message" style="text-align: center; padding: 40px; color: var(--fifa-blue);">
                <h3>FIFA World Cup 2026 Draw Simulator</h3>
                <p style="margin-top: 15px; font-size: 1.1rem;">Based on Current Qualification Status:</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; text-align: left;">
                    <div style="background: var(--fifa-gray); padding: 15px; border-radius: 8px;">
                        <strong>✅ Qualified (13)</strong><br>
                        • 3 Hosts (MEX, CAN, USA)<br>
                        • 6 AFC teams<br>
                        • 3 CONMEBOL teams<br>
                        • 1 OFC team
                    </div>
                    <div style="background: var(--fifa-gray); padding: 15px; border-radius: 8px;">
                        <strong>🔮 Projected (33)</strong><br>
                        • 16 UEFA teams<br>
                        • 9 CAF teams<br>
                        • 3 CONMEBOL teams<br>
                        • 2 AFC teams<br>
                        • 3 CONCACAF teams
                    </div>
                    <div style="background: var(--fifa-gray); padding: 15px; border-radius: 8px;">
                        <strong>🏳️ Playoff Spots (6)</strong><br>
                        • 4 UEFA playoff winners<br>
                        • 2 Inter-confederation playoff winners
                    </div>
                </div>
                <p style="font-size: 0.9rem; color: #666;">
                    Click "Simulate Complete Draw" to run March 2026 playoffs first, then the World Cup draw with actual team names!
                </p>
            </div>
        `;
        
        matchesContainer.innerHTML = `
            <div class="matches-info" style="text-align: center; padding: 40px; color: var(--fifa-blue);">
                <h3>FIFA Draw Rules Applied</h3>
                <div style="text-align: left; display: inline-block;">
                    <p><strong>🏆 Host Pre-assignments:</strong></p>
                    <ul style="margin: 10px 0 20px 20px;">
                        <li>Mexico → Group A1</li>
                        <li>Canada → Group B1</li>
                        <li>United States → Group D1</li>
                    </ul>
                    <p><strong>🌍 Confederation Limits:</strong></p>
                    <ul style="margin: 10px 0 20px 20px;">
                        <li>UEFA: Maximum 2 teams per group</li>
                        <li>All others: Maximum 1 team per group</li>
                    </ul>
                    <p><strong>📊 Pot Structure:</strong></p>
                    <ul style="margin: 10px 0 20px 20px;">
                        <li>Pot 1: 3 hosts + 9 best teams by FIFA ranking</li>
                        <li>Pots 2-4: Next 36 teams by ranking + playoffs</li>
                    </ul>
                </div>
            </div>
        `;
    }

    displayPots() {
        console.log('🔄 displayPots() called');
        const potsContainer = document.getElementById('potsContainer');
        const pots = this.simulator.getPots();
        
        console.log('🔄 Pots received:', Object.keys(pots).map(p => `Pot ${p}: ${pots[p].length} teams`));
        console.log('🔄 Playoff winners in pots:', 
            Object.keys(pots).flatMap(p => pots[p].filter(t => t.playoffWinner).map(t => `${t.name} (Pot ${p})`)));
        
        potsContainer.innerHTML = '';
        
        // Show playoff status note if no playoff winners yet
        const hasPlayoffWinners = Object.values(pots).some(pot => pot.some(t => t.playoffWinner));
        if (!hasPlayoffWinners) {
            const playoffNote = document.createElement('div');
            playoffNote.className = 'playoff-note';
            playoffNote.innerHTML = `
                <div class="playoff-note-content">
                    🏆 <strong>6 Playoff Winners</strong> will be added to Pots after March 2026 playoffs
                    <span class="playoff-note-details">(4 UEFA + 2 Inter-confederation)</span>
                </div>
            `;
            potsContainer.appendChild(playoffNote);
        }
        
        for (let potNumber = 1; potNumber <= 4; potNumber++) {
            const potDiv = document.createElement('div');
            potDiv.className = 'pot';
            
            const potHeader = document.createElement('div');
            potHeader.className = 'pot-header';
            potHeader.textContent = `Pot ${potNumber}`;
            
            potDiv.appendChild(potHeader);
            
            pots[potNumber].forEach(team => {
                const teamDiv = document.createElement('div');
                let teamClasses = 'pot-team';
                
                if (team.host) teamClasses += ' host-team';
                if (team.placeholder) teamClasses += ' placeholder-team';
                else if (team.playoffWinner) teamClasses += ' playoff-winner-team';
                else if (team.projected) teamClasses += ' projected-team';
                else if (team.qualified) teamClasses += ' qualified-team';
                
                teamDiv.className = teamClasses;
                
                const playoffLabel = team.playoffWinner ? 
                    (team.playoffPath ? ` (${team.playoffPath})` : ' (Playoff Winner)') : '';
                
                const confederationInfo = CONFEDERATIONS[team.confederation] || { logo: '🏳️', name: team.confederation };
                
                // Determine team status based on actual qualification document
                let statusLabel = '';
                let statusClass = '';
                
                if (team.host) {
                    statusLabel = ' (Host)';
                    statusClass = ' team-host-status';
                } else if (team.placeholder) {
                    statusLabel = '';
                    statusClass = '';
                } else if (team.playoffWinner) {
                    statusLabel = '';
                    statusClass = ' team-playoff-status';
                } else {
                    // Check actual qualification status
                    const alreadyQualified = [
                        'Iran', 'Japan', 'South Korea', 'Australia', 'Jordan', 'Uzbekistan',
                        'Canada', 'Mexico', 'United States', 'Argentina', 'Ecuador', 'Brazil', 'New Zealand'
                    ];
                    
                    if (alreadyQualified.includes(team.name)) {
                        statusLabel = ' (Qualified)';
                        statusClass = ' team-qualified-status';
                    } else {
                        statusLabel = ' (Projected)';
                        statusClass = ' team-projected-status';
                    }
                }
                
                // Special handling for playoff placeholders
                const teamNameDisplay = team.placeholder ? 
                    `${team.name}${team.description ? ` (${team.description})` : ''}` : 
                    `${team.name}${playoffLabel}${statusLabel}`;
                
                const pointsDisplay = team.placeholder ? 
                    (team.points === 'TBD' ? `<div class="team-points placeholder-points">March 2026</div>` : '') :
                    (team.points ? `<div class="team-points">${team.points} pts</div>` : '');
                
                teamDiv.innerHTML = `
                    <span class="team-flag">${team.flag}</span>
                    <div class="team-info">
                        <div class="team-name${statusClass}">${teamNameDisplay}</div>
                        <div class="team-confederation ${team.confederation}">
                            <span>${confederationInfo.logo}</span>
                            <span>${confederationInfo.name}</span>
                        </div>
                        ${pointsDisplay}
                    </div>
                `;
                
                potDiv.appendChild(teamDiv);
            });
            
            potsContainer.appendChild(potDiv);
        }
        
        // Add playoff reminder at the bottom if no winners yet
        if (!hasPlayoffWinners) {
            const reminderDiv = document.createElement('div');
            reminderDiv.className = 'playoff-reminder';
            reminderDiv.innerHTML = `
                <div class="playoff-reminder-content">
                    ⚡ Click "Simulate Complete Draw" to run playoffs and see final pots
                </div>
            `;
            potsContainer.appendChild(reminderDiv);
        }
    }

    performCompleteDraw() {
        const drawButton = document.getElementById('drawButton');
        
        // Show loading for playoffs
        drawButton.innerHTML = '<span class="loading"></span> Simulating Playoffs...';
        drawButton.disabled = true;
        
        // Step 1: Simulate playoffs
        setTimeout(() => {
            console.log('🎲 Starting playoff simulation...');
            const playoffResults = this.simulator.simulatePlayoffs();
            
            // Display playoff results
            this.displayPlayoffResults(playoffResults);
            document.getElementById('playoffsSection').style.display = 'block';
            
            // Update pots with actual playoff winners (ranked by their FIFA points)
            this.displayPots();
            
            // Show loading for draw
            drawButton.innerHTML = '<span class="loading"></span> Drawing Groups...';
            
            // Step 2: Simulate World Cup draw with actual teams
            setTimeout(() => {
                console.log('🏆 Starting World Cup draw...');
                this.currentDraw = this.simulator.simulateDraw();
                this.currentMatches = this.simulator.generateMatches();
                
                this.displayGroups();
                this.displayMatches();
                
                drawButton.textContent = 'New Complete Draw';
                drawButton.disabled = false;
            }, 2000);
        }, 3000);
    }

    displayPlayoffResults(results) {
        const playoffsContainer = document.getElementById('playoffsContainer');
        playoffsContainer.innerHTML = '';
        
        // UEFA Playoffs
        const uefaSection = document.createElement('div');
        uefaSection.className = 'playoff-section';
        
        const uefaHeader = document.createElement('div');
        uefaHeader.className = 'playoff-header';
        uefaHeader.textContent = 'UEFA Playoffs (4 Winners)';
        uefaSection.appendChild(uefaHeader);
        
        results.uefa.forEach(path => {
            const pathDiv = document.createElement('div');
            pathDiv.className = 'playoff-path';
            
            pathDiv.innerHTML = `
                <div class="playoff-path-header">Path ${path.path}</div>
                <div class="playoff-match semifinal">
                    <strong>SF1:</strong> ${path.semiFinals[0].result}
                    <div class="match-probability">${path.semiFinals[0].matchup}</div>
                </div>
                <div class="playoff-match semifinal">
                    <strong>SF2:</strong> ${path.semiFinals[1].result}
                    <div class="match-probability">${path.semiFinals[1].matchup}</div>
                </div>
                <div class="playoff-match final">
                    <strong>Final:</strong> ${path.final.result}
                    <div class="match-probability">${path.final.matchup}</div>
                </div>
                <div class="playoff-winner">
                    <span class="team-flag">${path.winner.flag}</span>
                    ${path.winner.name}
                </div>
            `;
            
            uefaSection.appendChild(pathDiv);
        });
        
        playoffsContainer.appendChild(uefaSection);
        
        // Inter-confederation Playoffs
        const interSection = document.createElement('div');
        interSection.className = 'playoff-section';
        
        const interHeader = document.createElement('div');
        interHeader.className = 'playoff-header';
        interHeader.textContent = 'Inter-confederation Playoffs (2 Winners)';
        interSection.appendChild(interHeader);
        
        const interDiv = document.createElement('div');
        interDiv.className = 'playoff-path';
        
        interDiv.innerHTML = `
            <div class="playoff-path-header">6 Teams → 2 Spots</div>
            ${results.intercontinental.participants.map(team => 
                `<div style="margin: 2px 0; padding: 2px; background: var(--fifa-white); border-radius: 2px; font-size: 0.5rem;">
                    <span class="team-flag">${team.flag}</span> ${team.name}
                </div>`
            ).join('')}
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 6px;">
                <div>
                    <div class="playoff-path-header">Path 1</div>
                    <div class="playoff-match semifinal">
                        <strong>R1:</strong> ${results.intercontinental.semiFinals[0].firstMatch.result}
                        <div class="match-probability">${results.intercontinental.semiFinals[0].firstMatch.matchup}</div>
                    </div>
                    <div class="playoff-match final">
                        <strong>Final:</strong> ${results.intercontinental.semiFinals[0].final.result}
                        <div class="match-probability">${results.intercontinental.semiFinals[0].final.matchup}</div>
                    </div>
                    <div class="playoff-winner">
                        <span class="team-flag">${results.intercontinental.winners[0].flag}</span>
                        ${results.intercontinental.winners[0].name}
                    </div>
                </div>
                <div>
                    <div class="playoff-path-header">Path 2</div>
                    <div class="playoff-match semifinal">
                        <strong>R1:</strong> ${results.intercontinental.semiFinals[1].firstMatch.result}
                        <div class="match-probability">${results.intercontinental.semiFinals[1].firstMatch.matchup}</div>
                    </div>
                    <div class="playoff-match final">
                        <strong>Final:</strong> ${results.intercontinental.semiFinals[1].final.result}
                        <div class="match-probability">${results.intercontinental.semiFinals[1].final.matchup}</div>
                    </div>
                    <div class="playoff-winner">
                        <span class="team-flag">${results.intercontinental.winners[1].flag}</span>
                        ${results.intercontinental.winners[1].name}
                    </div>
                </div>
            </div>
        `;
        
        interSection.appendChild(interDiv);
        playoffsContainer.appendChild(interSection);
    }

    displayGroups() {
        const groupsContainer = document.getElementById('groupsContainer');
        groupsContainer.innerHTML = '';
        
        const groupLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
        
        groupLetters.forEach(letter => {
            const group = this.currentDraw[letter];
            if (!group || group.length === 0) return;
            
            const groupDiv = document.createElement('div');
            groupDiv.className = 'group';
            
            const groupHeader = document.createElement('div');
            groupHeader.className = 'group-header';
            groupHeader.textContent = `Group ${letter}`;
            
            groupDiv.appendChild(groupHeader);
            
            group.forEach((team) => {
                const teamDiv = document.createElement('div');
                let teamClasses = 'group-team';
                
                if (team.host) teamClasses += ' host-team';
                if (team.placeholder) teamClasses += ' placeholder-team';
                else if (team.playoffWinner) teamClasses += ' playoff-winner-team';
                else if (team.projected) teamClasses += ' projected-team';
                else if (team.qualified) teamClasses += ' qualified-team';
                
                teamDiv.className = teamClasses;
                
                const playoffLabel = team.playoffWinner ? 
                    (team.playoffPath ? ` (${team.playoffPath})` : ' (Playoff Winner)') : '';
                
                const confederationInfo = CONFEDERATIONS[team.confederation] || { logo: '🏳️', name: team.confederation };
                
                // Determine team status based on actual qualification document
                let statusLabel = '';
                let statusClass = '';
                
                if (team.host) {
                    statusLabel = ' (Host)';
                    statusClass = ' team-host-status';
                } else if (team.placeholder) {
                    statusLabel = '';
                    statusClass = '';
                } else if (team.playoffWinner) {
                    statusLabel = '';
                    statusClass = ' team-playoff-status';
                } else {
                    // Check actual qualification status
                    const alreadyQualified = [
                        'Iran', 'Japan', 'South Korea', 'Australia', 'Jordan', 'Uzbekistan',
                        'Canada', 'Mexico', 'United States', 'Argentina', 'Ecuador', 'Brazil', 'New Zealand'
                    ];
                    
                    if (alreadyQualified.includes(team.name)) {
                        statusLabel = ' (Qualified)';
                        statusClass = ' team-qualified-status';
                    } else {
                        statusLabel = ' (Projected)';
                        statusClass = ' team-projected-status';
                    }
                }
                
                // Special handling for playoff placeholders
                const teamNameDisplay = team.placeholder ? 
                    `${team.name}${team.description ? ` (${team.description})` : ''}` : 
                    `${team.name}${playoffLabel}${statusLabel}`;
                
                const pointsDisplay = team.placeholder ? 
                    (team.points === 'TBD' ? `<div class="team-points placeholder-points">March 2026</div>` : '') :
                    (team.points ? `<div class="team-points">${team.points} pts</div>` : '');
                
                teamDiv.innerHTML = `
                    <span class="team-flag">${team.flag}</span>
                    <div class="team-info">
                        <div class="team-name${statusClass}">${teamNameDisplay}</div>
                        <div class="team-confederation ${team.confederation}">
                            <span>${confederationInfo.logo}</span>
                            <span>${confederationInfo.name}</span>
                        </div>
                        ${pointsDisplay}
                    </div>
                `;
                
                groupDiv.appendChild(teamDiv);
            });
            
            groupsContainer.appendChild(groupDiv);
        });
    }

    displayMatches() {
        const matchesContainer = document.getElementById('matchesContainer');
        matchesContainer.innerHTML = '';
        
        const groupLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
        
        groupLetters.forEach(letter => {
            const groupMatches = this.currentMatches.filter(match => match.group === letter);
            if (groupMatches.length === 0) return;
            
            const groupMatchesDiv = document.createElement('div');
            groupMatchesDiv.className = 'group-matches';
            
            const groupHeader = document.createElement('div');
            groupHeader.className = 'group-matches-header';
            groupHeader.textContent = `Group ${letter} Matches`;
            
            groupMatchesDiv.appendChild(groupHeader);
            
            groupMatches.forEach(match => {
                const matchDiv = document.createElement('div');
                matchDiv.className = 'match';
                
                // Get team flags from current groups
                const team1Info = this.currentDraw[letter].find(t => t.name === match.team1);
                const team2Info = this.currentDraw[letter].find(t => t.name === match.team2);
                const team1Flag = team1Info ? team1Info.flag : '🏳️';
                const team2Flag = team2Info ? team2Info.flag : '🏳️';
                
                matchDiv.innerHTML = `
                    <div class="match-header">
                        <span class="match-number">Match ${match.match}</span>
                        <span class="match-date">${match.date}</span>
                    </div>
                    <div class="match-teams">
                        <span class="team-with-flag">${team1Flag} ${match.team1}</span>
                        <span class="vs-text">vs</span>
                        <span class="team-with-flag">${team2Flag} ${match.team2}</span>
                    </div>
                    <div class="match-venue">${match.venue}, ${match.venueInfo ? `${match.venueInfo.city}, ${match.venueInfo.country}` : ''}</div>
                `;
                
                groupMatchesDiv.appendChild(matchDiv);
            });
            
            matchesContainer.appendChild(groupMatchesDiv);
        });
    }
    
    displayMatchesByCity() {
        const matchesContainer = document.getElementById('matchesContainer');
        matchesContainer.innerHTML = '';
        
        if (!this.currentMatches) {
            matchesContainer.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">No matches to display. Run the draw first.</div>';
            return;
        }
        
        // Group matches by city
        const matchesByCity = {};
        this.currentMatches.forEach(match => {
            const city = match.venueInfo ? `${match.venueInfo.city}, ${match.venueInfo.country}` : 'Unknown City';
            if (!matchesByCity[city]) {
                matchesByCity[city] = [];
            }
            matchesByCity[city].push(match);
        });
        
        // Sort cities alphabetically
        const sortedCities = Object.keys(matchesByCity).sort();
        
        sortedCities.forEach(city => {
            const cityMatchesDiv = document.createElement('div');
            cityMatchesDiv.className = 'city-matches';
            
            const cityHeader = document.createElement('div');
            cityHeader.className = 'city-matches-header';
            cityHeader.textContent = `${city} (${matchesByCity[city].length} matches)`;
            
            cityMatchesDiv.appendChild(cityHeader);
            
            // Sort matches by date and match number
            matchesByCity[city].sort((a, b) => a.match - b.match);
            
            matchesByCity[city].forEach(match => {
                const matchDiv = document.createElement('div');
                matchDiv.className = 'city-match';
                
                // Get team flags
                const team1Info = this.getTeamFromMatch(match.team1);
                const team2Info = this.getTeamFromMatch(match.team2);
                const team1Flag = team1Info ? team1Info.flag : '🏳️';
                const team2Flag = team2Info ? team2Info.flag : '🏳️';
                
                matchDiv.innerHTML = `
                    <div class="city-match-info">
                        <span class="match-number" style="background: var(--fifa-red); color: white; padding: 1px 3px; border-radius: 2px; font-size: 0.5rem;">M${match.match}</span>
                        <span class="match-date" style="color: var(--fifa-blue); font-weight: bold; font-size: 0.5rem;">${match.date}</span>
                    </div>
                    <div class="city-match-teams">
                        <span class="team-with-flag">${team1Flag} ${match.team1}</span>
                        <span class="vs-text">vs</span>
                        <span class="team-with-flag">${team2Flag} ${match.team2}</span>
                    </div>
                    <div class="city-match-details">
                        Group ${match.group} • ${match.venue}
                    </div>
                `;
                
                cityMatchesDiv.appendChild(matchDiv);
            });
            
            matchesContainer.appendChild(cityMatchesDiv);
        });
    }
    
    getTeamFromMatch(teamName) {
        if (!this.currentDraw) return null;
        
        for (const groupLetter of Object.keys(this.currentDraw)) {
            const team = this.currentDraw[groupLetter].find(t => t.name === teamName);
            if (team) return team;
        }
        return null;
    }
    
    displayMatchesByCalendar() {
        const matchesContainer = document.getElementById('matchesContainer');
        matchesContainer.innerHTML = '';
        
        if (!this.currentMatches) {
            matchesContainer.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">No matches to display. Run the draw first.</div>';
            return;
        }
        
        // Group matches by date
        const matchesByDate = {};
        this.currentMatches.forEach(match => {
            const date = match.date;
            if (!matchesByDate[date]) {
                matchesByDate[date] = [];
            }
            matchesByDate[date].push(match);
        });
        
        // Create calendar container
        const calendarContainer = document.createElement('div');
        calendarContainer.className = 'calendar-container';
        
        // Sort dates chronologically
        const sortedDates = Object.keys(matchesByDate).sort((a, b) => {
            // Parse dates (format: "June 11, 2026")
            const dateA = new Date(a);
            const dateB = new Date(b);
            return dateA - dateB;
        });
        
        sortedDates.forEach(date => {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day';
            
            // Parse date to get day of week
            const dateObj = new Date(date);
            const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
            
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.innerHTML = `
                <div>${dayOfWeek}</div>
                <div>${date}</div>
                <div style="font-size: 0.6rem; font-weight: normal; margin-top: 2px;">${matchesByDate[date].length} matches</div>
            `;
            
            dayDiv.appendChild(dayHeader);
            
            // Sort matches by match number
            matchesByDate[date].sort((a, b) => a.match - b.match);
            
            matchesByDate[date].forEach(match => {
                const matchDiv = document.createElement('div');
                matchDiv.className = 'calendar-match';
                
                // Get team flags
                const team1Info = this.getTeamFromMatch(match.team1);
                const team2Info = this.getTeamFromMatch(match.team2);
                const team1Flag = team1Info ? team1Info.flag : '🏳️';
                const team2Flag = team2Info ? team2Info.flag : '🏳️';
                
                matchDiv.innerHTML = `
                    <div class="calendar-match-header">
                        <span class="match-number" style="background: var(--fifa-red); color: white; padding: 1px 3px; border-radius: 2px; font-size: 0.5rem;">Match ${match.match}</span>
                        <span class="group-indicator" style="background: var(--fifa-gold); color: var(--fifa-dark); padding: 1px 3px; border-radius: 2px; font-size: 0.5rem; font-weight: bold;">Group ${match.group}</span>
                    </div>
                    <div class="calendar-match-teams">
                        <span class="team-with-flag">${team1Flag} ${match.team1}</span>
                        <span class="vs-text">vs</span>
                        <span class="team-with-flag">${team2Flag} ${match.team2}</span>
                    </div>
                    <div class="calendar-match-venue">
                        ${match.venue}
                        ${match.venueInfo ? ` • ${match.venueInfo.city}, ${match.venueInfo.country}` : ''}
                    </div>
                `;
                
                dayDiv.appendChild(matchDiv);
            });
            
            calendarContainer.appendChild(dayDiv);
        });
        
        matchesContainer.appendChild(calendarContainer);
    }

    // Utility function to get confederation color
    getConfederationColor(confederation) {
        const colors = {
            'AFC': '#FF6B35',
            'CAF': '#F4D03F',
            'CONCACAF': '#85C1E9',
            'CONMEBOL': '#82E0AA',
            'OFC': '#D7BDE2',
            'UEFA': '#F8C471',
            'PLAYOFF': '#BDC3C7'
        };
        return colors[confederation] || '#BDC3C7';
    }
}

// Toggle function for playoff details
function togglePlayoffDetails() {
    const container = document.getElementById('playoffsContainer');
    const toggleIcon = document.getElementById('toggleIcon');
    const toggleButton = document.getElementById('togglePlayoffs');
    
    if (container.classList.contains('collapsed')) {
        container.classList.remove('collapsed');
        toggleIcon.textContent = '▲';
        toggleButton.innerHTML = '<span id="toggleIcon">▲</span> Hide Details';
    } else {
        container.classList.add('collapsed');
        toggleIcon.textContent = '▼';
        toggleButton.innerHTML = '<span id="toggleIcon">▼</span> Show Details';
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.worldCupApp = new WorldCupApp();
});

// Global function for switching match views
function switchMatchView(viewType) {
    const groupBtn = document.getElementById('groupViewBtn');
    const cityBtn = document.getElementById('cityViewBtn');
    const calendarBtn = document.getElementById('calendarViewBtn');
    
    // Reset all buttons
    groupBtn.classList.remove('active');
    cityBtn.classList.remove('active');
    calendarBtn.classList.remove('active');
    
    if (viewType === 'group') {
        groupBtn.classList.add('active');
        window.worldCupApp.displayMatches();
    } else if (viewType === 'city') {
        cityBtn.classList.add('active');
        window.worldCupApp.displayMatchesByCity();
    } else if (viewType === 'calendar') {
        calendarBtn.classList.add('active');
        window.worldCupApp.displayMatchesByCalendar();
    }
}