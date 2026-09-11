const fs = require('fs');

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

  // Replace auth.currentUser.uid with user?.id
  if (content.includes('auth.currentUser')) {
      content = content.replace(/auth\.currentUser\.uid/g, "user?.id");
      content = content.replace(/auth\.currentUser\.displayName/g, "user?.user_metadata?.full_name");
      content = content.replace(/auth\.currentUser/g, "user");
      
      // We need to make sure useAuth is imported and called.
      if (!content.includes('useAuth')) {
          content = "import { useAuth } from '../context/AuthContext';\n" + content;
      }
      
      // Inject const { user } = useAuth(); at the beginning of the component
      // We can use a regex to find the component definition
      content = content.replace(/export const (\w+)\s*=\s*\([^)]*\)\s*=>\s*\{/, "export const $1 = () => {\n  const { user } = useAuth();\n");
      // For components like `export default function ...`
      content = content.replace(/export default function (\w+)\s*\([^)]*\)\s*\{/, "export default function $1() {\n  const { user } = useAuth();\n");
  }

  if (content !== original) {
      fs.writeFileSync(file, content);
  }
});
