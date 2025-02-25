const fs = require('fs');
const path = require('path');

// Source and destination directories
const publicDir = path.join(__dirname, '..', 'public');
const distDir = path.join(__dirname, '..', 'dist');

// Create dist directory if it doesn't exist
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// Copy all files from public to dist
fs.readdirSync(publicDir).forEach(file => {
  const srcPath = path.join(publicDir, file);
  const destPath = path.join(distDir, file);
  
  // Skip if it's a directory
  if (fs.lstatSync(srcPath).isDirectory()) {
    return;
  }
  
  // Copy the file
  fs.copyFileSync(srcPath, destPath);
  console.log(`Copied ${file} to dist directory`);
});
