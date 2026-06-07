const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'src', 'client', 'landing');

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      // Replace light-mode / dark-mode pairs with just the dark-mode class
      content = content.replace(/(?:bg-[a-zA-Z0-9-\[\]\#\/\.]+)\s+dark:(bg-[a-zA-Z0-9-\[\]\#\/\.]+)/g, '$1');
      content = content.replace(/(?:text-[a-zA-Z0-9-\[\]\#\/\.]+)\s+dark:(text-[a-zA-Z0-9-\[\]\#\/\.]+)/g, '$1');
      content = content.replace(/(?:border-[a-zA-Z0-9-\[\]\#\/\.]+)\s+dark:(border-[a-zA-Z0-9-\[\]\#\/\.]+)/g, '$1');
      content = content.replace(/(?:fill-[a-zA-Z0-9-\[\]\#\/\.]+)\s+dark:(fill-[a-zA-Z0-9-\[\]\#\/\.]+)/g, '$1');
      content = content.replace(/(?:stroke-[a-zA-Z0-9-\[\]\#\/\.]+)\s+dark:(stroke-[a-zA-Z0-9-\[\]\#\/\.]+)/g, '$1');
      content = content.replace(/(?:shadow-[a-zA-Z0-9-\[\]\#\/\.]+)\s+dark:(shadow-[a-zA-Z0-9-\[\]\#\/\.]+)/g, '$1');
      content = content.replace(/(?:ring-[a-zA-Z0-9-\[\]\#\/\.]+)\s+dark:(ring-[a-zA-Z0-9-\[\]\#\/\.]+)/g, '$1');

      // Also replace standalone light colors
      content = content.replace(/\bbg-white\b/g, 'bg-[#0d1412]');
      content = content.replace(/\bbg-\[\#F8FAFB\]\b/g, 'bg-[#060b0a]');
      content = content.replace(/\bbg-gray-50\b/g, 'bg-white/5');
      content = content.replace(/\btext-gray-900\b/g, 'text-white');
      content = content.replace(/\btext-gray-800\b/g, 'text-gray-200');
      content = content.replace(/\btext-gray-700\b/g, 'text-gray-300');
      content = content.replace(/\btext-gray-600\b/g, 'text-gray-400');
      content = content.replace(/\btext-gray-500\b/g, 'text-gray-400');
      content = content.replace(/\bborder-gray-100\b/g, 'border-white/[0.03]');
      content = content.replace(/\bborder-gray-200\b/g, 'border-white/10');
      content = content.replace(/\bborder-gray-300\b/g, 'border-white/20');
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDirectory(targetDir);
console.log('Force dark mode complete.');
