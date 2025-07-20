class PlayoffSimulator {
    constructor() {
        this.uefaWinners = [];
        this.intercontinentalWinners = [];
    }

    // Calculate win probability based on FIFA rankings
    calculateWinProbability(team1Points, team2Points) {
        // Higher points = better team
        const pointsDiff = team1Points - team2Points;
        
        // Base probability is 50-50
        let team1Prob = 0.5;
        
        // Adjust based on ranking difference (max adjustment ±40%)
        const maxAdjustment = 0.4;
        const scaleFactor = 0.002; // How much each point matters
        
        const adjustment = Math.tanh(pointsDiff * scaleFactor) * maxAdjustment;
        team1Prob += adjustment;
        
        // Ensure probabilities stay between 10% and 90%
        team1Prob = Math.max(0.1, Math.min(0.9, team1Prob));
        
        return {
            team1: team1Prob,
            team2: 1 - team1Prob
        };
    }

    // Simulate a single match - higher FIFA points always wins but display probability
    simulateMatch(team1, team2) {
        const probs = this.calculateWinProbability(team1.points, team2.points);
        
        // CHANGED: Instead of random, higher points always wins
        const winner = team1.points >= team2.points ? team1 : team2;
        const loser = winner === team1 ? team2 : team1;
        const winnerProb = winner === team1 ? probs.team1 : probs.team2;
        
        return {
            winner,
            loser,
            probability: winnerProb,
            matchup: `${team1.name} vs ${team2.name}`,
            result: `${winner.name} wins (${Math.round(winnerProb * 100)}% probability)`
        };
    }

    // Simulate UEFA playoffs with exact realistic brackets (4 paths, 4 winners)
    simulateUEFAPlayoffs() {
        console.log('🏆 Simulating UEFA Playoffs with Realistic Brackets...');
        
        // Final realistic playoff paths with proper seeding
        const playoffPaths = {
            'A': {
                teams: [
                    UEFA_PLAYOFF_TEAMS.find(t => t.name === 'Italy'),
                    UEFA_PLAYOFF_TEAMS.find(t => t.name === 'Sweden'),
                    UEFA_PLAYOFF_TEAMS.find(t => t.name === 'Hungary'),
                    UEFA_PLAYOFF_TEAMS.find(t => t.name === 'Israel')
                ],
                semis: [
                    { home: 'Italy', away: 'Israel' },
                    { home: 'Sweden', away: 'Hungary' }
                ]
            },
            'B': {
                teams: [
                    UEFA_PLAYOFF_TEAMS.find(t => t.name === 'Austria'),
                    UEFA_PLAYOFF_TEAMS.find(t => t.name === 'Wales'),
                    UEFA_PLAYOFF_TEAMS.find(t => t.name === 'Greece'),
                    UEFA_PLAYOFF_TEAMS.find(t => t.name === 'Albania')
                ],
                semis: [
                    { home: 'Austria', away: 'Albania' },
                    { home: 'Wales', away: 'Greece' }
                ]
            },
            'C': {
                teams: [
                    UEFA_PLAYOFF_TEAMS.find(t => t.name === 'Ukraine'),
                    UEFA_PLAYOFF_TEAMS.find(t => t.name === 'Serbia'),
                    UEFA_PLAYOFF_TEAMS.find(t => t.name === 'Scotland'),
                    UEFA_PLAYOFF_TEAMS.find(t => t.name === 'Slovakia')
                ],
                semis: [
                    { home: 'Ukraine', away: 'Slovakia' },
                    { home: 'Serbia', away: 'Scotland' }
                ]
            },
            'D': {
                teams: [
                    UEFA_PLAYOFF_TEAMS.find(t => t.name === 'Turkey'),
                    UEFA_PLAYOFF_TEAMS.find(t => t.name === 'Poland'),
                    UEFA_PLAYOFF_TEAMS.find(t => t.name === 'Romania'),
                    UEFA_PLAYOFF_TEAMS.find(t => t.name === 'Slovenia')
                ],
                semis: [
                    { home: 'Turkey', away: 'Slovenia' },
                    { home: 'Poland', away: 'Romania' }
                ]
            }
        };

        const results = [];
        
        Object.entries(playoffPaths).forEach(([pathLetter, pathData]) => {
            console.log(`\n🔥 UEFA Playoff Path ${pathLetter}:`);
            console.log(`  Teams: ${pathData.teams.map(t => t.name).join(', ')}`);
            
            // Simulate semi-finals with exact matchups
            const semi1Team1 = pathData.teams.find(t => t.name === pathData.semis[0].home);
            const semi1Team2 = pathData.teams.find(t => t.name === pathData.semis[0].away);
            const semi2Team1 = pathData.teams.find(t => t.name === pathData.semis[1].home);
            const semi2Team2 = pathData.teams.find(t => t.name === pathData.semis[1].away);
            
            const semi1 = this.simulateMatch(semi1Team1, semi1Team2);
            const semi2 = this.simulateMatch(semi2Team1, semi2Team2);
            
            console.log(`  Semi 1: ${semi1.result}`);
            console.log(`  Semi 2: ${semi2.result}`);
            
            // Final: Winners of semi-finals
            const final = this.simulateMatch(semi1.winner, semi2.winner);
            console.log(`  Final: ${final.result}`);
            
            const pathWinner = {
                ...final.winner,
                playoffWinner: true,
                playoffPath: `UEFA Path ${pathLetter}`
            };
            
            this.uefaWinners.push(pathWinner);
            
            results.push({
                path: pathLetter,
                teams: pathData.teams.map(t => t.name),
                semiFinals: [semi1, semi2],
                final: final,
                winner: pathWinner
            });
        });
        
        console.log(`UEFA Playoff Winners: ${this.uefaWinners.map(w => w.name).join(', ')}`);
        return results;
    }

    // Simulate inter-confederation playoffs with exact realistic brackets
    simulateIntercontinentalPlayoffs() {
        console.log('\n🌍 Simulating Inter-confederation Playoffs with Realistic Brackets...');
        
        // Exact teams from realistic qualification scenario
        const playoffTeams = [...INTERCONTINENTAL_PLAYOFF_TEAMS];
        
        console.log('Playoff participants:');
        playoffTeams.forEach(team => {
            console.log(`  ${team.name} (${team.confederation}) - ${team.playoffSlot}`);
        });
        
        // Exact bracket structure from realistic scenario
        // BRACKET 1: Honduras vs New Caledonia, winner vs Senegal
        // BRACKET 2: UAE vs Curaçao, winner vs Venezuela
        
        const senegal = playoffTeams.find(t => t.name === 'Senegal');
        const venezuela = playoffTeams.find(t => t.name === 'Venezuela');
        const uae = playoffTeams.find(t => t.name === 'UAE');
        const honduras = playoffTeams.find(t => t.name === 'Honduras');
        const curacao = playoffTeams.find(t => t.name === 'Curaçao');
        const newCaledonia = playoffTeams.find(t => t.name === 'New Caledonia');
        
        // Bracket 1: Honduras vs New Caledonia
        console.log(`\nBracket 1 - Semi-final:`);
        const bracket1Semi = this.simulateMatch(honduras, newCaledonia);
        console.log(`  ${bracket1Semi.result}`);
        
        // Bracket 1 Final: Winner vs Senegal (seeded)
        console.log(`\nBracket 1 - Final:`);
        const bracket1Final = this.simulateMatch(senegal, bracket1Semi.winner);
        console.log(`  ${bracket1Final.result} (advances to World Cup)`);
        
        // Bracket 2: UAE vs Curaçao
        console.log(`\nBracket 2 - Semi-final:`);
        const bracket2Semi = this.simulateMatch(uae, curacao);
        console.log(`  ${bracket2Semi.result}`);
        
        // Bracket 2 Final: Winner vs Venezuela (seeded)
        console.log(`\nBracket 2 - Final:`);
        const bracket2Final = this.simulateMatch(venezuela, bracket2Semi.winner);
        console.log(`  ${bracket2Final.result} (advances to World Cup)`);
        
        // Both bracket winners qualify for World Cup
        const winner1 = {
            ...bracket1Final.winner,
            playoffWinner: true,
            playoffType: 'Inter-confederation'
        };
        
        const winner2 = {
            ...bracket2Final.winner,
            playoffWinner: true,
            playoffType: 'Inter-confederation'
        };
        
        this.intercontinentalWinners = [winner1, winner2];
        
        console.log(`\n✅ Inter-confederation Playoff Winners:`);
        console.log(`  ${winner1.name} (${winner1.confederation})`);
        console.log(`  ${winner2.name} (${winner2.confederation})`);
        
        return {
            participants: playoffTeams,
            semiFinals: [
                { path: 1, firstMatch: bracket1Semi, final: bracket1Final, winner: winner1 },
                { path: 2, firstMatch: bracket2Semi, final: bracket2Final, winner: winner2 }
            ],
            winners: [winner1, winner2]
        };
    }

    // No longer needed - using exact teams from realistic scenario
    selectIntercontinentalTeams() {
        // This method is deprecated - exact teams are now defined in INTERCONTINENTAL_PLAYOFF_TEAMS
        return [...INTERCONTINENTAL_PLAYOFF_TEAMS];
    }

    // Simulate all playoffs and return combined results
    simulateAllPlayoffs() {
        console.log('🚀 Starting Playoff Simulations...\n');
        
        // Reset winners arrays
        this.uefaWinners = [];
        this.intercontinentalWinners = [];
        
        const uefaResults = this.simulateUEFAPlayoffs();
        const intercontinentalResults = this.simulateIntercontinentalPlayoffs();
        
        // Create final playoff winners array to replace placeholders
        const allPlayoffWinners = [
            ...this.uefaWinners,
            ...this.intercontinentalWinners
        ];
        
        console.log('\n🎉 All Playoff Winners:');
        allPlayoffWinners.forEach((winner, index) => {
            console.log(`  ${index + 1}. ${winner.name} (${winner.confederation}) - ${winner.points} pts`);
        });
        
        return {
            uefa: uefaResults,
            intercontinental: intercontinentalResults,
            allWinners: allPlayoffWinners
        };
    }

    // Get final list of all qualified teams (including playoff winners)
    getFinalQualifiedTeams() {
        return [
            ...QUALIFIED_TEAMS,
            ...PROJECTED_QUALIFIERS,
            ...this.uefaWinners,
            ...this.intercontinentalWinners
        ];
    }

    // Helper function to shuffle array
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}