// Test the draw simulation to find the issue
const fs = require('fs');

// Load data.js content
eval(fs.readFileSync('./data.js', 'utf8'));

// Load playoffs.js content  
eval(fs.readFileSync('./playoffs.js', 'utf8'));

// Load simulator.js content
eval(fs.readFileSync('./simulator.js', 'utf8'));

console.log('=== TESTING DRAW SIMULATION ===');

// Create simulator and run playoffs
const simulator = new WorldCupDrawSimulator();
console.log('Initial team count:', simulator.allTeams.length);

// Simulate playoffs
const playoffResults = simulator.simulatePlayoffs();
console.log('After playoff simulation:', simulator.allTeams.length);

// Check pot sizes
const pots = simulator.getPots();
console.log('\nPot sizes:');
Object.entries(pots).forEach(([pot, teams]) => {
  console.log(`Pot ${pot}: ${teams.length} teams`);
  if (teams.length !== 12) {
    console.log(`  WARNING: Pot ${pot} should have 12 teams!`);
  }
});

// Check confederation distribution in pots
console.log('\nConfederation distribution by pot:');
for (let potNum = 1; potNum <= 4; potNum++) {
  console.log(`\nPot ${potNum}:`);
  const confCounts = {};
  pots[potNum].forEach(team => {
    confCounts[team.confederation] = (confCounts[team.confederation] || 0) + 1;
  });
  Object.entries(confCounts).forEach(([conf, count]) => {
    console.log(`  ${conf}: ${count}`);
  });
}

// Now simulate the actual draw
console.log('\n=== SIMULATING DRAW ===');
const groups = simulator.simulateDraw();

// Analyze group results
console.log('\n=== GROUP ANALYSIS ===');
let incompleteGroups = 0;
Object.entries(groups).forEach(([groupLetter, teams]) => {
  console.log(`\nGroup ${groupLetter}: ${teams.length}/4 teams`);
  if (teams.length < 4) {
    incompleteGroups++;
    console.log('  ⚠️  INCOMPLETE GROUP!');
  }
  
  teams.forEach((team, index) => {
    console.log(`  ${index + 1}. ${team.name} (${team.confederation})`);
  });
  
  // Check confederation rules
  const confCounts = {};
  teams.forEach(team => {
    confCounts[team.confederation] = (confCounts[team.confederation] || 0) + 1;
  });
  
  // Check for violations
  Object.entries(confCounts).forEach(([conf, count]) => {
    if (conf === 'UEFA' && count > 2) {
      console.log(`  ❌ UEFA violation: ${count} teams (max 2)`);
    } else if (conf !== 'UEFA' && count > 1) {
      console.log(`  ❌ ${conf} violation: ${count} teams (max 1)`);
    }
  });
});

console.log(`\n=== SUMMARY ===`);
console.log(`Incomplete groups: ${incompleteGroups}/12`);
console.log(`Total teams placed: ${Object.values(groups).reduce((sum, teams) => sum + teams.length, 0)}/48`);

// Count remaining teams in pots
let remainingTeams = 0;
Object.values(pots).forEach(potTeams => {
  remainingTeams += potTeams.length;
});
console.log(`Teams remaining in pots: ${remainingTeams}`);

if (incompleteGroups > 0) {
  console.log('\n🔍 DEBUGGING INCOMPLETE GROUPS...');
  
  // Check which confederations are blocking placements
  console.log('\nLet\'s manually check confederation constraints:');
  
  Object.entries(groups).forEach(([groupLetter, teams]) => {
    if (teams.length < 4) {
      console.log(`\nGroup ${groupLetter} (${teams.length}/4):`);
      const confInGroup = {};
      teams.forEach(team => {
        confInGroup[team.confederation] = (confInGroup[team.confederation] || 0) + 1;
      });
      
      console.log('  Current confederations:', Object.entries(confInGroup));
      
      // Check what confederations CAN still be added
      console.log('  Can still add:');
      Object.entries(CONFEDERATIONS).forEach(([conf, info]) => {
        const currentCount = confInGroup[conf] || 0;
        const canAdd = currentCount < info.maxPerGroup;
        console.log(`    ${conf}: ${canAdd ? 'YES' : 'NO'} (current: ${currentCount}, max: ${info.maxPerGroup})`);
      });
    }
  });
}