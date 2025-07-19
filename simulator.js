class WorldCupDrawSimulator {
    constructor() {
        this.groups = {};
        this.pots = { 1: [], 2: [], 3: [], 4: [] };
        this.allTeams = [];
        this.playoffSimulator = new PlayoffSimulator();
        this.playoffResults = null;
        this.initializeTeams();
    }

    initializeTeams() {
        // Create teams from qualified and projected teams (initially with placeholders)
        this.allTeams = this.createFullTeamsList();
        this.createPots();
    }

    createFullTeamsList() {
        // If playoffs haven't been simulated yet, use placeholders
        if (!this.playoffResults) {
            const allTeams = [
                ...QUALIFIED_TEAMS,
                ...PROJECTED_QUALIFIERS,
                ...PLAYOFF_TEAMS
            ];
            console.log('🔄 Using placeholder teams, total:', allTeams.length);
            return allTeams.slice(0, 48);
        }
        
        // Use actual playoff winners - NO placeholders
        const allTeams = [
            ...QUALIFIED_TEAMS,
            ...PROJECTED_QUALIFIERS,
            ...this.playoffResults.allWinners
        ];
        
        console.log('🔄 Using actual playoff winners:', this.playoffResults.allWinners.map(w => w.name));
        console.log('🔄 Total teams with playoff winners:', allTeams.length);
        
        // Ensure we have exactly 48 teams
        const finalTeams = allTeams.slice(0, 48);
        console.log('🔄 Final team count:', finalTeams.length);
        console.log('🔄 Playoff winners in final list:', finalTeams.filter(t => t.playoffWinner).map(t => t.name));
        
        return finalTeams;
    }

    // Simulate playoffs first, then create final team list
    simulatePlayoffs() {
        console.log('🎲 Simulating March 2026 Playoffs...');
        this.playoffResults = this.playoffSimulator.simulateAllPlayoffs();
        
        console.log('🔄 Playoff results received:', this.playoffResults.allWinners.map(w => `${w.name} (${w.points})`));
        
        // Recreate teams list with actual playoff winners
        this.allTeams = this.createFullTeamsList();
        console.log('🔄 Updated team list size:', this.allTeams.length);
        console.log('🔄 Playoff winners in team list:', this.allTeams.filter(t => t.playoffWinner).map(t => t.name));
        
        this.createPots();
        
        return this.playoffResults;
    }

    createPots() {
        console.log('Creating pots based on FIFA rankings...');
        
        // Get all teams (including playoff winners) and sort by FIFA ranking points
        const allRankedTeams = this.allTeams
            .filter(team => !team.placeholder) // Remove any remaining placeholders
            .sort((a, b) => b.points - a.points);
        
        console.log('Total teams for pots:', allRankedTeams.length);
        
        // Pot 1: 3 hosts + 9 best teams by ranking
        const hosts = allRankedTeams.filter(team => team.host);
        const nonHostRanked = allRankedTeams.filter(team => !team.host);
        
        console.log('Hosts:', hosts.map(t => t.name));
        console.log('Top non-host teams:', nonHostRanked.slice(0, 10).map(t => `${t.name} (${t.points})`));
        
        // Distribute teams into pots based purely on FIFA rankings
        this.pots[1] = [...hosts, ...nonHostRanked.slice(0, 9)]; // 3 hosts + 9 best
        this.pots[2] = nonHostRanked.slice(9, 21);  // Next 12 teams
        this.pots[3] = nonHostRanked.slice(21, 33); // Next 12 teams  
        this.pots[4] = nonHostRanked.slice(33, 45); // Final 12 teams
        
        console.log('Pot sizes:', 
            'Pot 1:', this.pots[1].length,
            'Pot 2:', this.pots[2].length, 
            'Pot 3:', this.pots[3].length,
            'Pot 4:', this.pots[4].length
        );
        
        // Log playoff winners and their pot placements
        const playoffWinnersInPots = this.allTeams.filter(t => t.playoffWinner);
        if (playoffWinnersInPots.length > 0) {
            console.log('\n🏆 Playoff Winners in Pots:');
            playoffWinnersInPots.forEach(winner => {
                let potNumber = 'Not Found';
                if (this.pots[1].find(t => t.name === winner.name)) potNumber = 1;
                else if (this.pots[2].find(t => t.name === winner.name)) potNumber = 2;
                else if (this.pots[3].find(t => t.name === winner.name)) potNumber = 3;
                else if (this.pots[4].find(t => t.name === winner.name)) potNumber = 4;
                
                console.log(`  ${winner.name} (${winner.points} pts) → Pot ${potNumber}`);
            });
        } else {
            console.log('🚨 No playoff winners found in team list!');
        }
        
        // Log first few teams in each pot
        console.log('\n📋 Pot Contents:');
        for (let pot = 1; pot <= 4; pot++) {
            console.log(`Pot ${pot}: ${this.pots[pot].slice(0, 5).map(t => `${t.name}${t.playoffWinner ? '*' : ''}`).join(', ')}...`);
        }
    }

    simulateDraw() {
        this.groups = {};
        // Initialize groups A-L
        for (let i = 0; i < 12; i++) {
            const groupLetter = String.fromCharCode(65 + i);
            this.groups[groupLetter] = [];
        }

        // Pre-assign hosts
        this.groups['A'].push(this.pots[1].find(team => team.name === 'Mexico'));
        this.groups['B'].push(this.pots[1].find(team => team.name === 'Canada'));
        this.groups['D'].push(this.pots[1].find(team => team.name === 'United States'));

        // Draw remaining Pot 1 teams
        const remainingPot1 = this.pots[1].filter(team => 
            !['Mexico', 'Canada', 'United States'].includes(team.name)
        );
        const availableGroups = ['C', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
        this.shuffleArray(remainingPot1);
        this.shuffleArray(availableGroups);
        
        for (let i = 0; i < remainingPot1.length; i++) {
            this.groups[availableGroups[i]].push(remainingPot1[i]);
        }

        // Draw Pots 2, 3, and 4
        for (let pot = 2; pot <= 4; pot++) {
            this.drawPot(pot);
        }

        return this.groups;
    }

    drawPot(potNumber) {
        console.log(`Drawing Pot ${potNumber}...`);
        const teams = [...this.pots[potNumber]];
        this.shuffleArray(teams);

        for (const team of teams) {
            const availableGroups = this.getAvailableGroups(team);
            if (availableGroups.length === 0) {
                console.warn(`❌ No available groups for ${team.name} (${team.confederation}). Draw may need redistribution.`);
                // Try to find any group with space, ignoring confederation rules temporarily
                const groupsWithSpace = Object.keys(this.groups).filter(g => this.groups[g].length < 4);
                if (groupsWithSpace.length > 0) {
                    const fallbackGroup = groupsWithSpace[0];
                    console.warn(`⚠️ Placing ${team.name} in ${fallbackGroup} as fallback`);
                    this.groups[fallbackGroup].push(team);
                }
                continue;
            }
            
            const randomGroup = availableGroups[Math.floor(Math.random() * availableGroups.length)];
            this.groups[randomGroup].push(team);
            console.log(`✅ ${team.name} (${team.confederation}) → Group ${randomGroup}`);
        }
    }

    getAvailableGroups(team) {
        const groupLetters = Object.keys(this.groups);
        return groupLetters.filter(groupLetter => {
            const group = this.groups[groupLetter];
            
            // Check if group is full
            if (group.length >= 4) return false;
            
            // Check confederation restrictions
            return this.canAddTeamToGroup(team, group);
        });
    }

    canAddTeamToGroup(team, group) {
        if (team.placeholder) return true; // Placeholders can go anywhere
        
        const confederation = team.confederation;
        const confederationInfo = CONFEDERATIONS[confederation];
        
        if (!confederationInfo) return true;
        
        const sameConfederationCount = group.filter(t => t.confederation === confederation).length;
        const maxAllowed = confederationInfo.maxPerGroup;
        
        // Strict enforcement: UEFA can have max 2, all others max 1
        if (confederation === 'UEFA' && sameConfederationCount >= 2) return false;
        if (confederation !== 'UEFA' && sameConfederationCount >= 1) return false;
        
        return true;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    generateMatches() {
        const allMatches = [];
        
        Object.keys(this.groups).forEach(groupLetter => {
            const groupTeams = this.groups[groupLetter];
            const groupMatchTemplate = GROUP_MATCHES[groupLetter];
            
            if (!groupMatchTemplate || groupTeams.length !== 4) return;
            
            const matches = groupMatchTemplate.map(matchTemplate => {
                return {
                    ...matchTemplate,
                    group: groupLetter,
                    team1: this.getTeamNameForPosition(groupLetter, matchTemplate.team1, groupTeams),
                    team2: this.getTeamNameForPosition(groupLetter, matchTemplate.team2, groupTeams),
                    venue: matchTemplate.venue,
                    venueInfo: VENUES[matchTemplate.venue]
                };
            });
            
            allMatches.push(...matches);
        });
        
        return allMatches.sort((a, b) => a.match - b.match);
    }

    getTeamNameForPosition(groupLetter, position, groupTeams) {
        if (position === 'Mexico' || position === 'Canada' || position === 'United States') {
            return position;
        }
        
        // Parse position like 'A2', 'B3', etc.
        const positionNumber = parseInt(position.slice(1));
        if (positionNumber && positionNumber <= groupTeams.length) {
            return groupTeams[positionNumber - 1].name;
        }
        
        // For generic positions like 'C1', 'D2', etc.
        const posIndex = parseInt(position.slice(1)) - 1;
        return groupTeams[posIndex] ? groupTeams[posIndex].name : position;
    }

    getPots() {
        return this.pots;
    }

    getGroups() {
        return this.groups;
    }
}