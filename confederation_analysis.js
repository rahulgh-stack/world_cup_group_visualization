// Analyze the confederation distribution issue
const fs = require('fs');

// Load data.js content to get team rankings
eval(fs.readFileSync('./data.js', 'utf8'));

console.log('=== CONFEDERATION DISTRIBUTION BY RANKING ===');

// Simulate what the pot allocation would look like
// Get all teams (using qualified teams + representative playoff winners based on rankings)

// For analysis, let's use qualified teams + simulate some playoff winners
const simulatedPlayoffWinners = [
    { name: 'Italy', confederation: 'UEFA', points: 1702.58, playoffWinner: true },
    { name: 'Poland', confederation: 'UEFA', points: 1502.40, playoffWinner: true },  
    { name: 'Scotland', confederation: 'UEFA', points: 1474.68, playoffWinner: true },
    { name: 'Romania', confederation: 'UEFA', points: 1474.46, playoffWinner: true },
    { name: 'Senegal', confederation: 'CAF', points: 1635.10, playoffWinner: true },
    { name: 'Venezuela', confederation: 'CONMEBOL', points: 1477.02, playoffWinner: true }
];

const allTeams = [...QUALIFIED_TEAMS, ...simulatedPlayoffWinners];
console.log('Total teams for analysis:', allTeams.length);

// Sort by points (FIFA ranking)
const rankedTeams = allTeams.sort((a, b) => b.points - a.points);

// Separate hosts and non-hosts
const hosts = rankedTeams.filter(team => team.host);
const nonHosts = rankedTeams.filter(team => !team.host);

console.log('\nHosts:', hosts.map(t => `${t.name} (${t.confederation})`));

// Create pots exactly like the simulator
const pots = {
    1: [...hosts, ...nonHosts.slice(0, 9)],
    2: nonHosts.slice(9, 21),
    3: nonHosts.slice(21, 33), 
    4: nonHosts.slice(33, 45)
};

// Analyze confederation distribution by pot
console.log('\n=== POT CONFEDERATION BREAKDOWN ===');
for (let potNum = 1; potNum <= 4; potNum++) {
    console.log(`\nPot ${potNum} (${pots[potNum].length} teams):`);
    
    const confCounts = {};
    pots[potNum].forEach(team => {
        confCounts[team.confederation] = (confCounts[team.confederation] || 0) + 1;
    });
    
    Object.entries(confCounts).forEach(([conf, count]) => {
        console.log(`  ${conf}: ${count} teams`);
    });
    
    // Show actual teams
    console.log('  Teams:', pots[potNum].map(t => `${t.name}(${t.confederation})`).join(', '));
}

// Check for potential draw issues
console.log('\n=== POTENTIAL DRAW ISSUES ===');

// The key issue: if too many teams from the same confederation are in the same pot
// and get drawn early, they might block later placements

// Simulate what happens if we try to place teams following FIFA draw order
console.log('\nSimulating draw constraints:');

// For each pot, check if the confederation distribution could cause issues
for (let potNum = 2; potNum <= 4; potNum++) {
    console.log(`\nPot ${potNum} analysis:`);
    const confCounts = {};
    pots[potNum].forEach(team => {
        confCounts[team.confederation] = (confCounts[team.confederation] || 0) + 1;
    });
    
    // Check if any confederation has too many teams for available group slots
    Object.entries(confCounts).forEach(([conf, count]) => {
        const maxPerGroup = CONFEDERATIONS[conf].maxPerGroup;
        const maxPossiblePlacements = 12 * maxPerGroup; // 12 groups × max per group
        
        if (count > maxPossiblePlacements) {
            console.log(`  ⚠️ ${conf}: ${count} teams but only ${maxPossiblePlacements} slots available!`);
        } else if (conf !== 'UEFA' && count > 12) {
            console.log(`  ⚠️ ${conf}: ${count} teams but only 12 groups (max 1 per group)!`);
        } else if (conf === 'UEFA' && count > 24) {
            console.log(`  ⚠️ ${conf}: ${count} teams but only 24 slots (max 2 per group)!`);
        } else {
            console.log(`  ✅ ${conf}: ${count} teams fits in available slots`);
        }
    });
}

// Special focus on UEFA distribution 
console.log('\n=== UEFA DISTRIBUTION ANALYSIS ===');
const uefaByPot = {};
for (let potNum = 1; potNum <= 4; potNum++) {
    uefaByPot[potNum] = pots[potNum].filter(t => t.confederation === 'UEFA').length;
    console.log(`Pot ${potNum}: ${uefaByPot[potNum]} UEFA teams`);
}

const totalUefa = Object.values(uefaByPot).reduce((sum, count) => sum + count, 0);
console.log(`Total UEFA teams: ${totalUefa}/16 expected`);

if (totalUefa !== 16) {
    console.log('❌ UEFA count mismatch! Expected 16 teams.');
}