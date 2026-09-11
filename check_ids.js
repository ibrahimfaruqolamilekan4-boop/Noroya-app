
const fs = require('fs');
const content = fs.readFileSync('src/components/Explore.tsx', 'utf8');
const matches = content.match(/id: '(.*?)'/g);
if (matches) {
    const ids = matches.map(m => m.match(/'(.*?)'/)[1]);
    const counts = {};
    ids.forEach(id => {
        counts[id] = (counts[id] || 0) + 1;
    });
    for (const id in counts) {
        if (counts[id] > 1) {
            console.log(`Duplicate ID found: ${id} (${counts[id]} times)`);
        }
    }
} else {
    console.log('No IDs found');
}
