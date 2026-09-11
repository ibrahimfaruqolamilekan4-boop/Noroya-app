const fs = require('fs');

const fixFiles = [
  'src/components/AICounselor.tsx',
  'src/components/Explore.tsx',
  'src/components/QuranPractice.tsx',
  'src/components/RevertPath.tsx',
  'src/components/Settings.tsx',
  'src/components/SpiritualPharmacy.tsx',
  'src/context/AuthContext.tsx',
  'src/services/dbService.ts'
];

fixFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Fix implicit any
  content = content.replace(/\(a\)/g, "(a: any)");
  content = content.replace(/\(c\)/g, "(c: any)");
  content = content.replace(/\(d\)/g, "(d: any)");
  content = content.replace(/\(vDoc\)/g, "(vDoc: any)");
  content = content.replace(/_event,/g, "_event: any,");
  content = content.replace(/session\)/g, "session: any)");
  content = content.replace(/\{ session \}/g, "{ session }: any");
  
  // Fix AICounselor
  if (file.includes('AICounselor.tsx')) {
    content = content.replace(/await getDocs\(query\(supabase\.from\('noor_chats'\), where\('userId', '==', user\?\.id\), orderBy\('updatedAt', 'desc'\), limit\(1\)\)\);/,
      `await supabase.from('noor_chats').select('*').eq('userId', user?.id).order('updatedAt', { ascending: false }).limit(1);`);
    content = content.replace(/await addDoc\(supabase\.from\('noor_chats'\), \{[\s\S]*?\}\);/,
      `await supabase.from('noor_chats').insert([{ userId: user?.id, messages: updatedMessages, updatedAt: new Date().toISOString() }]);`);
    content = content.replace(/await updateDoc\(\s*doc\(\s*db\s*,\s*['"]noor_chats['"]\s*,\s*chatId\s*\)\s*,\s*\{([^}]+)\}\s*\)/g, 
      "await supabase.from('noor_chats').update({$1}).eq('id', chatId)");
  }

  // Fix RevertPath & SpiritualPharmacy
  content = content.replace(/await updateDoc\(\s*doc\(\s*db\s*,\s*['"]([^'"]+)['"]\s*,\s*([^)]+)\s*\)\s*,\s*\{([^}]+)\}\s*\)/g, 
    "await supabase.from('$1').update({$3}).eq('id', $2)");
  content = content.replace(/increment\(\d+\)/g, "1");

  fs.writeFileSync(file, content);
});

