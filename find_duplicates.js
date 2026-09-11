
import fs from 'fs';

const content = fs.readFileSync('src/components/Explore.tsx', 'utf8');
const idMatches = content.matchAll(/id: '([^']+)'/g);
const ids = Array.from(idMatches).map(m => m[1]);

const counts = {};
ids.forEach(id => {
  counts[id] = (counts[id] || 0) + 1;
});

const duplicates = Object.entries(counts).filter(([id, count]) => count > 1);

if (duplicates.length > 0) {
  console.log('Duplicate IDs found:');
  duplicates.forEach(([id, count]) => {
    console.log(`${id}: ${count} occurrences`);
  });
} else {
  console.log('No duplicate IDs found in strings.');
}

// Now let's find duplicate definition as id: '...' inside an object
const defMatches = content.matchAll(/id:\s*'([^']+)'\s*,/g);
const defIds = Array.from(defMatches).map(m => m[1]);
const defCounts = {};
defIds.forEach(id => {
  defCounts[id] = (defCounts[id] || 0) + 1;
});
const defDuplicates = Object.entries(defCounts).filter(([id, count]) => count > 1);
if (defDuplicates.length > 0) {
  console.log('\nDuplicate ID DEFINTIONS found:');
  defDuplicates.forEach(([id, count]) => {
    console.log(`${id}: ${count} occurrences`);
  });
}
