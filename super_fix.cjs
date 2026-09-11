const fs = require('fs');
const glob = require('fs').readdirSync;

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Remove the stub block
  const stubStart = content.indexOf('// @ts-nocheck\nconst db = {};');
  if (stubStart !== -1) {
    const stubEnd = content.indexOf('const increment = (...args: any[]) => args;\n');
    if (stubEnd !== -1) {
        content = content.slice(0, stubStart) + content.slice(stubEnd + 44);
    }
  }

  // 1. replace `await updateDoc(doc(db, 'collection', id), { data })` 
  // with `await supabase.from('collection').update({ data }).eq('id', id)`
  // We need to handle nested quotes. A regex might be tricky but let's try.
  content = content.replace(/await updateDoc\(\s*doc\s*\(\s*db\s*,\s*['"]([^'"]+)['"]\s*,\s*([^)]+)\s*\)\s*,\s*(\{([^}]+)\})\s*\)/g, 
    "await supabase.from('$1').update($3).eq('id', $2)");
    
  // same for updateDoc with statsRef or similar.
  // Actually, there's statsRef in CommunitySadaqahTracker.tsx.
  
  // 2. replace `await deleteDoc(doc(db, 'collection', id))`
  // with `await supabase.from('collection').delete().eq('id', id)`
  content = content.replace(/await deleteDoc\(\s*doc\s*\(\s*db\s*,\s*['"]([^'"]+)['"]\s*,\s*([^)]+)\s*\)\s*\)/g, 
    "await supabase.from('$1').delete().eq('id', $2)");
    
  // 3. replace `query(supabase.from('collection'), where('field', '==', val), ...)`
  // This is too complex for regex. Let's just fix the few files manually or with specific replace.
  
  if (content !== original) {
      fs.writeFileSync(file, content);
  }
});
