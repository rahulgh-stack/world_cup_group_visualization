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
                
                // Special handling for playoff placeholders
                const teamNameDisplay = team.placeholder ? 
                    `${team.name}${team.description ? ` (${team.description})` : ''}` : 
                    `${team.name}${playoffLabel}`;
                
                const pointsDisplay = team.placeholder ? 
                    (team.points === 'TBD' ? `<div class="team-points placeholder-points">March 2026</div>` : '') :
                    (team.points ? `<div class="team-points">${team.points} pts</div>` : '');
                
                teamDiv.innerHTML = `
                    <span class="team-flag">${team.flag}</span>
                    <div class="team-info">
                        <div class="team-name">${teamNameDisplay}</div>
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
                    </div>
                    <div class="playoff-match final">
                        <strong>Final:</strong> ${results.intercontinental.semiFinals[0].final.result}
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
                    </div>
                    <div class="playoff-match final">
                        <strong>Final:</strong> ${results.intercontinental.semiFinals[1].final.result}
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
            
            group.forEach((team, index) => {
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
                
                // Special handling for playoff placeholders
                const teamNameDisplay = team.placeholder ? 
                    `${team.name}${team.description ? ` (${team.description})` : ''}` : 
                    `${team.name}${playoffLabel}`;
                
                const pointsDisplay = team.placeholder ? 
                    (team.points === 'TBD' ? `<div class="team-points placeholder-points">March 2026</div>` : '') :
                    (team.points ? `<div class="team-points">${team.points} pts</div>` : '');
                
                teamDiv.innerHTML = `
                    <span class="team-flag">${team.flag}</span>
                    <div class="team-info">
                        <div class="team-name">${teamNameDisplay}</div>
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
                
                matchDiv.innerHTML = `
                    <div class="match-header">
                        <span class="match-number">Match ${match.match}</span>
                        <span class="match-date">${match.date}</span>
                    </div>
                    <div class="match-teams">${match.team1} vs ${match.team2}</div>
                    <div class="match-venue">${match.venue}, ${match.venueInfo ? `${match.venueInfo.city}, ${match.venueInfo.country}` : ''}</div>
                `;
                
                groupMatchesDiv.appendChild(matchDiv);
            });
            
            matchesContainer.appendChild(groupMatchesDiv);
        });
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
    new WorldCupApp();
});