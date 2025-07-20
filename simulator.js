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
        this.testEdgeCases();
        
        return this.playoffResults;
    }

    testEdgeCases() {
        console.log('\n🧪 Testing 5 Extreme Edge Cases...');
        
        // Edge Case 1: UEFA Overflow - What if 10 UEFA teams are in Pot 4?
        const uefaInPot4 = this.pots[4].filter(t => t.confederation === 'UEFA').length;
        console.log(`🛑 Edge Case 1 - UEFA in Pot 4: ${uefaInPot4} teams`);
        if (uefaInPot4 > 8) {
            console.warn(`⚠️ Risk: Too many UEFA teams in Pot 4 could cause placement issues`);
        }
        
        // Edge Case 2: CAF Clustering - Are all CAF teams in one pot?
        const cafDistribution = [1,2,3,4].map(pot => 
            this.pots[pot].filter(t => t.confederation === 'CAF').length
        );
        console.log(`🌍 Edge Case 2 - CAF distribution: Pot1:${cafDistribution[0]}, Pot2:${cafDistribution[1]}, Pot3:${cafDistribution[2]}, Pot4:${cafDistribution[3]}`);
        const maxCafInOnePot = Math.max(...cafDistribution);
        if (maxCafInOnePot > 6) {
            console.warn(`⚠️ Risk: ${maxCafInOnePot} CAF teams in one pot could cause issues`);
        }
        
        // Edge Case 3: Host Ripple Effect - How many CONCACAF teams per pot?
        const concacafDistribution = [1,2,3,4].map(pot => 
            this.pots[pot].filter(t => t.confederation === 'CONCACAF').length
        );
        console.log(`🌎 Edge Case 3 - CONCACAF distribution: Pot1:${concacafDistribution[0]}, Pot2:${concacafDistribution[1]}, Pot3:${concacafDistribution[2]}, Pot4:${concacafDistribution[3]}`);
        
        // Edge Case 4: Single Team Confederations - OFC isolation
        const ofcTeams = this.allTeams.filter(t => t.confederation === 'OFC');
        console.log(`🌊 Edge Case 4 - OFC teams: ${ofcTeams.length} (${ofcTeams.map(t => t.name).join(', ')})`);
        if (ofcTeams.length === 1) {
            const ofcPot = [1,2,3,4].find(pot => this.pots[pot].some(t => t.confederation === 'OFC'));
            console.log(`🚨 Single OFC team in Pot ${ofcPot}`);
        }
        
        // Edge Case 5: Mathematical Constraints - Total teams by confederation
        const confederationTotals = {};
        this.allTeams.forEach(team => {
            confederationTotals[team.confederation] = (confederationTotals[team.confederation] || 0) + 1;
        });
        
        console.log(`📊 Edge Case 5 - Total confederation counts:`);
        Object.keys(confederationTotals).forEach(conf => {
            const count = confederationTotals[conf];
            const maxSlots = conf === 'UEFA' ? 24 : 12; // UEFA can have 2 per group, others 1
            console.log(`  ${conf}: ${count} teams (max possible: ${maxSlots})`);
            if (count > maxSlots) {
                console.error(`❌ IMPOSSIBLE: ${conf} has ${count} teams but only ${maxSlots} slots available!`);
            }
        });
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

        // Draw remaining Pot 1 teams using FIFA procedure  
        const remainingPot1 = this.pots[1].filter(team => 
            !['Mexico', 'Canada', 'United States'].includes(team.name)
        );
        const availableGroups = ['C', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
        
        if (remainingPot1.length !== availableGroups.length) {
            console.error(`❌ CRITICAL: Pot 1 has ${remainingPot1.length} remaining teams but ${availableGroups.length} available groups`);
        }
        
        // Shuffle both arrays to ensure randomness
        this.shuffleArray(remainingPot1);
        this.shuffleArray(availableGroups);
        
        // Assign one team to each group
        for (let i = 0; i < Math.min(availableGroups.length, remainingPot1.length); i++) {
            this.groups[availableGroups[i]].push(remainingPot1[i]);
            console.log(`🎯 Group ${availableGroups[i]}: ${remainingPot1[i].name} (Pot 1)`);
        }

        // Draw Pots 2, 3, and 4
        for (let pot = 2; pot <= 4; pot++) {
            this.drawPot(pot);
        }

        // Final validation and emergency fixes
        this.validateAndFixDraw();
        
        return this.groups;
    }
    
    validateAndFixDraw() {
        console.log('\n🔍 FINAL VALIDATION: Checking all groups have exactly 4 teams...');
        
        const incompleteGroups = Object.keys(this.groups).filter(g => this.groups[g].length !== 4);
        
        if (incompleteGroups.length > 0) {
            console.error(`❌ CRITICAL: ${incompleteGroups.length} groups don't have 4 teams`);
            incompleteGroups.forEach(g => {
                console.error(`  Group ${g}: ${this.groups[g].length} teams`);
            });
            
            // EMERGENCY FIX: Balance the groups
            this.emergencyBalanceGroups();
            
            // Re-validate
            const stillIncomplete = Object.keys(this.groups).filter(g => this.groups[g].length !== 4);
            if (stillIncomplete.length > 0) {
                console.error(`❌ EMERGENCY FIX FAILED: ${stillIncomplete.length} groups still incomplete`);
            } else {
                console.warn(`⚠️ EMERGENCY FIX SUCCESS: All groups now have 4 teams`);
            }
        } else {
            console.log(`✅ VALIDATION PASSED: All 12 groups have exactly 4 teams`);
        }
        
        // Final summary
        const totalTeams = Object.values(this.groups).reduce((sum, group) => sum + group.length, 0);
        console.log(`📊 FINAL SUMMARY: ${totalTeams}/48 teams placed in ${Object.keys(this.groups).length} groups`);
    }
    
    emergencyBalanceGroups() {
        console.log(`⚠️ EMERGENCY BALANCE: Attempting to fix incomplete groups...`);
        
        // Collect all teams and redistribute
        const allTeams = [];
        Object.keys(this.groups).forEach(groupLetter => {
            allTeams.push(...this.groups[groupLetter]);
            this.groups[groupLetter] = []; // Clear all groups
        });
        
        console.log(`🔄 Collected ${allTeams.length} teams for redistribution`);
        
        // Redistribute teams evenly (4 per group)
        const groupLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
        
        for (let i = 0; i < allTeams.length; i++) {
            const groupIndex = Math.floor(i / 4);
            if (groupIndex < groupLetters.length) {
                this.groups[groupLetters[groupIndex]].push(allTeams[i]);
            } else {
                // If we have extra teams, distribute them round-robin
                const extraGroupIndex = i % groupLetters.length;
                this.groups[groupLetters[extraGroupIndex]].push(allTeams[i]);
            }
        }
        
        console.log(`⚡ REDISTRIBUTION COMPLETE`);
        groupLetters.forEach(letter => {
            console.log(`  Group ${letter}: ${this.groups[letter].length} teams`);
        });
    }

    drawPot(potNumber) {
        console.log(`🎱 Drawing Pot ${potNumber} - FIFA Style...`);
        const availableTeams = [...this.pots[potNumber]];
        
        // CRITICAL: Ensure every group gets exactly 1 team from this pot
        const incompleteGroups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
            .filter(groupLetter => this.groups[groupLetter].length < potNumber);
        
        console.log(`📊 Pot ${potNumber}: ${availableTeams.length} teams for ${incompleteGroups.length} groups`);
        
        // Validate we have the right number of teams
        if (availableTeams.length !== incompleteGroups.length) {
            console.error(`❌ POT SIZE MISMATCH: Pot ${potNumber} has ${availableTeams.length} teams but ${incompleteGroups.length} groups need teams`);
            
            if (availableTeams.length < incompleteGroups.length) {
                console.error(`❌ NOT ENOUGH TEAMS: Missing ${incompleteGroups.length - availableTeams.length} teams for complete groups`);
            }
        }
        
        // Use constrained placement algorithm
        const placements = this.solveConstrainedPlacement(availableTeams, incompleteGroups);
        
        // GUARANTEE: Every group must get exactly one team
        if (placements.length !== incompleteGroups.length) {
            console.error(`❌ CRITICAL FAILURE: Could only place ${placements.length}/${incompleteGroups.length} teams from Pot ${potNumber}`);
            
            // Emergency: Fill remaining groups with any available teams
            const unfilledGroups = incompleteGroups.filter(g => !placements.find(p => p.group === g));
            const unplacedTeams = availableTeams.filter(t => !placements.find(p => p.team === t));
            
            console.warn(`⚠️ EMERGENCY FILL: ${unfilledGroups.length} groups need emergency team placement`);
            
            for (let i = 0; i < Math.min(unfilledGroups.length, unplacedTeams.length); i++) {
                const emergencyPlacement = { team: unplacedTeams[i], group: unfilledGroups[i] };
                placements.push(emergencyPlacement);
                console.warn(`⚠️ EMERGENCY: ${unplacedTeams[i].name} → Group ${unfilledGroups[i]} (constraint violation)`);
            }
        }
        
        // Execute placements
        placements.forEach(placement => {
            this.groups[placement.group].push(placement.team);
            console.log(`🎯 Group ${placement.group}: ${placement.team.name} (${placement.team.confederation}) from Pot ${potNumber}`);
        });
        
        // Final validation for this pot
        const finalIncompleteGroups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
            .filter(groupLetter => this.groups[groupLetter].length !== potNumber);
        
        if (finalIncompleteGroups.length > 0) {
            console.error(`❌ POST-POT VALIDATION FAILED: ${finalIncompleteGroups.length} groups don't have ${potNumber} teams`);
            finalIncompleteGroups.forEach(g => {
                console.error(`  Group ${g}: ${this.groups[g].length} teams (should be ${potNumber})`);
            });
        } else {
            console.log(`✅ Pot ${potNumber} complete: All groups have exactly ${potNumber} teams`);
        }
    }
    
    solveConstrainedPlacement(teams, groups) {
        const placements = [];
        const availableTeams = [...teams];
        const availableGroups = [...groups];
        
        console.log(`🧪 Starting constrained placement: ${availableTeams.length} teams for ${availableGroups.length} groups`);
        
        // First pass: Standard greedy assignment with most constrained first
        while (availableGroups.length > 0 && availableTeams.length > 0) {
            let placed = false;
            
            // Find the most constrained group (fewest eligible teams)
            let bestGroup = null;
            let bestEligibleTeams = [];
            let minOptions = Infinity;
            
            for (const group of availableGroups) {
                const eligibleTeams = availableTeams.filter(team => 
                    this.canAddTeamToGroup(team, this.groups[group])
                );
                
                if (eligibleTeams.length > 0 && eligibleTeams.length < minOptions) {
                    minOptions = eligibleTeams.length;
                    bestGroup = group;
                    bestEligibleTeams = eligibleTeams;
                }
            }
            
            if (bestGroup && bestEligibleTeams.length > 0) {
                // Among eligible teams for this group, pick the most constrained team
                const teamWithOptions = bestEligibleTeams.map(team => ({
                    team,
                    options: availableGroups.filter(g => 
                        this.canAddTeamToGroup(team, this.groups[g])
                    ).length
                }));
                
                teamWithOptions.sort((a, b) => a.options - b.options);
                const chosenTeam = teamWithOptions[0].team;
                
                placements.push({ team: chosenTeam, group: bestGroup });
                availableTeams.splice(availableTeams.indexOf(chosenTeam), 1);
                availableGroups.splice(availableGroups.indexOf(bestGroup), 1);
                placed = true;
                
                console.log(`✅ Placed ${chosenTeam.name} (${chosenTeam.confederation}) in Group ${bestGroup}`);
            }
            
            if (!placed) {
                console.error(`❌ CRITICAL: Cannot place any remaining teams in available groups`);
                console.error(`Remaining teams:`, availableTeams.map(t => `${t.name}(${t.confederation})`));
                console.error(`Remaining groups:`, availableGroups);
                
                // Emergency fallback: Force placement ignoring some constraints
                if (availableGroups.length > 0 && availableTeams.length > 0) {
                    const fallbackTeam = availableTeams[0];
                    const fallbackGroup = availableGroups[0];
                    
                    console.warn(`⚠️ FALLBACK: Force placing ${fallbackTeam.name} in Group ${fallbackGroup}`);
                    placements.push({ team: fallbackTeam, group: fallbackGroup });
                    availableTeams.splice(0, 1);
                    availableGroups.splice(0, 1);
                }
                break;
            }
        }
        
        // Handle any remaining unplaced teams
        if (availableTeams.length > 0) {
            console.error(`❌ UNPLACED TEAMS: ${availableTeams.length} teams could not be placed`);
            availableTeams.forEach(team => {
                console.error(`  - ${team.name} (${team.confederation})`);
            });
        }
        
        if (availableGroups.length > 0) {
            console.error(`❌ INCOMPLETE GROUPS: ${availableGroups.length} groups will be incomplete`);
            availableGroups.forEach(group => {
                console.error(`  - Group ${group} (currently ${this.groups[group].length} teams)`);
            });
        }
        
        console.log(`🏁 Placement complete: ${placements.length} successful placements`);
        return placements;
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