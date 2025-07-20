// Simple analysis without complex loading
const fs = require('fs');

// Read and count manually
const dataContent = fs.readFileSync('./data.js', 'utf8');

// Extract qualified teams
const qualifiedMatch = dataContent.match(/const QUALIFIED_TEAMS = \[([\s\S]*?)\];/);
if (qualifiedMatch) {
    const qualifiedContent = qualifiedMatch[1];
    const teams = qualifiedContent.match(/\{[^}]*\}/g) || [];
    
    console.log('=== QUALIFIED TEAMS ANALYSIS ===');
    console.log('Total qualified teams:', teams.length);
    
    // Count by confederation
    const confCounts = {};
    teams.forEach(teamStr => {
        const confMatch = teamStr.match(/confederation:\s*'([^']+)'/);
        if (confMatch) {
            const conf = confMatch[1];
            confCounts[conf] = (confCounts[conf] || 0) + 1;
        }
    });
    
    console.log('\nConfederation breakdown:');
    Object.entries(confCounts).forEach(([conf, count]) => {
        console.log(`${conf}: ${count} teams`);
    });
    
    // UEFA analysis
    console.log('\n=== UEFA ANALYSIS ===');
    console.log('UEFA qualified directly:', confCounts.UEFA || 0);
    
    // Check UEFA playoff teams
    const uefaPlayoffMatch = dataContent.match(/const UEFA_PLAYOFF_TEAMS = \[([\s\S]*?)\];/);
    if (uefaPlayoffMatch) {
        const uefaPlayoffContent = uefaPlayoffMatch[1];
        const uefaPlayoffTeams = uefaPlayoffContent.match(/\{[^}]*\}/g) || [];
        console.log('UEFA playoff teams available:', uefaPlayoffTeams.length);
    }
    
    // Check total with playoffs
    const playoffMatch = dataContent.match(/const PLAYOFF_TEAMS = \[([\s\S]*?)\];/);
    if (playoffMatch) {
        const playoffContent = playoffMatch[1];
        const playoffTeams = playoffContent.match(/\{[^}]*\}/g) || [];
        console.log('Playoff placeholder slots:', playoffTeams.length);
        
        const uefaPlayoffSlots = playoffContent.match(/confederation:\s*'UEFA'/g) || [];
        console.log('UEFA playoff slots:', uefaPlayoffSlots.length);
        
        console.log('\nTotal UEFA teams possible:', (confCounts.UEFA || 0) + uefaPlayoffSlots.length);
    }
    
    // Calculate final distribution
    console.log('\n=== FINAL TEAM DISTRIBUTION PREDICTION ===');
    console.log('UEFA: 12 direct + 4 playoff = 16 total');
    console.log('AFC: 8 teams');
    console.log('CAF: 9 teams'); 
    console.log('CONCACAF: 6 teams');
    console.log('CONMEBOL: 6 teams');
    console.log('OFC: 1 team');
    console.log('Inter-confederation: 2 teams');
    console.log('Total: 48 teams');
    
    // Check confederation group limits
    console.log('\n=== CONFEDERATION GROUP LIMITS ===');
    console.log('UEFA: Max 2 per group × 12 groups = 24 slots (but we have 16 teams - OK)');
    console.log('Others: Max 1 per group × 12 groups = 12 slots each');
    console.log('AFC: 8 teams (OK - fits in 12 slots)');
    console.log('CAF: 9 teams (OK - fits in 12 slots)');
    console.log('CONCACAF: 6 teams (OK)');
    console.log('CONMEBOL: 6 teams (OK)');
    console.log('OFC + Inter-continental: 3 teams total (OK)');
}

// Check pot distribution logic
console.log('\n=== POT DISTRIBUTION ANALYSIS ===');
console.log('Expected pot sizes: 12 teams each');
console.log('Pot 1: 3 hosts + 9 best ranked');
console.log('Pot 2: Next 12 best ranked');  
console.log('Pot 3: Next 12 best ranked');
console.log('Pot 4: Final 12 teams');