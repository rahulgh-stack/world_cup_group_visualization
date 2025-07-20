class WorldCupDrawSimulator {
    constructor() {
        this.groups = {};
        this.pots = { 1: [], 2: [], 3: [], 4: [] };
        this.allTeams = [];
        this.playoffSimulator = new PlayoffSimulator();
        this.playoffResults = null;
        this.simulationLog = [];
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

    // Simulate playoffs (March 2026)
    simulatePlayoffs() {
        this.simulationLog = [];
        this.logEntry('🏆 Starting March 2026 Playoff Simulations', 'pot-start');
        
        // Pass logging function to playoff simulator
        this.playoffSimulator.setLogger((message, type) => this.logEntry(message, type));
        this.playoffResults = this.playoffSimulator.simulateAllPlayoffs();
        
        console.log('🔄 Playoff results received:', this.playoffResults.allWinners.map(w => `${w.name} (${w.points})`));
        
        // Recreate teams list with actual playoff winners
        this.logEntry('🔄 Updating team list with playoff winners...', 'validation');
        this.allTeams = this.createFullTeamsList();
        this.logEntry(`📊 Final team count: ${this.allTeams.length} teams`, 'success');
        this.logEntry(`🏆 Playoff winners added: ${this.allTeams.filter(t => t.playoffWinner).map(t => t.name).join(', ')}`, 'success');
        
        this.logEntry('📋 Creating pots based on FIFA rankings...', 'validation');
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
        // Separate playoff winners from other teams - playoff winners ALWAYS go to Pot 4
        const playoffWinners = this.allTeams.filter(team => team.playoffWinner && !team.placeholder);
        const qualifiedTeams = this.allTeams
            .filter(team => !team.placeholder && !team.playoffWinner) // Exclude playoff winners
            .sort((a, b) => b.points - a.points);
        
        this.logEntry(`📊 FIFA Rule: ${playoffWinners.length} playoff winners → Pot 4, ${qualifiedTeams.length} qualified teams by rankings`, 'validation');
        this.logEntry(`🏆 Playoff winners (auto-assigned to Pot 4): ${playoffWinners.map(t => t.name).join(', ')}`, 'constraint');
        
        // Pot 1: 3 hosts + 9 best qualified teams by ranking
        const hosts = qualifiedTeams.filter(team => team.host);
        const nonHostRanked = qualifiedTeams.filter(team => !team.host);
        
        this.logEntry(`🏠 Host nations (pre-assigned to Pot 1): ${hosts.map(t => t.name).join(', ')}`, 'team-drawn');
        
        // Calculate how many spots are left for qualified teams in Pot 4
        const pot4SpotsForQualified = 12 - playoffWinners.length;
        this.logEntry(`📊 Pot 4 distribution: ${playoffWinners.length} playoff winners + ${pot4SpotsForQualified} lowest-ranked qualified teams`, 'normal');
        
        // Distribute qualified teams into pots based purely on FIFA rankings
        this.pots[1] = [...hosts, ...nonHostRanked.slice(0, 9)]; // 3 hosts + 9 best
        this.pots[2] = nonHostRanked.slice(9, 21);  // Next 12 teams
        this.pots[3] = nonHostRanked.slice(21, 33); // Next 12 teams  
        this.pots[4] = [...playoffWinners, ...nonHostRanked.slice(33, 33 + pot4SpotsForQualified)]; // Playoff winners + remaining qualified teams
        
        // Log each pot with key teams
        for (let pot = 1; pot <= 4; pot++) {
            const potTeams = this.pots[pot];
            const potPlayoffWinners = potTeams.filter(t => t.playoffWinner);
            const potHosts = potTeams.filter(t => t.host);
            const potRegularTeams = potTeams.filter(t => !t.playoffWinner && !t.host);
            
            let potDescription = `🎱 Pot ${pot} (${potTeams.length} teams):`;
            if (pot === 1) {
                potDescription += ` 3 hosts + 9 best ranked qualified teams`;
            } else if (pot === 4) {
                potDescription += ` ${potPlayoffWinners.length} playoff winners + ${potRegularTeams.length} lowest-ranked qualified teams`;
            } else {
                const topPoints = potRegularTeams[0]?.points || 0;
                const bottomPoints = potRegularTeams[potRegularTeams.length - 1]?.points || 0;
                potDescription += ` FIFA rankings ${topPoints}-${bottomPoints} pts`;
            }
            
            this.logEntry(potDescription, 'pot-start');
            
            // Show playoff winners in this pot (should only be in Pot 4)
            if (potPlayoffWinners.length > 0) {
                if (pot === 4) {
                    this.logEntry(`   🏆 ALL playoff winners (FIFA rule): ${potPlayoffWinners.map(t => `${t.name} (${t.playoffPath || 'Playoff Winner'})`).join(', ')}`, 'constraint');
                } else {
                    this.logEntry(`   ⚠️ ERROR: Playoff winners in wrong pot: ${potPlayoffWinners.map(t => t.name).join(', ')}`, 'error');
                }
            }
            
            // Show sample teams
            if (pot === 4) {
                // For Pot 4, show playoff winners separately from qualified teams
                if (potRegularTeams.length > 0) {
                    const sampleRegular = potRegularTeams.slice(0, 4);
                    this.logEntry(`   Qualified teams: ${sampleRegular.map(t => t.name).join(', ')}${potRegularTeams.length > 4 ? '...' : ''}`, 'team-drawn');
                }
            } else {
                const sampleTeams = potTeams.slice(0, 6);
                this.logEntry(`   Teams: ${sampleTeams.map(t => `${t.name}${t.host ? ' (Host)' : ''}`).join(', ')}${potTeams.length > 6 ? '...' : ''}`, 'team-drawn');
            }
        }
        
        // Confirm FIFA rule compliance
        this.logEntry('✅ FIFA Rule Compliance: All playoff winners assigned to Pot 4', 'validation');
    }

    simulateDraw() {
        // Don't reset log - keep playoff information
        console.log('✅ simulateDraw method called successfully');
        this.logEntry('🎲 Starting FIFA World Cup 2026 Group Stage Draw', 'pot-start');
        
        this.groups = {};
        // Initialize groups A-L
        for (let i = 0; i < 12; i++) {
            const groupLetter = String.fromCharCode(65 + i);
            this.groups[groupLetter] = [];
        }

        this.logEntry('📋 Initialized 12 groups (A-L)', 'success');

        // Pre-assign hosts
        this.logEntry('🏠 Pre-assigning host nations...', 'pot-start');
        this.groups['A'].push(this.pots[1].find(team => team.name === 'Mexico'));
        this.logEntry('   Mexico → Group A (Host)', 'team-drawn');
        this.groups['B'].push(this.pots[1].find(team => team.name === 'Canada'));
        this.logEntry('   Canada → Group B (Host)', 'team-drawn');
        this.groups['D'].push(this.pots[1].find(team => team.name === 'United States'));
        this.logEntry('   United States → Group D (Host)', 'team-drawn');

        // Draw remaining Pot 1 teams randomly like real FIFA draw
        const remainingPot1 = this.pots[1].filter(team => 
            !['Mexico', 'Canada', 'United States'].includes(team.name)
        );
        const availableGroups = ['C', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
        
        this.logEntry(`🎯 Drawing remaining Pot 1 teams (${remainingPot1.length} teams for ${availableGroups.length} groups)`, 'pot-start');
        
        if (remainingPot1.length !== availableGroups.length) {
            this.logEntry(`❌ CRITICAL: Pot 1 has ${remainingPot1.length} remaining teams but ${availableGroups.length} available groups`, 'error');
        }
        
        // Shuffle teams to make draw random
        this.shuffleArray(remainingPot1);
        
        // Draw each team randomly into available groups
        remainingPot1.forEach(team => {
            // Find groups that still need a Pot 1 team
            const eligibleGroups = availableGroups.filter(groupLetter => 
                this.groups[groupLetter].length === 0
            );
            
            if (eligibleGroups.length === 0) {
                this.logEntry(`❌ NO AVAILABLE GROUPS: ${team.name} cannot be placed`, 'error');
                return;
            }
            
            // Randomly select from available groups
            this.shuffleArray(eligibleGroups);
            const selectedGroup = eligibleGroups[0];
            
            this.groups[selectedGroup].push(team);
            this.logEntry(`   ${team.name} → Group ${selectedGroup}`, 'team-drawn');
            
            // Remove group from available list
            const groupIndex = availableGroups.indexOf(selectedGroup);
            if (groupIndex > -1) {
                availableGroups.splice(groupIndex, 1);
            }
        });

        // Draw Pots 2, 3, and 4
        for (let pot = 2; pot <= 4; pot++) {
            this.drawPot(pot);
        }

        // Final validation and emergency fixes
        this.validateAndFixDraw();
        
        return this.groups;
    }
    
    validateAndFixDraw() {
        this.logEntry('🔍 FINAL VALIDATION: Checking all groups have exactly 4 teams...', 'validation');
        
        const incompleteGroups = Object.keys(this.groups).filter(g => this.groups[g].length !== 4);
        
        if (incompleteGroups.length > 0) {
            this.logEntry(`❌ CRITICAL: ${incompleteGroups.length} groups don't have 4 teams`, 'error');
            incompleteGroups.forEach(g => {
                this.logEntry(`     Group ${g}: ${this.groups[g].length} teams`, 'error');
            });
            
            // EMERGENCY FIX: Balance the groups
            this.logEntry('🚨 Starting emergency group balancing...', 'error');
            this.emergencyBalanceGroups();
            
            // Re-validate
            const stillIncomplete = Object.keys(this.groups).filter(g => this.groups[g].length !== 4);
            if (stillIncomplete.length > 0) {
                this.logEntry(`❌ EMERGENCY FIX FAILED: ${stillIncomplete.length} groups still incomplete`, 'error');
            } else {
                this.logEntry(`⚠️ EMERGENCY FIX SUCCESS: All groups now have 4 teams`, 'success');
            }
        } else {
            this.logEntry(`✅ VALIDATION PASSED: All 12 groups have exactly 4 teams`, 'success');
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
        this.logEntry(`🎱 Drawing Pot ${potNumber} (${this.pots[potNumber].length} teams)`, 'pot-start');
        const availableTeams = [...this.pots[potNumber]];
        
        this.logEntry(`📊 Teams to place: ${availableTeams.length} teams`, 'normal');
        
        // Try to place all teams with backtracking if needed
        const success = this.drawPotWithBacktracking(availableTeams, potNumber);
        
        if (!success) {
            this.logEntry(`❌ CRITICAL: Could not place all teams from Pot ${potNumber} without violations`, 'error');
            // Force place remaining teams (should not happen with good algorithm)
            this.forceCompletePot(availableTeams, potNumber);
        }
        
        // Final validation for this pot
        const finalIncompleteGroups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
            .filter(groupLetter => this.groups[groupLetter].length !== potNumber);
        
        if (finalIncompleteGroups.length > 0) {
            this.logEntry(`❌ POST-POT VALIDATION FAILED: ${finalIncompleteGroups.length} groups don't have ${potNumber} teams`, 'error');
            finalIncompleteGroups.forEach(g => {
                this.logEntry(`     Group ${g}: ${this.groups[g].length} teams (should be ${potNumber})`, 'error');
            });
        } else {
            this.logEntry(`✅ Pot ${potNumber} complete: All groups have exactly ${potNumber} teams`, 'success');
        }
        
        // CRITICAL: Validate confederation constraints for this pot
        this.validateConfederationConstraints(potNumber);
    }
    
    drawPotWithBacktracking(teams, potNumber, placements = []) {
        // Base case: all teams placed successfully
        if (teams.length === 0) {
            // Apply all placements
            placements.forEach(placement => {
                this.groups[placement.group].push(placement.team);
                this.logEntry(`   ${placement.team.name} (${placement.team.confederation}) → Group ${placement.group}`, 'team-drawn');
            });
            return true;
        }
        
        // Get current team to place
        const team = teams[0];
        const remainingTeams = teams.slice(1);
        
        // Find eligible groups for this team
        const currentIncompleteGroups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
            .filter(groupLetter => {
                const currentSize = this.groups[groupLetter].length + 
                    placements.filter(p => p.group === groupLetter).length;
                return currentSize < potNumber;
            });
        
        const eligibleGroups = currentIncompleteGroups.filter(groupLetter => {
            // Create a temporary group state including pending placements
            const tempGroup = [...this.groups[groupLetter]];
            placements.filter(p => p.group === groupLetter).forEach(p => {
                tempGroup.push(p.team);
            });
            
            return this.canAddTeamToGroup(team, tempGroup);
        });
        
        if (eligibleGroups.length === 0) {
            // No valid placement for this team, backtrack
            return false;
        }
        
        // Shuffle to add randomness
        this.shuffleArray(eligibleGroups);
        
        // Try each eligible group
        for (const group of eligibleGroups) {
            const newPlacements = [...placements, { team, group }];
            
            // Recursively try to place remaining teams
            if (this.drawPotWithBacktracking(remainingTeams, potNumber, newPlacements)) {
                return true; // Success!
            }
            // If failed, try next group (backtracking)
        }
        
        // No valid solution found
        return false;
    }
    
    forceCompletePot(teams, potNumber) {
        // Emergency fallback - should rarely be used with good backtracking
        teams.forEach(team => {
            const incompleteGroups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
                .filter(groupLetter => this.groups[groupLetter].length < potNumber);
            
            if (incompleteGroups.length > 0) {
                this.groups[incompleteGroups[0]].push(team);
                this.logEntry(`⚠️ EMERGENCY: ${team.name} → Group ${incompleteGroups[0]} (CONSTRAINT VIOLATION!)`, 'error');
            }
        });
    }
    
    validateConfederationConstraints(potNumber) {
        this.logEntry(`🔍 CONSTRAINT VALIDATION: Checking all groups after Pot ${potNumber}`, 'validation');
        
        let violationsFound = 0;
        
        ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'].forEach(groupLetter => {
            const group = this.groups[groupLetter];
            if (group.length === 0) return;
            
            // Count teams by confederation
            const confederationCounts = {};
            group.forEach(team => {
                if (!team.placeholder) {
                    confederationCounts[team.confederation] = (confederationCounts[team.confederation] || 0) + 1;
                }
            });
            
            // Check violations
            Object.entries(confederationCounts).forEach(([confederation, count]) => {
                const maxAllowed = confederation === 'UEFA' ? 2 : 1;
                if (count > maxAllowed) {
                    violationsFound++;
                    const violatingTeams = group.filter(t => t.confederation === confederation).map(t => t.name);
                    this.logEntry(`❌ VIOLATION: Group ${groupLetter} has ${count} ${confederation} teams (max ${maxAllowed}): ${violatingTeams.join(', ')}`, 'error');
                }
            });
        });
        
        if (violationsFound === 0) {
            this.logEntry(`✅ CONSTRAINT CHECK PASSED: No confederation violations found`, 'success');
        } else {
            this.logEntry(`❌ CONSTRAINT CHECK FAILED: ${violationsFound} violations found!`, 'error');
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
        
        // Count teams from same confederation already in group
        const sameConfederationCount = group.filter(t => t.confederation === confederation).length;
        
        // Apply FIFA confederation rules strictly
        if (confederation === 'UEFA') {
            // UEFA: Maximum 2 teams per group
            if (sameConfederationCount >= 2) {
                console.log(`❌ UEFA limit: Group already has ${sameConfederationCount} UEFA teams, cannot add ${team.name}`);
                return false;
            }
        } else {
            // All other confederations: Maximum 1 team per group
            if (sameConfederationCount >= 1) {
                const existingTeam = group.find(t => t.confederation === confederation);
                console.log(`❌ ${confederation} limit: Group already has ${existingTeam.name}, cannot add ${team.name}`);
                return false;
            }
        }
        
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
    
    logEntry(message, type = 'normal') {
        this.simulationLog.push({ message, type, timestamp: new Date().toLocaleTimeString() });
    }
    
    getSimulationLog() {
        return this.simulationLog;
    }

    getGroups() {
        return this.groups;
    }
}