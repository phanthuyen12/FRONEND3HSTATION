#!/usr/bin/env node

/**
 * Script để đổi tên tất cả các file .js thành .jsx trong thư mục charius
 * Điều này giúp Vite nhận diện JSX syntax trong các files
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const chariusDir = path.join(__dirname, '../src/client/charius');

function renameJsToJsx(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      renameJsToJsx(filePath);
    } else if (file.endsWith('.js')) {
      const newPath = filePath.replace(/\.js$/, '.jsx');
      console.log(`Renaming: ${filePath} -> ${newPath}`);
      fs.renameSync(filePath, newPath);
    }
  });
}

console.log('Starting to rename .js files to .jsx in charius directory...');
renameJsToJsx(chariusDir);
console.log('Done!');

