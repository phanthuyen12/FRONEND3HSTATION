const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'src', 'client', 'landing');

const replacements = [
  { search: /#00BA4A/g, replace: '#FBBF24' },
  { search: /#00ff9d/g, replace: '#FDE047' },
  { search: /#01c67c/g, replace: '#FDE047' },
  { search: /#00a340/g, replace: '#F59E0B' },
  { search: /#01a643/g, replace: '#F59E0B' },
  { search: /rgba\(0,186,74,/g, replace: 'rgba(251,191,36,' },
  { search: /rgba\(0,\s*186,\s*74,/g, replace: 'rgba(251, 191, 36,' }
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.css') || fullPath.endsWith('.scss')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const rule of replacements) {
        content = content.replace(rule.search, rule.replace);
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDirectory(targetDir);
console.log('Color replacement complete.');
