// Load all necessary files in correct order
const fs = require('fs');
const path = require('path');

// Load data.js content
eval(fs.readFileSync(path.join(__dirname, 'data.js'), 'utf8'));

// Load playoffs.js content  
eval(fs.readFileSync(path.join(__dirname, 'playoffs.js'), 'utf8'));

// Load simulator.js content
eval(fs.readFileSync(path.join(__dirname, 'simulator.js'), 'utf8'));

console.log('=== TEAM ANALYSIS ===');
console.log('QUALIFIED_TEAMS length:', QUALIFIED_TEAMS.length);
console.log('PROJECTED_QUALIFIERS length:', PROJECTED_QUALIFIERS.length);
console.log('PLAYOFF_TEAMS length:', PLAYOFF_TEAMS.length);
console.log('Total initial teams:', QUALIFIED_TEAMS.length + PROJECTED_QUALIFIERS.length + PLAYOFF_TEAMS.length);

console.log('\n=== CONFEDERATION BREAKDOWN (QUALIFIED_TEAMS) ===');
const confCounts = {};
QUALIFIED_TEAMS.forEach(team => {
  confCounts[team.confederation] = (confCounts[team.confederation] || 0) + 1;
});
Object.entries(confCounts).forEach(([conf, count]) => {
  console.log(conf + ':', count);
});

const simulator = new WorldCupDrawSimulator();
console.log('\n=== BEFORE PLAYOFF SIMULATION ===');
console.log('allTeams length:', simulator.allTeams.length);

const beforePots = simulator.getPots();
console.log('Pot sizes before playoffs:');
Object.entries(beforePots).forEach(([pot, teams]) => {
  console.log('Pot', pot + ':', teams.length, 'teams');
});

console.log('\n=== SIMULATING PLAYOFFS ===');
const playoffResults = simulator.simulatePlayoffs();

console.log('\n=== AFTER PLAYOFF SIMULATION ===');
console.log('allTeams length after playoffs:', simulator.allTeams.length);
console.log('Playoff winners:', playoffResults.allWinners.length);

const afterPots = simulator.getPots();
console.log('Pot sizes after playoffs:');
Object.entries(afterPots).forEach(([pot, teams]) => {
  console.log('Pot', pot + ':', teams.length, 'teams');
});

console.log('\n=== CONFEDERATION BREAKDOWN (FINAL TEAMS) ===');
const finalConfCounts = {};
simulator.allTeams.forEach(team => {
  finalConfCounts[team.confederation] = (finalConfCounts[team.confederation] || 0) + 1;
});
Object.entries(finalConfCounts).forEach(([conf, count]) => {
  console.log(conf + ':', count);
});

console.log('\n=== SIMULATION DRAW ===');
const groups = simulator.simulateDraw();

console.log('\n=== GROUP ANALYSIS ===');
Object.entries(groups).forEach(([groupLetter, teams]) => {
  console.log(`Group ${groupLetter}: ${teams.length} teams`);
  teams.forEach((team, index) => {
    console.log(`  ${index + 1}. ${team.name} (${team.confederation})`);
  });
});

console.log('\n=== INCOMPLETE GROUPS ===');
Object.entries(groups).forEach(([groupLetter, teams]) => {
  if (teams.length < 4) {
    console.log(`Group ${groupLetter}: Only ${teams.length} teams!`);
  }
});